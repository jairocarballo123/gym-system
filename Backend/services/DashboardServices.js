const DashboardModel = require('../models/DashboardModel');

class DashboardService {
  static async obtenerResumen() {
    try {
      return await DashboardModel.obtenerResumen();
    } catch (error) {
      throw new Error(`Error al obtener resumen: ${error.message}`);
    }
  }

  static async obtenerUltimasActividades(limite = 10) {
    try {
      return await DashboardModel.obtenerUltimasActividades(limite);
    } catch (error) {
      throw new Error(`Error al obtener actividades: ${error.message}`);
    }
  }
}

module.exports = DashboardService;