// routes/Asistencia.routes.js
const express = require('express');
const router = express.Router();
const AsistenciaController = require('../controllers/AsistenciaController');


router.post('/registrar', AsistenciaController.registrarEntrada);


router.get('/hoy', AsistenciaController.obtenerAsistenciasHoy);
router.get('/hora-pico', AsistenciaController.obtenerHoraPico);
router.get('/promedio-diario', AsistenciaController.obtenerPromedioDiario);
router.get('/dias-afluencia', AsistenciaController.obtenerDiasMasAfluencia);
router.get('/miembros-inactivos', AsistenciaController.obtenerMiembrosInactivos);
router.get('/top-activos', AsistenciaController.obtenerTopActivos);
router.get('/miembro/:id', AsistenciaController.obtenerHistorialPorMiembro);

module.exports = router;