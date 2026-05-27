USE [DB_GYM_ENTERPRISE];
GO

CREATE OR ALTER TRIGGER GYM_BILLING.Trg_ProcessInvoiceDetail
ON GYM_BILLING.Tbl_InvoiceDetails
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. GESTIÓN DE PRODUCTOS (STOCK) - Se mantiene igual, funciona bien.
    UPDATE s
    SET s.CurrentQuantity = s.CurrentQuantity - i.Quantity,
        s.LastUpdated = GETDATE()
    FROM GYM_INVENTORY.Tbl_Stock s
    INNER JOIN inserted i ON s.ProductId = i.ItemId
    WHERE i.ItemType = 'PRODUCT';

    INSERT INTO GYM_INVENTORY.Tbl_InventoryMovements (ProductId, Quantity, MovementType, CreatedAt)
    SELECT i.ItemId, i.Quantity, 'SALE', GETDATE()
    FROM inserted i
    WHERE i.ItemType = 'PRODUCT';

    -- 2. GESTIÓN DE PLANES (MEMBRESÍAS) CON ACUMULACIÓN DE DÍAS
    -- Usamos un CROSS APPLY para calcular la fecha de inicio dinámicamente para cada miembro
    INSERT INTO GYM_OPERATIONS.Tbl_Memberships (MemberId, PlanId, StartDate, EndDate, StatusId, CreatedAt)
    SELECT 
        inv.MemberId, 
        i.ItemId,
        -- Lógica de Inicio: Si la fecha fin actual es mayor a hoy, empezamos ahí. Si no, empezamos hoy.
        CASE 
            WHEN m_actual.MaxEndDate > GETDATE() THEN m_actual.MaxEndDate 
            ELSE GETDATE() 
        END as NewStartDate,
        -- Lógica de Fin: Fecha de Inicio calculada + Días del Plan
        DATEADD(day, p.DurationDays, 
            CASE 
                WHEN m_actual.MaxEndDate > GETDATE() THEN m_actual.MaxEndDate 
                ELSE GETDATE() 
            END
        ) as NewEndDate,
        1, 
        GETDATE()
    FROM inserted i
    INNER JOIN GYM_BILLING.Tbl_Invoices inv ON i.InvoiceId = inv.InvoiceId
    INNER JOIN GYM_OPERATIONS.Tbl_Plans p ON i.ItemId = p.PlanId
    -- Aquí buscamos la membresía activa más reciente del miembro
    CROSS APPLY (
        SELECT MAX(EndDate) as MaxEndDate
        FROM GYM_OPERATIONS.Tbl_Memberships
        WHERE MemberId = inv.MemberId AND StatusId = 1
    ) m_actual
    WHERE i.ItemType = 'PLAN' AND inv.MemberId IS NOT NULL;

    -- 3. ACTUALIZAR ESTADO DEL MIEMBRO
    UPDATE m
    SET m.StatusId = 1
    FROM GYM_OPERATIONS.Tbl_Members m
    INNER JOIN GYM_BILLING.Tbl_Invoices inv ON m.MemberId = inv.MemberId
    INNER JOIN inserted i ON inv.InvoiceId = i.InvoiceId
    WHERE i.ItemType = 'PLAN' AND m.StatusId != 1;

END;
GO