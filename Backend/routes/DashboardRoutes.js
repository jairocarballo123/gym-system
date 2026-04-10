const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController')

router.get('/resumen', DashboardController.obtenerResumen);
router.get('/ultimas-actividades', DashboardController.obtenerUltimasActividades);

module.exports = router;