const Plan = require('../Entidades/Plan'); 
const PlanModel = require('../models/PlanModel');

const PlanService = {

    async crear(data) {
        try {
            
            const nuevoPlan = new Plan(
                data.nombre,
                data.precio,
                data.duracion_dias,
                data.descripcion
            );   
            nuevoPlan.validarDatos();

            
            return await PlanModel.crear(nuevoPlan);

        } catch (error) {
            throw new Error(error.message);
        }
    },

    async listar() {
        try {
            return await PlanModel.listar();
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async buscarPorId(id) {
        try {
            const plan = await PlanModel.buscarPorId(id);
            if (!plan) throw new Error('Plan no encontrado');
            return plan;
        } catch (error) {
            throw new Error(error.message);
        }
    },

async actualizar(id, data) {
    try {
        
        if (data.precio && data.precio < 0) throw new Error('El precio no puede ser negativo');
        if (data.duracion_dias && data.duracion_dias < 1) throw new Error('La duración debe ser mayor a 0');

        return await PlanModel.actualizar(id, data);
    } catch (error) {
        throw new Error(error.message);
    }
},

async eliminar(id) {
    try {
        return await PlanModel.eliminar(id);
    } catch (error) {
        throw new Error(error.message);
    }
}

};

module.exports = PlanService;