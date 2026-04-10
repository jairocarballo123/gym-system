// routes/empleadosRoutes.js
const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/EmpleadoController');
const { authorize } = require('../middlewares/role.middleware');

// Rutas específicas primero
router.get('/', empleadosController.obtenerTodos);
router.get('/entrenadores', empleadosController.listarEntrenadores);

// Rutas dinámicas con prefijo para evitar conflicto
router.get('/id/:id', empleadosController.obtenerPorId);
router.get('/nombre/:nombre', empleadosController.obtenerPorNombre);

// Solo ADMIN puede crear, actualizar o eliminar
router.post('/', authorize(1), empleadosController.crear);
router.put('/id/:id', authorize(1), empleadosController.actualizar);
router.delete('/id/:id', authorize(1), empleadosController.desactivar);

module.exports = router;