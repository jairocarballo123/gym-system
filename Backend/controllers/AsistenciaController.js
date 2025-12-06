// controllers/asistenciaController.js
const AsistenciaService = require('../services/AsistenciaServices');

async function registrarEntrada(req, res) {
  try {
    console.log(' Request recibido - Registrar entrada:', req.body);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada requeridos'
      });
    }

    const asistencia = await AsistenciaService.registrarEntrada(req.body);

    res.status(201).json({
      success: true,
      mensaje: 'Entrada registrada exitosamente',
      data: asistencia,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(' Error en controller registrarEntrada:', error.message);

    let statusCode = 400;
    if (error.message.includes('no existe')) statusCode = 404;
    if (error.message.includes('sistema') || error.message.includes('base de datos')) statusCode = 500;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function listarAsistencias(req, res) {
  try {
    console.log(' Request recibido - Listar asistencias');

    const asistencias = await AsistenciaService.listarAsistencias();

    res.status(200).json({
      success: true,
      data: asistencias,
      total: asistencias.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(' Error en controller listarAsistencias:', error.message);

    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function buscarAsistenciasPorMiembro(req, res) {
  try {
    const { miembroId } = req.params;
    console.log(' Request recibido - Buscar asistencias por miembro:', miembroId);

    if (!miembroId) {
      return res.status(400).json({
        success: false,
        error: 'ID de miembro requerido'
      });
    }

    const asistencias = await AsistenciaService.buscarAsistenciasPorMiembro(miembroId);

    res.status(200).json({
      success: true,
      data: asistencias,
      total: asistencias.length,
      miembro_id: miembroId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(' Error en controller buscarAsistenciasPorMiembro:', error.message);

    let statusCode = 400;
    if (error.message.includes('No se encontraron')) statusCode = 404;
    if (error.message.includes('inválido')) statusCode = 400;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function buscarAsistenciasPorFecha(req, res) {
  try {
    const { fecha } = req.params;
    console.log('📥 Request recibido - Buscar asistencias por fecha:', fecha);

    if (!fecha) {
      return res.status(400).json({
        success: false,
        error: 'Fecha requerida (formato: YYYY-MM-DD)'
      });
    }

    const asistencias = await AsistenciaService.buscarAsistenciasPorFecha(fecha);

    res.status(200).json({
      success: true,
      data: asistencias,
      total: asistencias.length,
      fecha: fecha,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(' Error en controller buscarAsistenciasPorFecha:', error.message);

    let statusCode = 400;
    if (error.message.includes('No se encontraron')) statusCode = 404;
    if (error.message.includes('Formato de fecha')) statusCode = 400;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function obtenerEstadisticas(req, res) {
  try {
    console.log(' Request recibido - Obtener estadísticas');

    const estadisticas = await AsistenciaService.obtenerEstadisticas();

    res.status(200).json({
      success: true,
      data: estadisticas,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(' Error en controller obtenerEstadisticas:', error.message);

    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function eliminarAsistencia(req, res) {
  try {
    const { id } = req.params;
    console.log(' Request recibido - Eliminar asistencia:', id);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de asistencia válido requerido'
      });
    }

    const resultado = await AsistenciaService.eliminarAsistencia(parseInt(id));

    res.status(200).json({
      success: true,
      data: resultado,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(' Error en controller eliminarAsistencia:', error.message);

    let statusCode = 400;
    if (error.message.includes('No se encontró')) statusCode = 404;

    res.status(statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  registrarEntrada,
  listarAsistencias,
  buscarAsistenciasPorMiembro,
  buscarAsistenciasPorFecha,
  obtenerEstadisticas,
  eliminarAsistencia
};