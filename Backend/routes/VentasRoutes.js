const express = require('express');
const router = express.Router();
const VentasController = require('../controllers/VentasController');

// Ruta para el flujo de recepción completa
router.post('/Ventas', VentasController.crearVentaRecepcion);

module.exports = router;