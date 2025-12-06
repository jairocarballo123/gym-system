// services/asistenciaService.js
const Asistencia = require('../Entidades/Asistencia');
const AsistenciaModel = require('../models/AsistenciaModel');

class AsistenciaService {
  
  async registrarEntrada(data) {
    try {
      const validarDatosEntrada = () => {
        if (!data || !data.miembro_id) {
          throw new Error('Datos incompletos: miembro_id es requerido');
        }
        if (typeof data.miembro_id !== 'string' || data.miembro_id.length !== 6) {
          throw new Error('ID de miembro debe ser texto de 6 caracteres');
        }
      };

      validarDatosEntrada();

      const asistencia = new Asistencia(data.miembro_id);
      asistencia.validarDatos();
      
      const resultado = await AsistenciaModel.crear(asistencia);
      return resultado;

    } catch (error) {
      const manejarErrorEspecifico = (mensaje) => {
        if (mensaje.includes('miembro_id') || mensaje.includes('ID del miembro')) {
          return `Error de datos del miembro: ${mensaje}`;
        } else if (mensaje.includes('no existe')) {
          return `Error: ${mensaje}`;
        } else if (mensaje.includes('base de datos') || mensaje.includes('BD')) {
          return `Error del sistema: ${mensaje}`;
        } else {
          return `Error al registrar entrada: ${mensaje}`;
        }
      };

      throw new Error(manejarErrorEspecifico(error.message));
    }
  }

  async listarAsistencias() {
    try {
      const asistencias = await AsistenciaModel.listar();
      
      const formatearAsistencias = (lista) => {
        return lista.map(asistencia => ({
          id: asistencia.id,
          miembro_id: asistencia.miembro_id,
          miembro_nombre: asistencia.miembro_nombre,
          fecha_entrada: asistencia.fecha_entrada,
           fecha_formateada: new Date(asistencia.fecha_entrada).toLocaleString('es-ES')
        }));
      };
      
      return formatearAsistencias(asistencias);

    } catch (error) {
      throw new Error(`Error al obtener asistencias: ${error.message}`);
    }
  }

  async eliminarAsistencia(id) {
    try {
   
      if (!id) {
        throw new Error('ID de asistencia requerido');
      }

      // 2. Llamar al modelo
      return await AsistenciaModel.eliminar(id);

    } catch (error) {
      throw new Error(`Error en servicio al eliminar: ${error.message}`);
    }
  }

  async buscarAsistenciasPorMiembro(miembroId) {
    try {
      const validarIdMiembro = (id) => {
        if (!id || id.length !== 6) {
          throw new Error('ID de miembro inválido');
        }
      };

      validarIdMiembro(miembroId);

      return await AsistenciaModel.buscarPorMiembro(miembroId);

    } catch (error) {
      const obtenerMensajeError = () => {
        return error.message.includes('inválido') 
          ? error.message 
          : `Error al buscar asistencias del miembro: ${error.message}`;
      };

      throw new Error(obtenerMensajeError());
    }
  }

  async buscarAsistenciasPorFecha(fecha) {
    try {
      const validarFormatoFecha = (fecha) => {
        if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }
        
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) {
          throw new Error('La fecha proporcionada no es válida');
        }
      };

      validarFormatoFecha(fecha);

      return await AsistenciaModel.buscarPorFecha(fecha);

    } catch (error) {
      throw new Error(`Error al buscar asistencias por fecha: ${error.message}`);
    }
  }

  async obtenerEstadisticas() {
    try {
      const asistencias = await AsistenciaModel.listar();
      
      const calcularTotalAsistencias = () => asistencias.length;
      
      const calcularAsistenciasHoy = () => {
        const hoy = new Date().toISOString().split('T')[0];
        return asistencias.filter(a => a.fecha_entrada.includes(hoy)).length;
      };
      
      const calcularMiembrosUnicos = () => {
        const miembrosUnicos = new Set(asistencias.map(a => a.miembro_id));
        return miembrosUnicos.size;
      };
      
      const calcularTopMiembros = () => {
        const frecuencia = asistencias.reduce((acc, a) => {
          acc[a.miembro_id] = (acc[a.miembro_id] || 0) + 1;
          return acc;
        }, {});
        
        return Object.entries(frecuencia)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([id, count]) => ({ miembro_id: id, asistencias: count }));
      };

      return {
        total_asistencias: calcularTotalAsistencias(),
        asistencias_hoy: calcularAsistenciasHoy(),
        miembros_unicos: calcularMiembrosUnicos(),
        top_miembros: calcularTopMiembros(),
        fecha_consulta: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Error al generar estadísticas: ${error.message}`);
    }
  }
}



module.exports = new AsistenciaService();