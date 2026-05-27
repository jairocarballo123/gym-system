USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER PROCEDURE GYM_BILLING.SP_EliminarPago
    @PaymentId INT,
    @CashierId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Obtener información del pago
        DECLARE @InvoiceId INT, @Amount DECIMAL(10,2);
        SELECT @InvoiceId = InvoiceId, @Amount = AmountPaid
        FROM GYM_BILLING.Tbl_Payments
        WHERE PaymentId = @PaymentId;

        IF @InvoiceId IS NULL
            THROW 50001, 'Pago no encontrado', 1;

        -- Eliminar el pago
        DELETE FROM GYM_BILLING.Tbl_Payments
        WHERE PaymentId = @PaymentId;

        -- Restaurar el balance de la factura
        UPDATE GYM_BILLING.Tbl_Invoices
        SET Balance = Balance + @Amount
        WHERE InvoiceId = @InvoiceId;

        -- Registrar en auditoría
        EXEC sp_set_session_context @key = N'UserId', @value = @CashierId;

        INSERT INTO GYM_SECURITY.Tbl_AuditLogs (TableName, RecordId, FieldName, OldValue, NewValue, ChangedBy)
        VALUES ('Tbl_Payments', @PaymentId, 'ELIMINADO', 'Pago eliminado', 'N/A', @CashierId);

        COMMIT TRANSACTION;

        SELECT 'Pago eliminado correctamente' AS Message;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO