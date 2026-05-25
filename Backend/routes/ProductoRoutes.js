// routes/Producto.routes.js
const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');
const { authorize } = require('../middlewares/role.middleware');


router.get('/resumen', ProductoController.obtenerResumen);
// router.get('/stock-bajo', ProductoController.obtenerStockBajo);
// router.get('/mas-vendidos', ProductoController.obtenerMasVendidos);
router.get('/:id/detalle', ProductoController.obtenerDetalleCompleto); 


// router.get('/:id/movimientos', ProductoController.obtenerMovimientos);
router.get('/:id/stock', ProductoController.obtenerStock);


router.get('/:id', ProductoController.buscarPorId);


router.get('/', ProductoController.listar);


router.post('/', authorize(1), ProductoController.crear);
router.put('/:id', authorize(1), ProductoController.actualizar);
router.patch('/:id/stock', authorize(1), ProductoController.ajustarStock);
router.delete('/:id', authorize(1), ProductoController.desactivar);

module.exports = router;