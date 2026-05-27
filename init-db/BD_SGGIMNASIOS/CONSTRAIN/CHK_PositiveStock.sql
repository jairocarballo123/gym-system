USE [DB_GYM_ENTERPRISE];
GO

-- 1. Primero verificamos si el candado ya existe. Si existe, lo quitamos.
IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CHK_PositiveStock')
BEGIN
    ALTER TABLE GYM_INVENTORY.Tbl_Stock DROP CONSTRAINT CHK_PositiveStock;
END
GO

-- 2. Lo volvemos a crear (Así, si algún día le cambias la fórmula, se actualiza sin problemas)
ALTER TABLE GYM_INVENTORY.Tbl_Stock
ADD CONSTRAINT CHK_PositiveStock CHECK (CurrentQuantity >= 0);
GO