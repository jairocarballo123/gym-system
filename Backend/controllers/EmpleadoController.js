// controllers/EmpleadoController.js
const EmpleadoService = require('../services/EmpleadoServices');

class EmpleadoController {

  static async obtenerTodos(req, res) {
    try {
      const empleados = await EmpleadoService.obtenerEmpleados();
      res.json({ success: true, data: empleados });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

 
  static async listarEntrenadores(req, res) {
    try {
      const entrenadores = await EmpleadoService.listarEntrenadores();
      res.json({ success: true, data: entrenadores });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Obtener empleado por ID (si lo necesitas)
  static async obtenerPorNombre(req, res) {
    try {
      const { nombre } = req.params;
      const empleado = await EmpleadoService.obtenerEmpleadoPorNombre(nombre); 
      if (!empleado) {
        return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
      }
      res.json({ success: true, data: empleado });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      const empleado = await EmpleadoService.obtenerEmpleadoPorId(id); 
      if (!empleado) {
        return res.status(404).json({ success: false, message: 'Empleado no encontrado' });
      }
      res.json({ success: true, data: empleado });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }


  // Crear empleado
  static async crear(req, res) {
    try {
      const nuevoEmpleado = await EmpleadoService.crearEmpleado(req.body);
      res.status(201).json({ success: true, data: nuevoEmpleado });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Actualizar empleado
  static async actualizar(req, res) {
    try {
       console.log('📥 Datos recibidos en backend:', req.body);  // ← AGREGAR
       console.log('📥 ID recibido:', req.params.id);            // ← AGREGAR
      const { id } = req.params;
      const actualizado = await EmpleadoService.actualizarEmpleado(id, req.body);
      res.json({ success: true, data: actualizado });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Desactivar empleado (baja lógica)
  static async desactivar(req, res) {
    try {
      const { id } = req.params;
      await EmpleadoService.desactivarEmpleado(id);
      res.json({ success: true, message: 'Empleado desactivado correctamente' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = EmpleadoController;