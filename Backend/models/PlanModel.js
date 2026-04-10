const { getConnection, sql } = require('../config/db');

class PlanModel {
  static async crear(plan) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('PlanName', sql.VarChar(100), plan.nombre)
        .input('Price', sql.Decimal(10, 2), plan.precio)
        .input('DurationDays', sql.Int, plan.duracion_dias)
        .input('Description', sql.VarChar(255), plan.descripcion || '')
        .input('IsAddOn', sql.Bit, plan.isAddOn)
        .query(`
          INSERT INTO GYM_OPERATIONS.Tbl_Plans (PlanName, Price, DurationDays, Description, IsAddOn, StatusId)
          OUTPUT INSERTED.PlanId, INSERTED.PlanName, INSERTED.IsAddOn
          VALUES (@PlanName, @Price, @DurationDays, @Description, @IsAddOn, 1);
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (crear): ${error.message}`);
    }
  }


static async obtenerPlanMasVendido() {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT TOP 1
          p.PlanId,
          p.PlanName,
          COUNT(ms.MembershipId) AS total_vendido
        FROM GYM_OPERATIONS.Tbl_Plans p
        INNER JOIN GYM_OPERATIONS.Tbl_Memberships ms ON p.PlanId = ms.PlanId
        WHERE p.StatusId = 1
        GROUP BY p.PlanId, p.PlanName
        ORDER BY total_vendido DESC
      `);
    return result.recordset[0] || null;
  } catch (error) {
    throw new Error(`Error BD (planMasVendido): ${error.message}`);
  }
}



static async obtenerMiembrosPorPlan() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        p.PlanId,
        p.PlanName,
        COUNT(DISTINCT ms.MemberId) AS cantidad_miembros
      FROM GYM_OPERATIONS.Tbl_Plans p
      LEFT JOIN GYM_OPERATIONS.Tbl_Memberships ms ON p.PlanId = ms.PlanId AND ms.StatusId = 1
      WHERE p.StatusId = 1
      GROUP BY p.PlanId, p.PlanName
      ORDER BY cantidad_miembros DESC
    `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (obtenerMiembrosPorPlan): ${error.message}`);
  }
}

static async obtenerProximosVencer() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        ms.MembershipId,
        p.PlanName,
        m.FullName AS MemberName,
        ms.EndDate
      FROM GYM_OPERATIONS.Tbl_Memberships ms
      INNER JOIN GYM_OPERATIONS.Tbl_Plans p ON ms.PlanId = p.PlanId
      INNER JOIN GYM_OPERATIONS.Tbl_Members m ON ms.MemberId = m.MemberId
      WHERE ms.StatusId = 1 
        AND ms.EndDate BETWEEN GETDATE() AND DATEADD(day, 7, GETDATE())
      ORDER BY ms.EndDate ASC
    `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (obtenerProximosVencer): ${error.message}`);
  }
}


static async obtenerResumen() {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN StatusId = 1 THEN 1 ELSE 0 END) AS activos,
          COUNT(CASE WHEN IsAddOn = 1 THEN 1 END) AS addOns,
          MAX(Price) AS precio_maximo,
          MIN(Price) AS precio_minimo,
          AVG(Price) AS precio_promedio
        FROM GYM_OPERATIONS.Tbl_Plans
        WHERE StatusId != 3
      `);
    return result.recordset[0];
  } catch (error) {
    throw new Error(`Error BD (resumenPlanes): ${error.message}`);
  }
}


static async ingresosPorPlan() {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          p.PlanId,
          p.PlanName,
          COUNT(ms.MembershipId) AS cantidad_vendida,
          SUM(p.Price) AS total_ingresos
        FROM GYM_OPERATIONS.Tbl_Plans p
        INNER JOIN GYM_OPERATIONS.Tbl_Memberships ms ON p.PlanId = ms.PlanId
        WHERE p.StatusId = 1
        GROUP BY p.PlanId, p.PlanName
        ORDER BY total_ingresos DESC
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (ingresosPorPlan): ${error.message}`);
  }
}

  static async listar() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT * FROM GYM_OPERATIONS.Tbl_Plans WHERE StatusId =1
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (listar): ${error.message}`);
    }
  }

  static async buscarPorId(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('PlanId', sql.Int, id)
        .query('SELECT * FROM GYM_OPERATIONS.Tbl_Plans WHERE PlanId = @PlanId AND StatusId != 3');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (buscarPorId): ${error.message}`);
    }
  }

  static async actualizar(id, data) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('PlanId', sql.Int, id)
        .input('PlanName', sql.VarChar(100), data.nombre)
        .input('Price', sql.Decimal(10, 2), data.precio)
        .input('DurationDays', sql.Int, data.duracion_dias)
        .input('Description', sql.VarChar(255), data.descripcion)
        .input('IsAddOn', sql.Bit, data.isAddOn)
        .query(`
          UPDATE GYM_OPERATIONS.Tbl_Plans 
          SET PlanName = COALESCE(@PlanName, PlanName),
              Price = COALESCE(@Price, Price),
              DurationDays = COALESCE(@DurationDays, DurationDays),
              Description = COALESCE(@Description, Description),
              IsAddOn = COALESCE(@IsAddOn, IsAddOn)
          WHERE PlanId = @PlanId
        `);
      return { id, ...data };
    } catch (error) {
      throw new Error(`Error BD (actualizar): ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('PlanId', sql.Int, id)
        .query('UPDATE GYM_OPERATIONS.Tbl_Plans SET StatusId = 2 WHERE PlanId = @PlanId');
      return true;
    } catch (error) {
      throw new Error(`Error BD (eliminar): ${error.message}`);
    }
  }
}

module.exports = PlanModel;