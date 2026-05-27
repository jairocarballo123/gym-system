USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER PROCEDURE GYM_BILLING.SP_CancelarFactura
    @InvoiceId INT,
    @CashierId INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM GYM_BILLING.Tbl_Invoices WHERE InvoiceId = @InvoiceId)
            THROW 50001, 'Factura no encontrada', 1;

        -- Eliminar pagos asociados
        DELETE FROM GYM_BILLING.Tbl_Payments WHERE InvoiceId = @InvoiceId;

        -- Eliminar detalles de factura
        DELETE FROM GYM_BILLING.Tbl_InvoiceDetails WHERE InvoiceId = @InvoiceId;

        -- Anular la factura (StatusId = 2 = Inactivo)
        UPDATE GYM_BILLING.Tbl_Invoices
        SET StatusId = 2,  -- ← Inactivo
            Balance = 0
        WHERE InvoiceId = @InvoiceId;

        -- Registrar en auditoría
        EXEC sp_set_session_context @key = N'UserId', @value = @CashierId;

        INSERT INTO GYM_SECURITY.Tbl_AuditLogs (TableName, RecordId, FieldName, OldValue, NewValue, ChangedBy)
        VALUES ('Tbl_Invoices', @InvoiceId, 'CANCELADA', 'Factura activa', 'Factura anulada', @CashierId);

        COMMIT TRANSACTION;

        SELECT 'Factura cancelada correctamente' AS Message;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO