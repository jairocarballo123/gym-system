const express = require('express');
const router = express.Router();

const {
    crearPlan,
    listarPlanes,
    buscarPlan,
    actualizarPlan, 
    eliminarPlan    
} = require('../controllers/PlanController');

router.get('/', listarPlanes);

router.post('/', crearPlan);

router.get('/:id', buscarPlan);

router.put('/:id', actualizarPlan); 

router.delete('/:id', eliminarPlan);   

module.exports = router;