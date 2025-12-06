// models/asistenciaModel.js
const pool = require('../DB/db');

class AsistenciaModel {
  
  // 📌 CREAR REGISTRO DE ASISTENCIA
  static async crear(asistenciaData) {
    try {
      const query = `
        INSERT INTO Asistencia (miembro_id, fecha_entrada)
        VALUES ($1, $2)
        RETURNING *
      `;
      const values = [
        asistenciaData.miembro_id,
        asistenciaData.fecha_entrada
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];

    } catch (error) {
      // Manejo específico de errores de PostgreSQL
      if (error.code === '23503') { // Violación de llave foránea
        throw new Error(`El miembro con ID ${asistenciaData.miembro_id} no existe`);
      } else if (error.code === '23505') { // Violación de unique
        throw new Error('Registro duplicado');
      } else {
        throw new Error(`Error de base de datos: ${error.message}`);
      }
    }
  }

  // 📌 LISTAR TODAS LAS ASISTENCIAS
  static async listar() {
    try {
      const query = `
        SELECT a.*, m.nombre as miembro_nombre
        FROM Asistencia a
        JOIN Miembro m ON a.miembro_id = m.id
        ORDER BY a.fecha_entrada DESC
      `;
      
      const result = await pool.query(query);
      return result.rows;

    } catch (error) {
      throw new Error(`Error al listar asistencias: ${error.message}`);
    }
  }

  // 📌 BUSCAR ASISTENCIAS POR MIEMBRO
  static async buscarPorMiembro(miembroId) {
    try {
      const query = `
        SELECT a.*, m.nombre as miembro_nombre
        FROM Asistencia a
        JOIN Miembro m ON a.miembro_id = m.id
        WHERE a.miembro_id = $1
        ORDER BY a.fecha_entrada DESC
      `;
      
      const result = await pool.query(query, [miembroId]);
      
      if (result.rows.length === 0) {
        throw new Error(`No se encontraron asistencias para el miembro ${miembroId}`);
      }
      
      return result.rows;

    } catch (error) {
      if (error.message.includes('No se encontraron')) {
        throw error; // Mantener error específico de "no encontrado"
      }
      throw new Error(`Error al buscar asistencias por miembro: ${error.message}`);
    }
  }

  // 📌 BUSCAR ASISTENCIAS POR FECHA
  static async buscarPorFecha(fecha) {
    try {
      const query = `
        SELECT a.*, m.nombre as miembro_nombre
        FROM Asistencia a
        JOIN Miembro m ON a.miembro_id = m.id
        WHERE DATE(a.fecha_entrada) = $1
        ORDER BY a.fecha_entrada DESC
      `;
      
      const result = await pool.query(query, [fecha]);
      
      if (result.rows.length === 0) {
        throw new Error(`No se encontraron asistencias para la fecha ${fecha}`);
      }
      
      return result.rows;

    } catch (error) {
      if (error.message.includes('No se encontraron')) {
        throw error; // Mantener error específico
      }
      throw new Error(`Error al buscar asistencias por fecha: ${error.message}`);
    }
  }

  // 📌 OBTENER ASISTENCIAS DE HOY
  static async asistenciasHoy() {
    try {
      const query = `
        SELECT a.*, m.nombre as miembro_nombre
        FROM Asistencia a
        JOIN Miembro m ON a.miembro_id = m.id
        WHERE DATE(a.fecha_entrada) = CURRENT_DATE
        ORDER BY a.fecha_entrada DESC
      `;
      
      const result = await pool.query(query);
      return result.rows;

    } catch (error) {
      throw new Error(`Error al obtener asistencias de hoy: ${error.message}`);
    }
  }

  // 📌 ELIMINAR REGISTRO DE ASISTENCIA
  static async eliminar(id) {
    try {
  
      const verificarQuery = 'SELECT id FROM Asistencia WHERE id = $1';
      const verificarResult = await pool.query(verificarQuery, [id]);
      
      if (verificarResult.rows.length === 0) {
        throw new Error(`No se encontró la asistencia con ID ${id}`);
      }

      const deleteQuery = 'DELETE FROM Asistencia WHERE id = $1';
      await pool.query(deleteQuery, [id]);
      
      return { 
        mensaje: 'Asistencia eliminada correctamente',
        id_eliminado: id
      };

    } catch (error) {
      if (error.message.includes('No se encontró')) {
        throw error;
      }
      throw new Error(`Error al eliminar asistencia: ${error.message}`);
    }
  }

  // 📌 OBTENER ESTADÍSTICAS AVANZADAS
  static async obtenerEstadisticasCompletas() {
    try {
      const queries = {
        totalAsistencias: `
          SELECT COUNT(*) as total FROM Asistencia
        `,
        asistenciasHoy: `
          SELECT COUNT(*) as hoy FROM Asistencia 
          WHERE DATE(fecha_entrada) = CURRENT_DATE
        `,
        miembrosUnicos: `
          SELECT COUNT(DISTINCT miembro_id) as unicos FROM Asistencia
        `,
        topMiembros: `
          SELECT miembro_id, COUNT(*) as asistencias
          FROM Asistencia 
          GROUP BY miembro_id 
          ORDER BY asistencias DESC 
          LIMIT 5
        `,
        asistenciasPorMes: `
          SELECT 
            TO_CHAR(fecha_entrada, 'YYYY-MM') as mes,
            COUNT(*) as asistencias
          FROM Asistencia
          GROUP BY TO_CHAR(fecha_entrada, 'YYYY-MM')
          ORDER BY mes DESC
          LIMIT 6
        `
      };

      const resultados = {};
      
      for (const [key, query] of Object.entries(queries)) {
        const result = await pool.query(query);
        resultados[key] = result.rows;
      }

      return resultados;

    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = AsistenciaModel;