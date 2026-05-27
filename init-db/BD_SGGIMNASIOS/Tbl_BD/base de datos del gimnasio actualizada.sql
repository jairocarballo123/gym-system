CREATE DATABASE DB_GYM_ENTERPRISE;
GO

USE [DB_GYM_ENTERPRISE];
GO

-- ============================================
-- . CREACIÓN DE ESQUEMAS (Carpetas lógicas)
-- ============================================
CREATE SCHEMA GYM_SECURITY;
GO
CREATE SCHEMA GYM_CATALOGS;
GO
CREATE SCHEMA GYM_HR;
GO
CREATE SCHEMA GYM_OPERATIONS;
GO
CREATE SCHEMA GYM_INVENTORY;
GO
CREATE SCHEMA GYM_BILLING;
GO

-- ============================================
-- 3. ESQUEMA: CATÁLOGOS (Datos fijos)
-- ============================================
CREATE TABLE GYM_CATALOGS.Tbl_Statuses (
    StatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName VARCHAR(50) NOT NULL 
);

CREATE TABLE GYM_CATALOGS.Tbl_PaymentMethods (
    PaymentMethodId INT IDENTITY(1,1) PRIMARY KEY,
    MethodName VARCHAR(50) NOT NULL -- Ej: 1=Efectivo, 2=Tarjeta, 3=Transferencia
);

CREATE TABLE GYM_CATALOGS.Tbl_Currencies (
    CurrencyId INT IDENTITY(1,1) PRIMARY KEY,
    CurrencyCode VARCHAR(10) NOT NULL, -- Ej: NIO, USD
    CurrencyName VARCHAR(50) NOT NULL
);

-- ============================================
-- . ESQUEMA: RECURSOS HUMANOS Y SEGURIDAD
-- ============================================
CREATE TABLE GYM_SECURITY.Tbl_Roles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL -- Ej: Administrador, Entrenador

);

CREATE TABLE GYM_SECURITY.Tbl_AuditLogs (
    AuditId INT IDENTITY(1,1) PRIMARY KEY,
    TableName VARCHAR(100),
    RecordId INT,
    FieldName VARCHAR(100),
    OldValue VARCHAR(MAX),
    NewValue VARCHAR(MAX),
    ChangedBy INT FOREIGN KEY REFERENCES GYM_HR.Tbl_Employees(EmployeeId),
    ChangeDate DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE GYM_HR.Tbl_Employees (
    EmployeeId INT IDENTITY(1,1) PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    RoleId INT FOREIGN KEY REFERENCES GYM_SECURITY.Tbl_Roles(RoleId),
    PasswordHash VARCHAR(255) NOT NULL,
    StatusId INT DEFAULT 1 FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_Statuses(StatusId),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- ============================================
-- 5. ESQUEMA: OPERACIONES (El Gimnasio)
-- ============================================
CREATE TABLE GYM_OPERATIONS.Tbl_Plans (
    PlanId INT IDENTITY(1,1) PRIMARY KEY,
    PlanName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    DurationDays INT NOT NULL,
    StatusId INT DEFAULT 1 FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_Statuses(StatusId)
);

CREATE TABLE GYM_OPERATIONS.Tbl_Members (
    MemberId INT IDENTITY(1,1) PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Address VARCHAR(255),
    Phone VARCHAR(20),
    TrainerId INT NULL FOREIGN KEY REFERENCES GYM_HR.Tbl_Employees(EmployeeId),
    StatusId INT DEFAULT 1 FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_Statuses(StatusId),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Historial de Membresías (Aquí se guarda cada renovación)
CREATE TABLE GYM_OPERATIONS.Tbl_Memberships (
    MembershipId INT IDENTITY(1,1) PRIMARY KEY,
    MemberId INT NOT NULL FOREIGN KEY REFERENCES GYM_OPERATIONS.Tbl_Members(MemberId),
    PlanId INT NOT NULL FOREIGN KEY REFERENCES GYM_OPERATIONS.Tbl_Plans(PlanId),
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    StatusId INT DEFAULT 1 FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_Statuses(StatusId),
    CreatedAt DATETIME DEFAULT GETDATE()
);



-- Control de Asistencia 
CREATE TABLE GYM_OPERATIONS.Tbl_Attendance (
    AttendanceId INT IDENTITY(1,1) PRIMARY KEY,
    MemberId INT NOT NULL FOREIGN KEY REFERENCES GYM_OPERATIONS.Tbl_Members(MemberId),
    AccessDate DATETIME DEFAULT GETDATE(),
    AccessGranted BIT
);

-- ============================================
--  ESQUEMA: INVENTARIO (La tiendita del Gym)
-- ============================================
CREATE TABLE GYM_INVENTORY.Tbl_Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StatusId INT DEFAULT 1 FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_Statuses(StatusId)
);

CREATE TABLE GYM_INVENTORY.Tbl_Stock (
    StockId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES GYM_INVENTORY.Tbl_Products(ProductId),
    CurrentQuantity INT DEFAULT 0,
    LastUpdated DATETIME DEFAULT GETDATE()
);

CREATE TABLE GYM_INVENTORY.Tbl_InventoryMovements (
    MovementId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT FOREIGN KEY REFERENCES GYM_INVENTORY.Tbl_Products(ProductId),
    Quantity INT,
    MovementType VARCHAR(20), 
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- ============================================
-- . ESQUEMA: FACTURACIÓN
-- ============================================
-- Cabecera de la Factura
CREATE TABLE GYM_BILLING.Tbl_Invoices (
    InvoiceId INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceNumber VARCHAR(50) UNIQUE NOT NULL, -- Ej: FAC-0001
    MemberId INT NULL FOREIGN KEY REFERENCES GYM_OPERATIONS.Tbl_Members(MemberId), -- NULL si es un cliente de paso que solo compró agua
    InvoiceDate DATETIME DEFAULT GETDATE(),
    CurrencyId INT NOT NULL FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_Currencies(CurrencyId),
    ExchangeRate DECIMAL(10,4) DEFAULT 1.0000, -- Para el cambio Dólar/Córdoba
    PaymentMethodId INT NOT NULL FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_PaymentMethods(PaymentMethodId),
    ReferenceNumber VARCHAR(100) NULL, -- Voucher del banco (Vacio si es efectivo)
    TotalAmount DECIMAL(10,2) NOT NULL,
    CashierId INT NOT NULL FOREIGN KEY REFERENCES GYM_HR.Tbl_Employees(EmployeeId),
    StatusId INT DEFAULT 1 FOREIGN KEY REFERENCES GYM_CATALOGS.Tbl_Statuses(StatusId)
);



CREATE SEQUENCE GYM_BILLING.Seq_InvoiceNumber
    AS INT
    START WITH 1000  
    INCREMENT BY 1;  
GO



-- Detalle de la Factura (Soporta cobrar Planes Y Productos al mismo tiempo)
CREATE TABLE GYM_BILLING.Tbl_InvoiceDetails (
    DetailId INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceId INT NOT NULL FOREIGN KEY REFERENCES GYM_BILLING.Tbl_Invoices(InvoiceId),
    ItemType VARCHAR(10) NOT NULL, -- 'PLAN' o 'PRODUCT'
    ItemId INT NOT NULL, -- ID del plan o del producto (Dependiendo del ItemType)
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    SubTotal DECIMAL(10,2) NOT NULL
);
GO

 SELECT * FROM GYM_OPERATIONS.Tbl_Members




 USE [DB_GYM_ENTERPRISE];
GO



PRINT '--- 1. CATÁLOGOS (Datos Fijos) ---';
SELECT * FROM GYM_CATALOGS.Tbl_Statuses;
SELECT * FROM GYM_CATALOGS.Tbl_Currencies;
SELECT * FROM GYM_CATALOGS.Tbl_PaymentMethods;
SELECT * FROM GYM_OPERATIONS.Tbl_Attendance

PRINT '--- 2. SEGURIDAD Y RECURSOS HUMANOS ---';
SELECT * FROM GYM_SECURITY.Tbl_Roles;
SELECT * FROM GYM_HR.Tbl_Employees;

PRINT '--- 3. OPERACIONES (Planes, Clientes y Membresías) ---';
SELECT * FROM GYM_OPERATIONS.Tbl_Plans;
SELECT * FROM GYM_OPERATIONS.Tbl_Members;
SELECT * FROM GYM_OPERATIONS.Tbl_Memberships;

PRINT '--- 4. INVENTARIO (Productos y Stock Físico) ---';
SELECT * FROM GYM_INVENTORY.Tbl_Products;
SELECT * FROM GYM_INVENTORY.Tbl_Stock;

PRINT '--- 5. FACTURACIÓN Y CAJA (Cabeceras y Detalles) ---';
SELECT * FROM GYM_BILLING.Tbl_Invoices;
SELECT * FROM GYM_BILLING.Tbl_InvoiceDetails;
SELECT * FROM  GYM_BILLING.Tbl_Payments
SELECT * FROM GYM_SECURITY.Tbl_AuditLogs 

GO

  SELECT * FROM GYM_BILLING.Tbl_InvoiceDetails








