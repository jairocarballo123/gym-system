// controllers/Asistencia.controller.js
const AsistenciaService = require('../services/AsistenciaServices');

class AsistenciaController {

  static async registrarEntrada(req, res) {
    try {
      const { memberId } = req.body;
      if (!memberId) {
        return res.status(400).json({ 
          success: false, 
          message: 'memberId es requerido' 
        });
      }
      const result = await AsistenciaService.registrarEntrada(memberId, req.user.id);
      res.status(200).json({ 
        success: true, 
        message: result.message 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  

  static async obtenerAsistenciasHoy(req, res) {
    try {
      const asistencias = await AsistenciaService.obtenerAsistenciasHoy();
      res.status(200).json({ 
        success: true, 
        data: asistencias 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

 
  static async obtenerHistorialPorMiembro(req, res) {
    try {
      const { id } = req.params;
      const historial = await AsistenciaService.obtenerHistorialPorMiembro(id);
      res.status(200).json({ 
        success: true, 
        data: historial 
      });
    } catch (error) {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  static async obtenerHoraPico(req, res) {
    try {
      const data = await AsistenciaService.obtenerHoraPico();
      res.status(200).json({ 
        success: true, 
        data 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }


  static async obtenerPromedioDiario(req, res) {
    try {
      const data = await AsistenciaService.obtenerPromedioDiario();
      res.status(200).json({ 
        success: true, 
        data 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  static async obtenerDiasMasAfluencia(req, res) {
    try {
      const data = await AsistenciaService.obtenerDiasMasAfluencia();
      res.status(200).json({ 
        success: true, 
        data 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  
  static async obtenerMiembrosInactivos(req, res) {
    try {
      const data = await AsistenciaService.obtenerMiembrosInactivos();
      res.status(200).json({ 
        success: true, 
        data 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  // ============================================
  // 8. TOP MIEMBROS MÁS ACTIVOS
  // ============================================
  static async obtenerTopActivos(req, res) {
    try {
      const limite = req.query.limite || 5;
      const data = await AsistenciaService.obtenerTopActivos(limite);
      res.status(200).json({ 
        success: true, 
        data 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = AsistenciaController;