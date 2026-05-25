const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/PlanController');
const { authorize } = require('../middlewares/role.middleware');

// ========== RUTAS DE ESTADÍSTICAS (van antes de /:id) ==========
router.get('/resumen', PlanController.obtenerResumen);
router.get('/mas-vendido', PlanController.obtenerPlanMasVendido);
router.get('/ingresos', PlanController.ingresosPorPlan);
router.get('/miembros-por-plan', PlanController.getMiembrosPorPlan);
router.get('/proximos-vencer', PlanController.getProximosVencer);

// ========== RUTAS CRUD ==========
router.get('/', PlanController.listar);
router.get('/:id', PlanController.buscarPorId);

router.post('/', authorize(1,3), PlanController.crear);
router.put('/:id', authorize(1,3), PlanController.actualizar);
router.patch('/:id', authorize(1), PlanController.eliminar);

module.exports = router;