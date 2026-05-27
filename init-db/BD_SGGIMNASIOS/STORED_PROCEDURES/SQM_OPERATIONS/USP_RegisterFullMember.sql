USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER PROCEDURE GYM_OPERATIONS.USP_RegisterFullMember
    @FullName VARCHAR(100),
    @Phone VARCHAR(20),
    @Address VARCHAR(255),
    @TrainerId INT = NULL, 
    @PlanId INT,
    @PaymentMethodId INT,
    @CashierId INT,
    @CurrencyId INT = 1
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Crear al Miembro (Ahora guarda el TrainerId si se envía)
        DECLARE @NewMemberId INT;
        INSERT INTO GYM_OPERATIONS.Tbl_Members (FullName, Phone, Address, TrainerId, StatusId)
        VALUES (@FullName, @Phone, @Address, @TrainerId, 1);
        
        -- SCOPE_IDENTITY() captura el ID del miembro que se acaba de insertar
        SET @NewMemberId = SCOPE_IDENTITY(); 

        -- 2. Crear la Factura
        DECLARE @NewInvoiceId INT;
        -- Buscamos automáticamente el precio del plan
        DECLARE @Total DECIMAL(10,2) = (SELECT Price FROM GYM_OPERATIONS.Tbl_Plans WHERE PlanId = @PlanId);
        
        -- Generamos número de factura (Ej: FAC-000001) usando la Secuencia
        DECLARE @InvoiceNum VARCHAR(20) = 'FAC-' + RIGHT('000000' + CAST(NEXT VALUE FOR GYM_BILLING.Seq_InvoiceNumber AS VARCHAR), 6); 

        INSERT INTO GYM_BILLING.Tbl_Invoices (InvoiceNumber, MemberId, CurrencyId, PaymentMethodId, TotalAmount, CashierId)
        VALUES (@InvoiceNum, @NewMemberId, @CurrencyId, @PaymentMethodId, @Total, @CashierId);
        
        SET @NewInvoiceId = SCOPE_IDENTITY();

        -- 3. Insertar Detalle (Aquí "despierta" tu TRIGGER Trg_ProcessInvoiceDetail para crear la membresía)
        INSERT INTO GYM_BILLING.Tbl_InvoiceDetails (InvoiceId, ItemType, ItemId, Quantity, UnitPrice, SubTotal)
        VALUES (@NewInvoiceId, 'PLAN', @PlanId, 1, @Total, @Total);

        -- 4. 🔥 NUEVO: Registrar el Pago en la nueva tabla de Caja
        INSERT INTO GYM_BILLING.Tbl_Payments (InvoiceId, AmountPaid, PaymentMethodId, CashierId, ReferenceNumber)
        VALUES (@NewInvoiceId, @Total, @PaymentMethodId, @CashierId, NULL);

        -- 5. 🔥 NUEVO: Registrar en Auditoría la creación del nuevo cliente
        INSERT INTO GYM_SECURITY.Tbl_AuditLogs (TableName, RecordId, FieldName, OldValue, NewValue, ChangedBy)
        VALUES ('Tbl_Members', @NewMemberId, 'NUEVO_INGRESO', 'NULL', @FullName, @CashierId);

        COMMIT TRANSACTION;

        -- Retornamos éxito para que Node.js lo lea
        SELECT @NewMemberId AS MemberId, @InvoiceNum AS InvoiceNumber, 'SUCCESS' AS Message;

    END TRY
    BEGIN CATCH
        -- Si ALGO falla, se deshace todo (No hay cliente fantasma, ni factura sin pago)
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        
        -- Capturamos el error real y lo enviamos a Node.js
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO