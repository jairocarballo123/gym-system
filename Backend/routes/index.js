// routes/index.js
const express = require('express');
const router = express.Router();


// MIDDLEWARES

const { authenticate } = require('../middlewares/auth.middleware');


// RUTAS

const authRoutes = require('./authRoutes');
const EmpleadorRoutes = require('./EmpleadorRoutes');
const miembrosRoutes = require('./MiembroRoutes');
const planesRoutes = require('./PlanRoutes');
const pagosRoutes = require('./PagoRoutes');
const productosRoutes = require ('./ProductoRoutes')
const cron = require("./cronRoutes")
const asistencia = require('./AsistenciaRoutes');
const dashboard = require('./DashboardRoutes')



//  RUTAS PÚBLICAS 

router.use('/auth', authRoutes);  


//  MIDDLEWARE DE AUTENTICACIÓN GLOBAL

router.use(authenticate);  // ← Todo lo que sigue REQUIERE token válido

//  RUTAS PRIVADAS (SÍ requieren token)

router.use('/empleados', EmpleadorRoutes);
router.use('/miembros', miembrosRoutes);
router.use('/planes', planesRoutes);
router.use('/productos',productosRoutes)
router.use('/asistencia',asistencia)
router.use('/pagos',pagosRoutes)
router.use('/dashboard',dashboard);
router.use('/cron',cron)

module.exports = router;