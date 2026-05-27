USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER TRIGGER GYM_INVENTORY.Trg_AuditProducts
ON GYM_INVENTORY.Tbl_Products
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Intentamos obtener el usuario de Node.js, si no hay, ponemos 1 por defecto (Admin)
    DECLARE @UserId INT = ISNULL(CAST(SESSION_CONTEXT(N'UserId') AS INT), 1);

    -- 1. Vigilar cambio en el PRECIO (Price)
    IF UPDATE(Price)
    BEGIN
        INSERT INTO GYM_SECURITY.Tbl_AuditLogs (TableName, RecordId, FieldName, OldValue, NewValue, ChangedBy)
        SELECT 'Tbl_Products', i.ProductId, 'Price', CAST(d.Price AS VARCHAR(MAX)), CAST(i.Price AS VARCHAR(MAX)), @UserId
        FROM inserted i INNER JOIN deleted d ON i.ProductId = d.ProductId
        WHERE i.Price <> d.Price; -- Solo si el valor realmente cambió
    END

    -- 2. Vigilar cambio en el ESTADO (StatusId)
    IF UPDATE(StatusId)
    BEGIN
        INSERT INTO GYM_SECURITY.Tbl_AuditLogs (TableName, RecordId, FieldName, OldValue, NewValue, ChangedBy)
        SELECT 'Tbl_Products', i.ProductId, 'StatusId', CAST(d.StatusId AS VARCHAR(5)), CAST(i.StatusId AS VARCHAR(5)), @UserId
        FROM inserted i INNER JOIN deleted d ON i.ProductId = d.ProductId
        WHERE i.StatusId <> d.StatusId;
    END

    -- 3. Vigilar cambio en el NOMBRE DEL PRODUCTO (ProductName)
    IF UPDATE(ProductName)
    BEGIN
        INSERT INTO GYM_SECURITY.Tbl_AuditLogs (TableName, RecordId, FieldName, OldValue, NewValue, ChangedBy)
        SELECT 'Tbl_Products', i.ProductId, 'ProductName', d.ProductName, i.ProductName, @UserId
        FROM inserted i INNER JOIN deleted d ON i.ProductId = d.ProductId
        WHERE i.ProductName <> d.ProductName;
    END
END;
GO