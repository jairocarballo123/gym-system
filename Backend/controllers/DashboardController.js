const DashboardService = require('../services/DashboardServices');

class DashboardController {
  static async obtenerResumen(req, res) {
    try {
      const data = await DashboardService.obtenerResumen();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async obtenerUltimasActividades(req, res) {
    try {
      const limite = req.query.limite || 10;
      const data = await DashboardService.obtenerUltimasActividades(limite);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = DashboardController;