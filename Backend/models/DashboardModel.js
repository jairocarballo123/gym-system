const { getConnection, sql } = require('../config/db');

class DashboardModel {
  // Resumen general (tarjetas)
  static async obtenerResumen() {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(`
        SELECT
          (SELECT COUNT(*) FROM GYM_OPERATIONS.Tbl_Members WHERE StatusId = 1) AS miembrosActivos,
          (SELECT ISNULL(SUM(TotalAmount), 0) FROM GYM_BILLING.Tbl_Invoices WHERE CAST(InvoiceDate AS DATE) = CAST(GETDATE() AS DATE)) AS ingresosHoy,
          (SELECT COUNT(*) FROM GYM_OPERATIONS.Tbl_Attendance WHERE CAST(AccessDate AS DATE) = CAST(GETDATE() AS DATE)) AS asistenciasHoy,
          (SELECT COUNT(*) FROM GYM_INVENTORY.Tbl_Products p LEFT JOIN GYM_INVENTORY.Tbl_Stock s ON p.ProductId = s.ProductId WHERE ISNULL(s.CurrentQuantity, 0) <= 5) AS stockBajo
      `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (resumen): ${error.message}`);
    }
  }



  static async obtenerUltimasActividades(limite = 20) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('limite', sql.Int, limite)
      .query(`
        SELECT * FROM (
          -- 1. VENTAS
          SELECT 
            'VENTA' AS tipo,
            i.InvoiceNumber AS referencia,
            i.TotalAmount AS monto,
            i.InvoiceDate AS fecha,
            CONCAT('Factura ', i.InvoiceNumber, ' - C$', i.TotalAmount) AS descripcion,
            i.InvoiceId AS id,
            i.InvoiceDate AS fechacomp
          FROM GYM_BILLING.Tbl_Invoices i

          UNION ALL

          -- 2. PAGOS
          SELECT 
            'PAGO' AS tipo,
            p.ReferenceNumber AS referencia,
            p.AmountPaid AS monto,
            p.PaymentDate AS fecha,
            CONCAT('Abono de C$', p.AmountPaid, ' a factura ', i.InvoiceNumber) AS descripcion,
            p.PaymentId AS id,
            p.PaymentDate AS fechacomp
          FROM GYM_BILLING.Tbl_Payments p
          INNER JOIN GYM_BILLING.Tbl_Invoices i ON p.InvoiceId = i.InvoiceId

          UNION ALL

          -- 3. ASISTENCIAS
          SELECT 
            'ASISTENCIA' AS tipo,
            CAST(a.AttendanceId AS VARCHAR) AS referencia,
            NULL AS monto,
            a.AccessDate AS fecha,
            CONCAT(m.FullName, ' registró entrada') AS descripcion,
            a.AttendanceId AS id,
            a.AccessDate AS fechacomp
          FROM GYM_OPERATIONS.Tbl_Attendance a
          INNER JOIN GYM_OPERATIONS.Tbl_Members m ON a.MemberId = m.MemberId

          UNION ALL

          -- 4. MOVIMIENTOS DE INVENTARIO
          SELECT 
            'INVENTARIO' AS tipo,
            CAST(m.MovementId AS VARCHAR) AS referencia,
            NULL AS monto,
            m.CreatedAt AS fecha,
            CONCAT('Movimiento de stock: ', m.MovementType, ' ', ABS(m.Quantity), ' unidades') AS descripcion,
            m.MovementId AS id,
            m.CreatedAt AS fechacomp
          FROM GYM_INVENTORY.Tbl_InventoryMovements m

          UNION ALL

          -- 5. MIEMBROS NUEVOS
          SELECT 
            'MIEMBRO_NUEVO' AS tipo,
            CAST(m.MemberId AS VARCHAR) AS referencia,
            NULL AS monto,
            m.CreatedAt AS fecha,
            CONCAT('Nuevo miembro: ', m.FullName) AS descripcion,
            m.MemberId AS id,
            m.CreatedAt AS fechacomp
          FROM GYM_OPERATIONS.Tbl_Members m
        ) AS actividades
        ORDER BY fechacomp DESC
        OFFSET 0 ROWS FETCH NEXT @limite ROWS ONLY
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (actividades): ${error.message}`);
  }
}

}

module.exports = DashboardModel;