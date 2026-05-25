const express = require('express');
const router = express.Router();
const {authorize} = require('../middlewares/role.middleware')
const VentasController = require('../controllers/VentasController');

// Ruta para el flujo de recepción completa
router.post('/Ventas', authorize(1,3), VentasController.crearVentaRecepcion);

module.exports = router;