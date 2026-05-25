// models/MemberModel.js
const { getConnection, sql } = require('../config/db');

class MemberModel {

  static async registerFullMember(memberData, userId) {
    try {
      const pool = await getConnection();


      await pool.request()
        .input('userId', sql.Int, userId)
        .query('EXEC sp_set_session_context @key = N\'UserId\', @value = @userId;');

      const result = await pool.request()
        .input('FullName', sql.VarChar(100), memberData.fullName)
        .input('Phone', sql.VarChar(20), memberData.phone)
        .input('Address', sql.VarChar(255), memberData.address)
        .input('TrainerId', sql.Int, memberData.trainerId)
        .input('PlanId', sql.Int, memberData.planId)
        .input('PaymentMethodId', sql.Int, memberData.paymentMethodId)
        .input('CashierId', sql.Int, memberData.cashierId)
        .input('CurrencyId', sql.Int, memberData.currencyId)
        .execute('GYM_OPERATIONS.USP_RegisterFullMember');

      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (registerFullMember): ${error.message}`);
    }
  }




  static async obtenerResumen() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(*) FROM GYM_OPERATIONS.Tbl_Members WHERE StatusId = 1) AS activos,
        (SELECT COUNT(*) FROM GYM_OPERATIONS.Tbl_Members WHERE StatusId != 3) AS total,
        (SELECT COUNT(DISTINCT m.MemberId)
         FROM GYM_OPERATIONS.Tbl_Memberships ms
         INNER JOIN GYM_OPERATIONS.Tbl_Members m ON ms.MemberId = m.MemberId
         WHERE ms.StatusId = 1 AND ms.EndDate BETWEEN GETDATE() AND DATEADD(day, 7, GETDATE())
        ) AS proximosAVencer,
        (SELECT COUNT(*)
         FROM GYM_OPERATIONS.Tbl_Members m
         WHERE m.StatusId = 1 AND EXISTS (
           SELECT 1 FROM GYM_BILLING.Tbl_Invoices i WHERE i.MemberId = m.MemberId AND i.Balance > 0
         )
        ) AS deudores
    `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (obtenerResumen): ${error.message}`);
    }
  }

  static async obtenerHistorialMembresias(memberId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('memberId', sql.Int, memberId)
        .query(`
        SELECT 
          ms.MembershipId, ms.PlanId, p.PlanName, 
          ms.StartDate, ms.EndDate, ms.StatusId, s.StatusName
        FROM GYM_OPERATIONS.Tbl_Memberships ms
        INNER JOIN GYM_OPERATIONS.Tbl_Plans p ON ms.PlanId = p.PlanId
        INNER JOIN GYM_CATALOGS.Tbl_Statuses s ON ms.StatusId = s.StatusId
        WHERE ms.MemberId = @memberId
        ORDER BY ms.StartDate DESC
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerHistorialMembresias): ${error.message}`);
    }
  }

  static async obtenerHistorialPagos(memberId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('memberId', sql.Int, memberId)
        .query(`
        SELECT 
          i.InvoiceId, i.InvoiceNumber, i.InvoiceDate, i.TotalAmount, 
          i.PaymentMethodId, pm.MethodName, i.StatusId, s.StatusName
        FROM GYM_BILLING.Tbl_Invoices i
        LEFT JOIN GYM_CATALOGS.Tbl_PaymentMethods pm ON i.PaymentMethodId = pm.PaymentMethodId
        LEFT JOIN GYM_CATALOGS.Tbl_Statuses s ON i.StatusId = s.StatusId
        WHERE i.MemberId = @memberId
        ORDER BY i.InvoiceDate DESC
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerHistorialPagos): ${error.message}`);
    }
  }

  static async obtenerAsistenciaUltimosDias(memberId, dias = 30) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('memberId', sql.Int, memberId)
        .input('dias', sql.Int, dias)
        .query(`
        SELECT 
          CAST(AccessDate AS DATE) AS fecha,
          COUNT(*) AS asistencias
        FROM GYM_OPERATIONS.Tbl_Attendance
        WHERE MemberId = @memberId 
          AND AccessDate >= DATEADD(day, -@dias, GETDATE())
        GROUP BY CAST(AccessDate AS DATE)
        ORDER BY fecha
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerAsistenciaUltimosDias): ${error.message}`);
    }
  }

  static async findByPhone(phone) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('Phone', sql.VarChar(20), phone)
        .query('SELECT * FROM GYM_OPERATIONS.Tbl_Members WHERE Phone = @Phone');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (findByPhone): ${error.message}`);
    }
  }

  static async listarTodos() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
      SELECT 
        M.MemberId AS id, 
        M.FullName AS fullName, 
        M.Phone AS phone, 
        M.Address AS address, 
        M.StatusId AS statusId,
        M.TrainerId AS trainerId,
        E.FullName AS trainerName,
        ISNULL((SELECT SUM(Balance) FROM GYM_BILLING.Tbl_Invoices WHERE MemberId = M.MemberId), 0) AS balance,
        (SELECT MAX(EndDate) FROM GYM_OPERATIONS.Tbl_Memberships WHERE MemberId = M.MemberId AND StatusId = 1) AS endDate
      FROM GYM_OPERATIONS.Tbl_Members M
      LEFT JOIN GYM_HR.Tbl_Employees E ON M.TrainerId = E.EmployeeId
    `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (listar Miembros): ${error.message}`);
    }
  }
  // models/MemberModel.js
  static async buscarPorId(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
        SELECT 
          M.MemberId AS id, 
          M.FullName AS fullName, 
          M.Phone AS phone, 
          M.Address AS address, 
          M.StatusId AS statusId,
          M.TrainerId AS trainerId,
          E.FullName AS trainerName,
          ISNULL((SELECT SUM(Balance) FROM GYM_BILLING.Tbl_Invoices WHERE MemberId = M.MemberId), 0) AS balance,
          (SELECT MAX(EndDate) FROM GYM_OPERATIONS.Tbl_Memberships WHERE MemberId = M.MemberId AND StatusId = 1) AS endDate
        FROM GYM_OPERATIONS.Tbl_Members M
        LEFT JOIN GYM_HR.Tbl_Employees E ON M.TrainerId = E.EmployeeId
        WHERE M.MemberId = @id   
      `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (buscar Miembro): ${error.message}`);
    }
  }



  static async ListarPorId(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
        SELECT 
          MemberId AS id,
          FullName AS fullName,
          Phone AS phone,
          Address AS address,
          StatusId AS statusId
        FROM GYM_OPERATIONS.Tbl_Members
        WHERE MemberId = @id
      `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (buscarPorId): ${error.message}`);
    }
  }

  static async actualizar(id, data) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .input('fullName', sql.VarChar(100), data.fullName)
        .input('phone', sql.VarChar(20), data.phone)
        .input('address', sql.VarChar(255), data.address)
        .input('trainerId', sql.Int, data.trainerId || null)
        .query(`
        UPDATE GYM_OPERATIONS.Tbl_Members 
        SET 
          FullName = COALESCE(@fullName, FullName), 
          Phone = COALESCE(@phone, Phone), 
          Address = COALESCE(@address, Address),
          TrainerId = @trainerId    -- ← NUEVO: permite actualizar (incluso a NULL)
        WHERE MemberId = @id
      `);
      return { id, ...data };
    } catch (error) {
      throw new Error(`Error BD (actualizar Miembro): ${error.message}`);
    }
  }
  static async eliminar(id) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('id', sql.Int, id)
        .query('UPDATE GYM_OPERATIONS.Tbl_Members SET StatusId = 2 WHERE MemberId = @id');
      return true;
    } catch (error) {
      throw new Error(`Error BD (eliminar Miembro): ${error.message}`);
    }
  }

  static async invalidarCache() {

    return true;
  }



  static async contarTodos() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query('SELECT COUNT(*) AS total FROM GYM_OPERATIONS.Tbl_Members WHERE StatusId != 3');
      return result.recordset[0].total;
    } catch (error) {
      throw new Error(`Error BD (contarTodos): ${error.message}`);
    }
  }

  static async contarActivos() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query('SELECT COUNT(*) AS total FROM GYM_OPERATIONS.Tbl_Members WHERE StatusId = 1');
      return result.recordset[0].total;
    } catch (error) {
      throw new Error(`Error BD (contarActivos): ${error.message}`);
    }
  }

  static async contarProximosAVencer(dias = 7) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('dias', sql.Int, dias)
        .query(`
        SELECT COUNT(DISTINCT m.MemberId) AS total
        FROM GYM_OPERATIONS.Tbl_Memberships ms
        INNER JOIN GYM_OPERATIONS.Tbl_Members m ON ms.MemberId = m.MemberId
        WHERE ms.StatusId = 1 
          AND ms.EndDate BETWEEN GETDATE() AND DATEADD(day, @dias, GETDATE())
      `);
      return result.recordset[0].total;
    } catch (error) {
      throw new Error(`Error BD (contarProximosAVencer): ${error.message}`);
    }
  }

  static async contarDeudores() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
       
          SELECT COUNT(*) AS total
          FROM GYM_OPERATIONS.Tbl_Members m
          WHERE EXISTS (
          SELECT 1 
          FROM GYM_BILLING.Tbl_Invoices i 
          WHERE i.MemberId = m.MemberId 
          AND i.Balance > 0
);

      `);
      return result.recordset[0].total;
    } catch (error) {
      throw new Error(`Error BD (contarDeudores): ${error.message}`);
    }
  }

  // Método para obtener membresías de un miembro
  static async obtenerMembresias(memberId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('memberId', sql.Int, memberId)
        .query(`
        SELECT 
          ms.MembershipId, 
          ms.PlanId, 
          p.PlanName, 
          ms.StartDate, 
          ms.EndDate, 
          ms.StatusId, 
          s.StatusName
        FROM GYM_OPERATIONS.Tbl_Memberships ms
        INNER JOIN GYM_OPERATIONS.Tbl_Plans p ON ms.PlanId = p.PlanId
        INNER JOIN GYM_CATALOGS.Tbl_Statuses s ON ms.StatusId = s.StatusId
        WHERE ms.MemberId = @memberId
        ORDER BY ms.StartDate DESC
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerMembresias): ${error.message}`);
    }
  }

  // Método para obtener pagos de un miembro
  static async obtenerPagos(memberId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('memberId', sql.Int, memberId)
        .query(`
        SELECT 
          i.InvoiceId, 
          i.InvoiceNumber, 
          i.InvoiceDate, 
          i.TotalAmount, 
          i.PaymentMethodId, 
          pm.MethodName, 
          i.StatusId
        FROM GYM_BILLING.Tbl_Invoices i
        LEFT JOIN GYM_CATALOGS.Tbl_PaymentMethods pm ON i.PaymentMethodId = pm.PaymentMethodId
        WHERE i.MemberId = @memberId
        ORDER BY i.InvoiceDate DESC
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerPagos): ${error.message}`);
    }
  }

  // Método para obtener asistencia últimos N días
  static async obtenerAsistenciaUltimosDias(memberId, dias = 30) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('memberId', sql.Int, memberId)
        .input('dias', sql.Int, dias)
        .query(`
        SELECT 
          CAST(AccessDate AS DATE) AS fecha,
          COUNT(*) AS asistencias
        FROM GYM_OPERATIONS.Tbl_Attendance
        WHERE MemberId = @memberId 
          AND AccessDate >= DATEADD(day, -@dias, GETDATE())
        GROUP BY CAST(AccessDate AS DATE)
        ORDER BY fecha
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerAsistenciaUltimosDias): ${error.message}`);
    }
  }
}

module.exports = MemberModel;