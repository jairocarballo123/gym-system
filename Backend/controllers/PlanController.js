const PlanService = require('../services/PlanServices');

async function crearPlan(req, res) {
  try {
    const plan = await PlanService.crear(req.body);
    res.json(plan); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


async function listarPlanes(req, res) {
    try {
        const planes = await PlanService.listar();
        res.status(200).json({
            success: true,
            total: planes.length,
            data: planes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

async function buscarPlan(req, res) {
    try {
        const { id } = req.params;
        const plan = await PlanService.buscarPorId(id);
        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (error) {
        const status = error.message.includes('no encontrado') ? 404 : 400;
        res.status(status).json({
            success: false,
            error: error.message
        });
    }

}



async function eliminarPlan(req, res) {
    try {
        const { id } = req.params;
        const resultado = await PlanService.eliminar(id);
        
        res.status(200).json({
            success: true,
            data: resultado
        });
    } catch (error) {
        const status = error.message.includes('no encontrado') ? 404 : 400;
        res.status(status).json({
            success: false,
            error: error.message
        });
    }
}



async function actualizarPlan(req, res) {
    try {
        const { id } = req.params;
        const planActualizado = await PlanService.actualizar(id, req.body);
        
        res.status(200).json({
            success: true,
            mensaje: 'Plan actualizado correctamente',
            data: planActualizado
        });
    } catch (error) {
        const status = error.message.includes('no encontrado') ? 404 : 400;
        res.status(status).json({
            success: false,
            error: error.message
        });
    }
}


module.exports = {
    crearPlan,
    listarPlanes,
    buscarPlan,
    actualizarPlan,
    eliminarPlan   
};
