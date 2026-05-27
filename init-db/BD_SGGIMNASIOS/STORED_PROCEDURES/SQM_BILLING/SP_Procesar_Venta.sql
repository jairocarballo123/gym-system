USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER PROCEDURE GYM_BILLING.SP_ProcesarVenta
    @JsonData NVARCHAR(MAX) 
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @MemberId INT, @CurrencyId INT, @PaymentMethodId INT, @ReferenceNumber VARCHAR(100), 
            @AmountPaid DECIMAL(10,2), @CashierId INT, @ExchangeRate DECIMAL(10,4), @Notes NVARCHAR(255);
    DECLARE @TotalAmount DECIMAL(10,2) = 0;
    DECLARE @InvoiceId INT;
    DECLARE @InvoiceNumber VARCHAR(50);
    DECLARE @Balance DECIMAL(10,2);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Extraer datos del JSON
        SELECT 
            @MemberId = JSON_VALUE(@JsonData, '$.factura.MemberId'),
            @CurrencyId = JSON_VALUE(@JsonData, '$.factura.CurrencyId'),
            @PaymentMethodId = JSON_VALUE(@JsonData, '$.factura.PaymentMethodId'),
            @ReferenceNumber = JSON_VALUE(@JsonData, '$.factura.ReferenceNumber'),
            @AmountPaid = JSON_VALUE(@JsonData, '$.factura.AmountPaid'),
            @CashierId = JSON_VALUE(@JsonData, '$.factura.CashierId'),
            @ExchangeRate = ISNULL(JSON_VALUE(@JsonData, '$.factura.ExchangeRate'), 1.0000),
            @Notes = JSON_VALUE(@JsonData, '$.factura.Notes');

        -- Calcular total de detalles
        SELECT @TotalAmount = SUM(CAST(JSON_VALUE(value, '$.SubTotal') AS DECIMAL(10,2)))
        FROM OPENJSON(@JsonData, '$.detalles');

      
        IF @AmountPaid >= @TotalAmount
            SET @Balance = 0;
        ELSE
            SET @Balance = @TotalAmount - @AmountPaid;

        -- Generar número de factura
        SET @InvoiceNumber = 'FAC-' + RIGHT('000000' + CAST(NEXT VALUE FOR GYM_BILLING.Seq_InvoiceNumber AS VARCHAR), 6);

        -- INSERTAR CABECERA
        INSERT INTO GYM_BILLING.Tbl_Invoices 
            (InvoiceNumber, MemberId, CurrencyId, ExchangeRate, PaymentMethodId, ReferenceNumber, TotalAmount, Balance, CashierId, StatusId)
        VALUES 
            (@InvoiceNumber, @MemberId, @CurrencyId, @ExchangeRate, @PaymentMethodId, @ReferenceNumber, @TotalAmount, @Balance, @CashierId, 1);
        
        SET @InvoiceId = SCOPE_IDENTITY();

        -- INSERTAR DETALLES
        INSERT INTO GYM_BILLING.Tbl_InvoiceDetails (InvoiceId, ItemType, ItemId, Quantity, UnitPrice, SubTotal)
        SELECT 
            @InvoiceId, 
            JSON_VALUE(value, '$.ItemType'), 
            JSON_VALUE(value, '$.ItemId'), 
            JSON_VALUE(value, '$.Quantity'), 
            JSON_VALUE(value, '$.UnitPrice'), 
            JSON_VALUE(value, '$.SubTotal')
        FROM OPENJSON(@JsonData, '$.detalles');

        -- REGISTRAR EL PAGO (con Notes)
        INSERT INTO GYM_BILLING.Tbl_Payments (InvoiceId, AmountPaid, PaymentMethodId, CashierId, ReferenceNumber, Notes)
        VALUES (@InvoiceId, @AmountPaid, @PaymentMethodId, @CashierId, @ReferenceNumber, @Notes);

        -- REGISTRO DE AUDITORÍA
        INSERT INTO GYM_SECURITY.Tbl_AuditLogs (TableName, RecordId, FieldName, OldValue, NewValue, ChangedBy)
        VALUES ('Tbl_Invoices', @InvoiceId, 'NUEVA_VENTA', 'NULL', @InvoiceNumber, @CashierId);

        COMMIT TRANSACTION;

        SELECT @InvoiceId AS InvoiceId, @InvoiceNumber AS InvoiceNumber, 'SUCCESS' AS Message;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

