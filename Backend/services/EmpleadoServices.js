// services/EmpleadoServices.js
const Empleado = require('../Entidades/Empleado'); 
const EmpleadoModel = require('../models/EmpleadoModel');

const EmpleadoService = {
  
  async registrar(data) {
    try {
     
      const nuevoEmpleado = new Empleado(
        data.nombre,
        data.rol,
        data.telefono,
        data.especialidad,
        data.disponibilidad, 
        data.activo,
        data.password
      );

    
      nuevoEmpleado.validarDatos();

      const empleadoGuardado = await EmpleadoModel.crear(nuevoEmpleado);
      
      return empleadoGuardado;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async listar() {
    try {
      return await EmpleadoModel.listar();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async buscarPorId(id) {
    try {
      const empleado = await EmpleadoModel.buscarPorId(id);
      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }
      return empleado;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async actualizar(id, data) {
  try {
    const existe = await EmpleadoModel.buscarPorId(id);
    if (!existe) throw new Error('Empleado no encontrado');

    
    const datosActualizados = {
      ...existe,   
      ...data      
    };

    return await EmpleadoModel.actualizar(id, datosActualizados);
  } catch (error) {
    throw new Error(error.message);
  }
},


  async eliminar(id) {
    try {
      return await EmpleadoModel.eliminar(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async buscarPorRol(rol) {
    try {
      // Pequeña validación antes de ir a la BD
      const rolesPermitidos = ['entrenador', 'recepcionista', 'admin', 'nutriologo', 'fisioterapeuta'];
      if (!rolesPermitidos.includes(rol.toLowerCase())) {
        throw new Error('Rol no válido para búsqueda');
      }
      return await EmpleadoModel.buscarPorRol(rol);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async obtenerMiembrosAsignados(id) {
    try {
      // Primero verificamos si el empleado es entrenador
      const empleado = await EmpleadoModel.buscarPorId(id);
      if (!empleado) throw new Error('Empleado no encontrado');
      
      if (empleado.rol !== 'entrenador') {
        throw new Error('Este empleado no es un entrenador, no tiene miembros asignados.');
      }

      return await EmpleadoModel.obtenerMiembrosAsignados(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async buscarPorNombre(nombre) {
  try {
    if (!nombre || nombre.trim().length < 2) {
      throw new Error('Escribe al menos 2 letras para buscar');
    }

    // Llamamos al método del modelo corregido
    const empleados = await EmpleadoModel.obtenerEmpleadosPorNombre(nombre.trim());

    return empleados; 

  } catch (error) {
    throw new Error(error.message);
  }
},

};

module.exports = EmpleadoService;