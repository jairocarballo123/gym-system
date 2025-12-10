-- ============================================
-- Tabla: Miembro
-- ============================================
CREATE TABLE miembro (
    id VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    plan_actual VARCHAR(50),
    fecha_vencimiento DATE,
    estado_membresia VARCHAR(20) DEFAULT 'inactivo',
    entrenador_id VARCHAR(10) REFERENCES empleados(id)
);

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
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
-- Tabla: Pagos
-- ============================================
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    recibo_id VARCHAR(50) NOT NULL,
    miembro_id VARCHAR(10) NOT NULL REFERENCES miembro(id) ON DELETE CASCADE,
    monto NUMERIC(10,2) NOT NULL,
    fecha_pago DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Tabla: Asistencias
-- ============================================
CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    miembro_id VARCHAR(10) NOT NULL REFERENCES miembro(id) ON DELETE CASCADE,
    fecha DATE DEFAULT CURRENT_DATE,
    hora_entrada TIME DEFAULT CURRENT_TIME,
    hora_salida TIME
);
