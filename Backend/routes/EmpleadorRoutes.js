const express = require('express');
const router = express.Router();

const {
    registrarEmpleado,
    listarEmpleados,
    buscarEmpleadoPORid,
    actualizarEmpleado,
    eliminarEmpleado,
    buscarEmpleadosPorRol,
    obtenerMiembrosAsignados,
    buscarEmpleadosPorNombre
} = require('../controllers/EmpleadoController');


router.get('/rol/:rol', buscarEmpleadosPorRol); 

router.get('/:id/miembros', obtenerMiembrosAsignados);

router.get('/', listarEmpleados);

router.post('/', registrarEmpleado);

router.get('/id/:id', buscarEmpleadoPORid);

router.get('/nombre/:nombre', buscarEmpleadosPorNombre);

router.put('/:id', actualizarEmpleado);

router.delete('/:id', eliminarEmpleado);

module.exports = router;