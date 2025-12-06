// routes/asistenciaRoutes.js
const express = require('express');
const router = express.Router();

const {
  registrarEntrada,
  listarAsistencias,
  buscarAsistenciasPorMiembro,
  buscarAsistenciasPorFecha,
  obtenerEstadisticas,
  eliminarAsistencia
} = require('../controllers/AsistenciaController');

// 📌 RUTAS PRINCIPALES

// Registrar nueva entrada de asistencia
router.post('/', registrarEntrada);

// Listar todas las asistencias
router.get('/', listarAsistencias);

// Obtener estadísticas de asistencias
router.get('/estadisticas', obtenerEstadisticas);

// 📌 RUTAS ESPECÍFICAS

// Buscar asistencias por miembro
router.get('/miembro/:miembroId', buscarAsistenciasPorMiembro);

// Buscar asistencias por fecha (formato: YYYY-MM-DD)
router.get('/fecha/:fecha', buscarAsistenciasPorFecha);

// Eliminar registro de asistencia
router.delete('/:id', eliminarAsistencia);

module.exports = router;