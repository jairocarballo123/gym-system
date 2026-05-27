USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER PROCEDURE GYM_BILLING.SP_RegistrarAbono
    @InvoiceId INT,
    @Amount DECIMAL(10,2),
    @PaymentMethodId INT,
    @CashierId INT,
    @ReferenceNumber VARCHAR(100) = NULL,
    @Notes NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CurrentBalance DECIMAL(10,2);
        SELECT @CurrentBalance = Balance 
        FROM GYM_BILLING.Tbl_Invoices 
        WHERE InvoiceId = @InvoiceId;

        IF @CurrentBalance IS NULL
            THROW 50001, 'Factura no encontrada', 1;

        IF @CurrentBalance <= 0
            THROW 50002, 'La factura ya está totalmente pagada', 1;

        IF @Amount > @CurrentBalance
            THROW 50003, 'El abono no puede superar el saldo pendiente', 1;

        -- REGISTRAR EL PAGO (con Notes)
        INSERT INTO GYM_BILLING.Tbl_Payments 
            (InvoiceId, AmountPaid, PaymentMethodId, CashierId, ReferenceNumber, Notes, PaymentDate)
        VALUES 
            (@InvoiceId, @Amount, @PaymentMethodId, @CashierId, @ReferenceNumber, @Notes, GETDATE());

        -- ACTUALIZAR BALANCE
        UPDATE GYM_BILLING.Tbl_Invoices
        SET Balance = Balance - @Amount
        WHERE InvoiceId = @InvoiceId;

        COMMIT TRANSACTION;

        SELECT 'Abono registrado correctamente' AS Message, 
               (SELECT Balance FROM GYM_BILLING.Tbl_Invoices WHERE InvoiceId = @InvoiceId) AS NuevoBalance;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO