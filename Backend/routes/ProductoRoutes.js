// routes/Producto.routes.js
const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');
const { authorize } = require('../middlewares/role.middleware');

// ========== PRIMERO: RUTAS SIN PARÁMETROS (estadísticas) ==========
router.get('/resumen', ProductoController.obtenerResumen);
router.get('/stock-bajo', ProductoController.obtenerStockBajo);
router.get('/mas-vendidos', ProductoController.obtenerMasVendidos);

// ========== SEGUNDO: RUTAS CON PARÁMETROS ESPECÍFICAS ==========
router.get('/:id/movimientos', ProductoController.obtenerMovimientos);
router.get('/:id/stock', ProductoController.obtenerStock);

// ========== TERCERO: RUTA CON PARÁMETRO SIMPLE ==========
router.get('/:id', ProductoController.buscarPorId);

// ========== CUARTO: RUTA GENERAL ==========
router.get('/', ProductoController.listar);

// ========== QUINTO: OPERACIONES DE ESCRITURA ==========
router.post('/', authorize(1), ProductoController.crear);
router.put('/:id', authorize(1), ProductoController.actualizar);
router.patch('/:id/stock', authorize(1), ProductoController.ajustarStock);
router.delete('/:id', authorize(1), ProductoController.desactivar);

module.exports = router;