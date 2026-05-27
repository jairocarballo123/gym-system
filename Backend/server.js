// server.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const { getConnection } = require('./config/db');
const CronService = require('./services/cronServices');
const EmpleadoService = require('./services/EmpleadoServices'); // ◄ Ajustado según tu ruta actual

const app = express();

// ============================================
// MANEJADORES DE ERRORES GLOBALES
// ============================================
process.on('uncaughtException', (err) => {
    console.error('Error no capturado:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Promesa rechazada no manejada:', err);
    process.exit(1);
});

// ============================================
// SEGURIDAD BÁSICA
// ============================================
app.use(helmet());

// ============================================
// CONFIGURACIÓN DE CORS
// ============================================
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// ============================================
// LOGS
// ============================================
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ============================================
// RATE LIMITING
// ============================================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        message: 'Demasiadas peticiones, intenta más tarde'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// RUTAS
// ============================================
app.use('/api', require('./routes'));

// ============================================
// RUTA DE PRUEBA
// ============================================
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando',
        timestamp: new Date().toISOString()
    });
});

// ============================================
// MANEJO DE ERRORES 404
// ============================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// ============================================
// MIDDLEWARE DE ERRORES
// ============================================
app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    const status = err.status || err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || 'Error interno del servidor'
    };

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(status).json(response);
});

// ============================================
// FUNCIÓN SEMILLA: CREACIÓN DE CATÁLOGOS Y USUARIO INICIAL
// ============================================
async function verificarYCrearAdminInicial(pool) {
    try {
        console.log('[Semilla] Iniciando verificacion de catalogos indispensables...');

        // 1. Verificar e insertar Estados
        const checkStatuses = await pool.request().query('SELECT COUNT(*) AS total FROM GYM_CATALOGS.Tbl_Statuses');
        if (checkStatuses.recordset[0].total === 0) {
            console.log('[Semilla] Insertando Estados obligatorios...');
            await pool.request().query(`
                INSERT INTO GYM_CATALOGS.Tbl_Statuses (StatusName)
                VALUES ('Activo'), ('Inactivo');
            `);
            console.log('[Semilla] Estados configurados con exito.');
        }

        // 2. Verificar e insertar Monedas
        const checkCurrencies = await pool.request().query('SELECT COUNT(*) AS total FROM GYM_CATALOGS.Tbl_Currencies');
        if (checkCurrencies.recordset[0].total === 0) {
            console.log('[Semilla] Insertando Monedas obligatorias...');
            await pool.request().query(`
                INSERT INTO GYM_CATALOGS.Tbl_Currencies (CurrencyCode, CurrencyName)
                VALUES ('NIO', 'Cordobas'), ('USD', 'Dolares');
            `);
            console.log('[Semilla] Monedas configuradas con exito.');
        }

        // 3. Verificar e insertar Métodos de Pago
        const checkPayments = await pool.request().query('SELECT COUNT(*) AS total FROM GYM_CATALOGS.Tbl_PaymentMethods');
        if (checkPayments.recordset[0].total === 0) {
            console.log('[Semilla] Insertando Metodos de Pago obligatorios...');
            await pool.request().query(`
                INSERT INTO GYM_CATALOGS.Tbl_PaymentMethods (MethodName)
                VALUES ('Efectivo'), ('Tarjeta'), ('Transferencia');
            `);
            console.log('[Semilla] Metodos de Pago configurados con exito.');
        }

        // 4. Verificar e insertar Roles de Seguridad
        const checkRoles = await pool.request().query('SELECT COUNT(*) AS total FROM GYM_SECURITY.Tbl_Roles');
        if (checkRoles.recordset[0].total === 0) {
            console.log('[Semilla] Insertando Roles del Sistema...');
            await pool.request().query(`
                INSERT INTO GYM_SECURITY.Tbl_Roles (RoleName)
                VALUES ('Administrador'), ('Entrenador'), ('Recepcionista');
            `);
            console.log('[Semilla] Roles configurados con exito.');
        }

        // 5. Verificar e insertar Administrador Inicial
        const resultado = await pool.request().query('SELECT COUNT(*) AS total FROM GYM_HR.Tbl_Employees');
        const cantidadEmpleados = resultado.recordset[0].total;

        if (cantidadEmpleados === 0) {
            console.log('[Semilla] Base de datos limpia detectada. Creando Administrador Inicial...');

            const datosAdminInicial = {
                nombre: 'Usuario Admin',
                telefono: '00000000',
                roleId: 1,
                statusId: 1,
                password: process.env.INITIAL_ADMIN_PASSWORD || 'Admin123!',
                specialty: '',    
                availability: ''   
            };

            const adminCreado = await EmpleadoService.crearEmpleado(datosAdminInicial);
            console.log(`[Semilla] Administrador creado de forma segura con ID: ${adminCreado.id}`);
        } else {
            console.log('[Semilla] La tabla ya tiene registros. Omitiendo usuario inicial.');
        }
    } catch (error) {
        console.error('[Semilla] Error critico en la inicializacion automatica:', error.message);
    }
}

// ============================================
// INICIAR SERVIDOR (CON CONEXIÓN A BD)
// ============================================
const PORT = process.env.PORT || 3000;

(async () => {
    try {
        const pool = await getConnection();
        if (pool) {
            console.log('Conexion establecida a SQL Server');

            // Ejecución segura de nuestra semilla completa
            await verificarYCrearAdminInicial(pool);

            cron.schedule('* * * * *', async () => {
                console.log('Ejecutando actualizacion de membresias vencidas...');
                try {
                    await CronService.actualizarVencidos();
                    console.log('Actualizacion completada');
                } catch (error) {
                    console.error('Error en actualizacion automatica:', error.message);
                }
            });

            app.listen(PORT, () => {
                console.log(`Servidor corriendo en puerto ${PORT}`);
                console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
                console.log(`CORS permitido para: ${corsOptions.origin}`);
            });
        }
    } catch (err) {
        console.error('Error al conectar a SQL Server:', err);
        process.exit(1);
    }
})();