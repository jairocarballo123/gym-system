// services/Asistencia.service.js
const AsistenciaModel = require('../models/AsistenciaModel');

class AsistenciaService {

  static async registrarEntrada(memberId, userId) {
    try {
      if (!memberId) {
        throw new Error('El ID del miembro es requerido');
      }
      return await AsistenciaModel.registrarEntrada(memberId, userId);
    } catch (error) {
      throw new Error(`Error al registrar entrada: ${error.message}`);
    }
  }


  static async obtenerAsistenciasHoy() {
    try {
      return await AsistenciaModel.obtenerAsistenciasHoy();
    } catch (error) {
      throw new Error(`Error al obtener asistencias de hoy: ${error.message}`);
    }
  }

  static async obtenerHistorialPorMiembro(memberId) {
    try {
      if (!memberId) {
        throw new Error('El ID del miembro es requerido');
      }
      return await AsistenciaModel.obtenerHistorialPorMiembro(memberId);
    } catch (error) {
      throw new Error(`Error al obtener historial del miembro: ${error.message}`);
    }
  }


  static async obtenerHoraPico() {
    try {
      return await AsistenciaModel.obtenerHoraPico();
    } catch (error) {
      throw new Error(`Error al obtener hora pico: ${error.message}`);
    }
  }


  static async obtenerPromedioDiario() {
    try {
      return await AsistenciaModel.obtenerPromedioDiario();
    } catch (error) {
      throw new Error(`Error al obtener promedio diario: ${error.message}`);
    }
  }

  static async obtenerDiasMasAfluencia() {
    try {
      return await AsistenciaModel.obtenerDiasMasAfluencia();
    } catch (error) {
      throw new Error(`Error al obtener días de afluencia: ${error.message}`);
    }
  }

  static async obtenerMiembrosInactivos() {
    try {
      return await AsistenciaModel.obtenerMiembrosInactivos();
    } catch (error) {
      throw new Error(`Error al obtener miembros inactivos: ${error.message}`);
    }
  }

  static async obtenerTopActivos(limite = 5) {
    try {
      return await AsistenciaModel.obtenerTopActivos(limite);
    } catch (error) {
      throw new Error(`Error al obtener top activos: ${error.message}`);
    }
  }
}

module.exports = AsistenciaService;