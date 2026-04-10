// services/EmpleadoService.js
const EmpleadoModel = require('../models/EmpleadoModel');
const Empleado = require('../Entidades/Empleado');
const bcrypt = require('bcryptjs');
const NodeCache = require('node-cache');
const empleadoCache = new NodeCache({ stdTTL: 300 }); // 5 minutos

class EmpleadoService {

  static async obtenerEmpleados() {
    const cacheKey = 'all_empleados';
    let cached = empleadoCache.get(cacheKey);
    if (cached) return cached;

    const empleados = await EmpleadoModel.listar();
    empleadoCache.set(cacheKey, empleados);
    return empleados;
  }

  static async listarEntrenadores() {
    const cacheKey = 'all_entrenadores';
    let cached = empleadoCache.get(cacheKey);
    if (cached) return cached;

    const entrenadores = await EmpleadoModel.listarEntrenadores();
    empleadoCache.set(cacheKey, entrenadores);
    return entrenadores;
  }

 

  static async crearEmpleado(data) {
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
  }

  static async obtenerEmpleadoPorNombre(nombre) {

    return await EmpleadoModel.findByNombre(nombre);
  }

  static async obtenerEmpleadoPorId(id) {

    return await EmpleadoModel.findById(id);
  }

  

  

  static async actualizarEmpleado(id, data) {
    const empleadoActualizado = new Empleado(data);
    empleadoActualizado.id = id;
    empleadoActualizado.validarDatos();

    const resultado = await EmpleadoModel.actualizar(id, empleadoActualizado);
    // Invalidar caché
    empleadoCache.del('all_empleados');
    empleadoCache.del('all_entrenadores');
    return resultado;
  }

  static async desactivarEmpleado(id) {
    const resultado = await EmpleadoModel.desactivar(id);
    empleadoCache.del('all_empleados');
    empleadoCache.del('all_entrenadores');
    return resultado;
  }
}

module.exports = EmpleadoService;