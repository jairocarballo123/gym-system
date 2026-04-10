// controllers/CronController.js
const CronService = require('../services/cronServices');

class CronController {
    static async ejecutarVencimiento(req, res) {
        try {
            await CronService.actualizarVencidos(req.body.fecha);
            res.json({ success: true, message: 'Membresías vencidas actualizadas' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = CronController;