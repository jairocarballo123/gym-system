// services/CronService.js
const CronModel = require('../models/cronModel');

class CronService {
    static async actualizarVencidos(fecha = null) {
        try {
            return await CronModel.ejecutarVencimiento(fecha);
        } catch (error) {
            console.error('Error en CronService.actualizarVencidos:', error.message);
            throw error;
        }
    }
}

module.exports = CronService;