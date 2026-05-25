// models/Asistencia.model.js
const { getConnection, sql } = require('../config/db');

class AsistenciaModel {

  static async registrarEntrada(memberId, userId) {
  try {
    const pool = await getConnection();

    // Ejecutar la función con el esquema GYM_OPERATIONS
    const accesoResult = await pool.request()
      .input('MemberId', sql.Int, memberId)
      .query('SELECT GYM_OPERATIONS.Fn_HasActiveMembership(@MemberId) AS tieneAcceso');
    
    const tieneAcceso = accesoResult.recordset[0].tieneAcceso;

    if (!tieneAcceso) {
      throw new Error('El miembro no tiene una membresía activa');
    }

    // Registrar asistencia
    await pool.request()
      .input('MemberId', sql.Int, memberId)
      .input('AccessGranted', sql.Bit, 1)
      .input('RegisteredBy', sql.Int, userId)
      .query(`
        INSERT INTO GYM_OPERATIONS.Tbl_Attendance (MemberId, AccessDate, AccessGranted, RegisteredBy)
        VALUES (@MemberId, GETDATE(), @AccessGranted, @RegisteredBy)
      `);

    return { success: true, message: 'Entrada registrada correctamente' };
  } catch (error) {
    throw new Error(`: ${error.message}`);
  }
}
  static async obtenerAsistenciasHoy() {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          a.AttendanceId,
          m.MemberId,
          m.FullName AS nombre,
          a.AccessDate AS fecha
        FROM GYM_OPERATIONS.Tbl_Attendance a
        INNER JOIN GYM_OPERATIONS.Tbl_Members m ON a.MemberId = m.MemberId
        WHERE CAST(a.AccessDate AS DATE) = CAST(GETDATE() AS DATE)
        ORDER BY a.AccessDate DESC
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD: ${error.message}`);
  }
}
  
  static async obtenerHistorialPorMiembro(memberId, limite = 30) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('memberId', sql.Int, memberId)
        .input('limite', sql.Int, limite)
        .query(`
          SELECT TOP (@limite)
            AttendanceId,
            AccessDate AS fecha,
            AccessGranted
          FROM GYM_OPERATIONS.Tbl_Attendance
          WHERE MemberId = @memberId
          ORDER BY AccessDate DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerHistorialPorMiembro): ${error.message}`);
    }
  }

  static async obtenerHoraPico() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT TOP 1
            DATEPART(HOUR, AccessDate) AS hora,
            COUNT(*) AS total
          FROM GYM_OPERATIONS.Tbl_Attendance
          WHERE CAST(AccessDate AS DATE) = CAST(GETDATE() AS DATE)
          GROUP BY DATEPART(HOUR, AccessDate)
          ORDER BY total DESC
        `);
      return result.recordset[0] || { hora: null, total: 0 };
    } catch (error) {
      throw new Error(`Error BD (obtenerHoraPico): ${error.message}`);
    }
  }


  static async obtenerPromedioDiario() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT 
            COUNT(DISTINCT CAST(AccessDate AS DATE)) AS dias_con_asistencia,
            COUNT(*) AS total_asistencias,
            ROUND(CAST(COUNT(*) AS FLOAT) / NULLIF(COUNT(DISTINCT CAST(AccessDate AS DATE)), 0), 1) AS promedio_diario
          FROM GYM_OPERATIONS.Tbl_Attendance
          WHERE MONTH(AccessDate) = MONTH(GETDATE()) 
            AND YEAR(AccessDate) = YEAR(GETDATE())
        `);
      return result.recordset[0] || { dias_con_asistencia: 0, total_asistencias: 0, promedio_diario: 0 };
    } catch (error) {
      throw new Error(`Error BD (obtenerPromedioDiario): ${error.message}`);
    }
  }


  static async obtenerDiasMasAfluencia() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT TOP 5
            DATENAME(WEEKDAY, AccessDate) AS dia_semana,
            COUNT(*) AS total_asistencias
          FROM GYM_OPERATIONS.Tbl_Attendance
          WHERE AccessDate >= DATEADD(day, -30, GETDATE())
          GROUP BY DATENAME(WEEKDAY, AccessDate), DATEPART(WEEKDAY, AccessDate)
          ORDER BY total_asistencias DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerDiasMasAfluencia): ${error.message}`);
    }
  }

  static async obtenerMiembrosInactivos() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT 
            m.MemberId,
            m.FullName,
            m.Phone,
            CAST(MAX(a.AccessDate) AS DATE) AS ultima_asistencia
          FROM GYM_OPERATIONS.Tbl_Members m
          LEFT JOIN GYM_OPERATIONS.Tbl_Attendance a ON m.MemberId = a.MemberId
          WHERE m.StatusId = 1
          GROUP BY m.MemberId, m.FullName, m.Phone
          HAVING MAX(a.AccessDate) < DATEADD(day, -15, GETDATE()) 
             OR MAX(a.AccessDate) IS NULL
          ORDER BY ultima_asistencia ASC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerMiembrosInactivos): ${error.message}`);
    }
  }

 
  static async obtenerTopActivos(limite = 5) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('limite', sql.Int, limite)
        .query(`
          SELECT TOP (@limite)
            m.MemberId,
            m.FullName,
            COUNT(a.AttendanceId) AS total_asistencias
          FROM GYM_OPERATIONS.Tbl_Members m
          INNER JOIN GYM_OPERATIONS.Tbl_Attendance a ON m.MemberId = a.MemberId
          WHERE a.AccessDate >= DATEADD(day, -30, GETDATE())
          GROUP BY m.MemberId, m.FullName
          ORDER BY total_asistencias DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerTopActivos): ${error.message}`);
    }
  }
}

module.exports = AsistenciaModel;