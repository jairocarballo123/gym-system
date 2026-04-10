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

const app = express();

// ============================================
// MANEJADORES DE ERRORES GLOBALES
// ============================================
process.on('uncaughtException', (err) => {
    console.error(' Error no capturado:', err);
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
    methods: ['GET', 'POST', 'PUT','PATCH','DELETE'],
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
// INICIAR SERVIDOR (CON CONEXIÓN A BD)
// ============================================
const PORT = process.env.PORT || 3000;

(async () => {
    try {
        const pool = await getConnection();
        if (pool) {
            console.log(' Conexión establecida a SQL Server');

    
      
            cron.schedule('0 0 * * *', async () => {
                console.log(' Ejecutando actualización automática de membresías vencidas...');
                try {
                    await CronService.actualizarVencidos();
                    console.log(' Actualización completada');
                } catch (error) {
                    console.error('Error en actualización automática:', error.message);
                }
            });

            app.listen(PORT, () => {
                console.log(` Servidor corriendo en puerto ${PORT}`);
                console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
                console.log(` CORS permitido para: ${corsOptions.origin}`);
            });
        }
    } catch (err) {
        console.error(' Error al conectar a SQL Server:', err);
        process.exit(1);
    }
})();