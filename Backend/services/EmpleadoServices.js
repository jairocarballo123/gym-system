// services/EmpleadoService.js
const EmpleadoModel = require('../models/EmpleadoModel');
const Empleado = require('../Entidades/Empleado');
const bcrypt = require('bcryptjs');
const NodeCache = require('node-cache');
const empleadoCache = new NodeCache({ stdTTL: 300 }); // 5 minutos

class EmpleadoService {

  static async obtenerEmpleados() {
    try {
      const cacheKey = 'all_empleados';
      let cached = empleadoCache.get(cacheKey);
      if (cached) return cached;

      const empleados = await EmpleadoModel.listar();
      empleadoCache.set(cacheKey, empleados);
      return empleados;
    } catch (error) {
      throw new Error(`Error al obtener empleados: ${error.message}`);
    }
  }

  static async listarEntrenadores() {
    try {
      const cacheKey = 'all_entrenadores';
      let cached = empleadoCache.get(cacheKey);
      if (cached) return cached;

      const entrenadores = await EmpleadoModel.listarEntrenadores();
      empleadoCache.set(cacheKey, entrenadores);
      return entrenadores;
    } catch (error) {
      throw new Error(`Error al listar entrenadores: ${error.message}`);
    }
  }

  static async crearEmpleado(data) {
    try {
      const nuevoEmpleado = new Empleado(data);
      nuevoEmpleado.validarDatos();

      if (nuevoEmpleado.password) {
        const salt = await bcrypt.genSalt(10);
        nuevoEmpleado.password = await bcrypt.hash(nuevoEmpleado.password, salt);
      }

      const resultado = await EmpleadoModel.crear(nuevoEmpleado);

      empleadoCache.del('all_empleados');
      empleadoCache.del('all_entrenadores');
      return resultado;
    } catch (error) {
      throw new Error(`Error al crear empleado: ${error.message}`);
    }
  }

  static async obtenerEmpleadoPorNombre(nombre) {
    try {
      return await EmpleadoModel.findByNombre(nombre);
    } catch (error) {
      throw new Error(`Error al obtener empleado por nombre: ${error.message}`);
    }
  }

  static async obtenerEmpleadoPorId(id) {
    try {
      return await EmpleadoModel.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener empleado por ID: ${error.message}`);
    }
  }

  static async actualizarEmpleado(id, data) {
    try {
      const empleadoActualizado = new Empleado(data);
      empleadoActualizado.id = id;
      empleadoActualizado.validarDatos();

      const resultado = await EmpleadoModel.actualizar(id, empleadoActualizado);

      empleadoCache.del('all_empleados');
      empleadoCache.del('all_entrenadores');
      return resultado;
    } catch (error) {
      throw new Error(`Error al actualizar empleado: ${error.message}`);
    }
  }

  static async desactivarEmpleado(id) {
    try {
      const resultado = await EmpleadoModel.desactivar(id);
      empleadoCache.del('all_empleados');
      empleadoCache.del('all_entrenadores');
      return resultado;
    } catch (error) {
      throw new Error(`Error al desactivar empleado: ${error.message}`);
    }
  }
}

module.exports = EmpleadoService;
