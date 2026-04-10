// routes/PagoRoutes.js
const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/pagoController');
const { authorize } = require('../middlewares/role.middleware');

// ============================================
// RUTAS PÚBLICAS (cualquier empleado logueado puede ver)
// ============================================
router.get('/ingresos/hoy', PagoController.obtenerIngresosHoy);
router.get('/ingresos/semana', PagoController.obtenerIngresosSemana);
router.get('/ingresos/mes', PagoController.obtenerIngresosMes);
router.get('/ingresos/metodo-pago', PagoController.obtenerIngresosPorMetodoPago);
router.get('/facturas-pendientes', PagoController.obtenerFacturasPendientes);
router.get('/:id/pagos', PagoController.obtenerHistorialPagos);
router.get('/:id', PagoController.obtenerDetalleFactura);
router.get('/', PagoController.listarFacturas);

// ============================================
// RUTAS SOLO ADMIN (requieren roleId = 1)
// ============================================
router.post('/', authorize(1), PagoController.procesarVenta);
router.post('/abono', authorize(1), PagoController.registrarAbono);
router.delete('/pagos/:paymentId', authorize(1), PagoController.eliminarPago);
router.delete('/facturas/:invoiceId', authorize(1), PagoController.cancelarFactura);

module.exports = router;