// services/CronService.js
const CronModel = require('../models/cronModel');

class CronService {
    static async actualizarVencidos(fecha = null) {
        return await CronModel.ejecutarVencimiento(fecha);
    }
}

module.exports = CronService;