-- ============================================
-- Tabla: Empleados
-- ============================================
CREATE TABLE empleados (
    id VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50),
    especialidad VARCHAR(50),
    disponibilidad VARCHAR(50),
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    activo VARCHAR(10) DEFAULT 'activo',
    password VARCHAR(255)
);

-- ============================================
-- Tabla: Planes
-- ============================================
CREATE TABLE planes (
    id VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    duracion_dias INT NOT NULL,
    descripcion TEXT,
    activo VARCHAR(10) DEFAULT 'activo'
);

-- ============================================
-- Tabla: Miembro
-- ============================================
CREATE TABLE miembro (
    id VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    plan_actual_id VARCHAR(10),
    fecha_vencimiento DATE,
    estado_membresia VARCHAR(20) DEFAULT 'inactivo',
    entrenador_id VARCHAR(10),
    FOREIGN KEY (plan_actual_id) REFERENCES planes(id),
    FOREIGN KEY (entrenador_id) REFERENCES empleados(id)
);

-- ============================================
-- Tabla: Pagos
-- ============================================
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    recibo_id VARCHAR(50) NOT NULL,
    miembro_id VARCHAR(10) NOT NULL REFERENCES miembro(id) ON DELETE CASCADE,
    monto NUMERIC(10,2) NOT NULL,
    fecha_pago DATE DEFAULT CURRENT_DATE
);

-- ============================================
-- Tabla: Asistencia
-- ============================================
CREATE TABLE asistencia (
    id SERIAL PRIMARY KEY,
    miembro_id VARCHAR(10) NOT NULL REFERENCES miembro(id) ON DELETE CASCADE,
    fecha_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
