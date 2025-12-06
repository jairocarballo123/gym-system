// controllers/empleadoController.js
const EmpleadoService = require('../services/EmpleadoServices');

async function registrarEmpleado(req, res) {
  try {
    const empleado = await EmpleadoService.registrar(req.body);
    
    res.status(201).json({
      success: true,
      mensaje: 'Empleado registrado exitosamente',
      data: empleado
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function listarEmpleados(req, res) {
  try {
    const empleados = await EmpleadoService.listar();
    
    res.status(200).json({
      success: true,
      data: empleados,
      total: empleados.length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function buscarEmpleadoPORid(req, res) {
  try {
    const empleado = await EmpleadoService.buscarPorId(req.params.id);
    
    res.status(200).json({
      success: true,
      data: empleado
    });
    
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
}

async function actualizarEmpleado(req, res) {
  try {
    const empleado = await EmpleadoService.actualizar(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      mensaje: 'Empleado actualizado exitosamente',
      data: empleado
    });
    
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
}

async function eliminarEmpleado(req, res) {
  try {
    const resultado = await EmpleadoService.eliminar(req.params.id);
    
    res.status(200).json({
      success: true,
      data: resultado
    });
    
  } catch (error) {
    const statusCode = error.message.includes('no encontrado') ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
}

async function buscarEmpleadosPorRol(req, res) {
  try {
    const empleados = await EmpleadoService.buscarPorRol(req.params.rol);
    
    res.status(200).json({
      success: true,
      data: empleados,
      total: empleados.length,
      rol: req.params.rol
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

async function obtenerMiembrosAsignados(req, res) {
  try {
    const { id } = req.params;

    const resultado = await EmpleadoService.obtenerMiembrosAsignados(id);
    
    res.status(200).json({
      success: true,
      data: resultado
    });
    
  } catch (error) {
    let statusCode = 400;
    if (error.message.includes('no encontrado')) statusCode = 404;
    
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
}

async function buscarEmpleadosPorNombre(req, res) {
  try {
    const { nombre } = req.params;

    const empleados = await EmpleadoService.buscarPorNombre(nombre);

    if (empleados.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontró empleado con nombre "${nombre}"`
      });
    }

    res.status(200).json({
      success: true,
      cantidad: empleados.length,
      data: empleados
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}



module.exports = {
  registrarEmpleado,
  listarEmpleados,
  buscarEmpleadoPORid,
  actualizarEmpleado,
  eliminarEmpleado,
  buscarEmpleadosPorRol,
  obtenerMiembrosAsignados,
  buscarEmpleadosPorNombre
};