
const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/MiembroController');
const { authorize } = require('../middlewares/role.middleware');

// CUALQUIER empleado logueado puede ver miembros
router.get('/resumen', MemberController.obtenerResumen);
router.get('/:id/detalle', MemberController.obtenerDetalleCompleto); // ← primero la específica
router.get('/:id', MemberController.buscarPorId);                   
router.get('/', MemberController.listarTodos);
// Solo ADMIN puede crear, actualizar o eliminar
router.post('/', authorize(1), MemberController.registerFullMember);
router.put('/:id', authorize(1), MemberController.actualizar);
router.delete('/:id', authorize(1), MemberController.eliminar);
// routes/MiembroRoutes.js - agregar después de las rutas existentes



module.exports = router;