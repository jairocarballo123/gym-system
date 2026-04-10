// models/PagoModel.js
const { getConnection, sql } = require('../config/db');

class PagoModel {

  static async procesarVenta(pagoData, userId) {
    try {
      const pool = await getConnection();

      await pool.request()
        .input('userId', sql.Int, userId)
        .query('EXEC sp_set_session_context @key = N\'UserId\', @value = @userId;');

      const result = await pool.request()
        .input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(pagoData))
        .execute('GYM_BILLING.SP_ProcesarVenta');

      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (procesarVenta): ${error.message}`);
    }
  }

  static async listarFacturas(filtros = {}) {
    try {
      const pool = await getConnection();
      let query = `
        SELECT 
          i.InvoiceId, i.InvoiceNumber, i.InvoiceDate,
          i.MemberId, m.FullName AS MemberName,
          i.TotalAmount, i.Balance, i.CurrencyId, c.CurrencyCode,
          i.PaymentMethodId, pm.MethodName,
          i.CashierId, e.FullName AS CashierName,
          i.StatusId, s.StatusName
        FROM GYM_BILLING.Tbl_Invoices i
        LEFT JOIN GYM_OPERATIONS.Tbl_Members m ON i.MemberId = m.MemberId
        LEFT JOIN GYM_CATALOGS.Tbl_Currencies c ON i.CurrencyId = c.CurrencyId
        LEFT JOIN GYM_CATALOGS.Tbl_PaymentMethods pm ON i.PaymentMethodId = pm.PaymentMethodId
        LEFT JOIN GYM_HR.Tbl_Employees e ON i.CashierId = e.EmployeeId
        LEFT JOIN GYM_CATALOGS.Tbl_Statuses s ON i.StatusId = s.StatusId
        WHERE 1=1
      `;

      const request = pool.request();

      if (filtros.startDate) {
        query += ' AND i.InvoiceDate >= @startDate';
        request.input('startDate', sql.DateTime, filtros.startDate);
      }
      if (filtros.endDate) {
        query += ' AND i.InvoiceDate <= @endDate';
        request.input('endDate', sql.DateTime, filtros.endDate);
      }
      if (filtros.memberId) {
        query += ' AND i.MemberId = @memberId';
        request.input('memberId', sql.Int, filtros.memberId);
      }
      if (filtros.statusId) {
        query += ' AND i.StatusId = @statusId';
        request.input('statusId', sql.Int, filtros.statusId);
      }

      query += ' ORDER BY i.InvoiceDate DESC';

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (listarFacturas): ${error.message}`);
    }
  }

static async obtenerDetalleFactura(invoiceId) {
  try {
    const pool = await getConnection();
    
    // 1. Obtener la factura
    const facturaResult = await pool.request()
      .input('invoiceId', sql.Int, invoiceId)
      .query(`
        SELECT 
          i.InvoiceId, i.InvoiceNumber, i.InvoiceDate,
          i.MemberId, m.FullName AS MemberName,
          i.TotalAmount, i.Balance, i.CurrencyId,
          i.PaymentMethodId, i.StatusId
        FROM GYM_BILLING.Tbl_Invoices i
        LEFT JOIN GYM_OPERATIONS.Tbl_Members m ON i.MemberId = m.MemberId
        WHERE i.InvoiceId = @invoiceId
      `);
    

    const detallesResult = await pool.request()
      .input('invoiceId', sql.Int, invoiceId)
      .query(`
        SELECT 
          d.DetailId, d.ItemType, d.ItemId, d.Quantity, d.UnitPrice, d.SubTotal,
          CASE 
            WHEN d.ItemType = 'PLAN' THEN (SELECT PlanName FROM GYM_OPERATIONS.Tbl_Plans WHERE PlanId = d.ItemId)
            WHEN d.ItemType = 'PRODUCT' THEN (SELECT ProductName FROM GYM_INVENTORY.Tbl_Products WHERE ProductId = d.ItemId)
          END AS ItemName
        FROM GYM_BILLING.Tbl_InvoiceDetails d
        WHERE d.InvoiceId = @invoiceId
      `);
    
    // 3. Combinar resultados
    const factura = facturaResult.recordset[0];
    if (factura) {
      factura.Detalles = detallesResult.recordset;
    }
    
    return factura;
  } catch (error) {
    throw new Error(`Error BD (obtenerDetalleFactura): ${error.message}`);
  }
}
 

  static async obtenerIngresosHoy() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT ISNULL(SUM(TotalAmount), 0) AS total
          FROM GYM_BILLING.Tbl_Invoices
          WHERE CAST(InvoiceDate AS DATE) = CAST(GETDATE() AS DATE)
            AND StatusId = 1
        `);
      return result.recordset[0].total;
    } catch (error) {
      throw new Error(`Error BD (ingresosHoy): ${error.message}`);
    }
  }

  static async obtenerIngresosSemana() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT ISNULL(SUM(TotalAmount), 0) AS total
          FROM GYM_BILLING.Tbl_Invoices
          WHERE InvoiceDate >= DATEADD(day, -7, GETDATE())
            AND StatusId = 1
        `);
      return result.recordset[0].total;
    } catch (error) {
      throw new Error(`Error BD (ingresosSemana): ${error.message}`);
    }
  }

  static async obtenerIngresosMes() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT ISNULL(SUM(TotalAmount), 0) AS total
          FROM GYM_BILLING.Tbl_Invoices
          WHERE MONTH(InvoiceDate) = MONTH(GETDATE()) 
            AND YEAR(InvoiceDate) = YEAR(GETDATE())
            AND StatusId = 1
        `);
      return result.recordset[0].total;
    } catch (error) {
      throw new Error(`Error BD (ingresosMes): ${error.message}`);
    }
  }

  static async obtenerIngresosPorMetodoPago() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT 
            pm.MethodName,
            ISNULL(SUM(i.TotalAmount), 0) AS total
          FROM GYM_BILLING.Tbl_Invoices i
          INNER JOIN GYM_CATALOGS.Tbl_PaymentMethods pm ON i.PaymentMethodId = pm.PaymentMethodId
          WHERE CAST(i.InvoiceDate AS DATE) = CAST(GETDATE() AS DATE)
            AND i.StatusId = 1
          GROUP BY pm.MethodName
          ORDER BY total DESC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (ingresosPorMetodoPago): ${error.message}`);
    }
  }

 static async obtenerFacturasPendientes() {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT TOP 20
          i.InvoiceId,
          i.InvoiceNumber,
          i.InvoiceDate,
          i.TotalAmount,
          i.Balance,
          m.FullName AS MemberName,  -- ← Cambiado de 'miembro' a 'MemberName'
          (i.TotalAmount - i.Balance) AS pagado
        FROM GYM_BILLING.Tbl_Invoices i
        LEFT JOIN GYM_OPERATIONS.Tbl_Members m ON i.MemberId = m.MemberId
        WHERE i.Balance > 0 AND i.StatusId = 1
        ORDER BY i.InvoiceDate DESC
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (facturasPendientes): ${error.message}`);
  }
}
  static async obtenerHistorialPagos(invoiceId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('invoiceId', sql.Int, invoiceId)
        .query(`
          SELECT 
            PaymentId,
            AmountPaid,
            PaymentDate,
            PaymentMethodId,
            ReferenceNumber,
            Notes
          FROM GYM_BILLING.Tbl_Payments
          WHERE InvoiceId = @invoiceId
          ORDER BY PaymentDate ASC
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (obtenerHistorialPagos): ${error.message}`);
    }
  }

  

  static async registrarAbono(invoiceId, amount, paymentMethodId, cashierId, referenceNumber, notes) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('InvoiceId', sql.Int, invoiceId)
        .input('Amount', sql.Decimal(10, 2), amount)
        .input('PaymentMethodId', sql.Int, paymentMethodId)
        .input('CashierId', sql.Int, cashierId)
        .input('ReferenceNumber', sql.VarChar(100), referenceNumber)
        .input('Notes', sql.NVarChar(255), notes)
        .execute('GYM_BILLING.SP_RegistrarAbono');
      
      return { 
        success: true, 
        message: result.recordset[0]?.Message,
        nuevoBalance: result.recordset[0]?.NuevoBalance
      };
    } catch (error) {
      throw new Error(`Error BD (registrarAbono): ${error.message}`);
    }
  }

  static async eliminarPago(paymentId, cashierId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('PaymentId', sql.Int, paymentId)
        .input('CashierId', sql.Int, cashierId)
        .execute('GYM_BILLING.SP_EliminarPago');
      
      return { success: true, message: result.recordset[0]?.Message };
    } catch (error) {
      throw new Error(`Error BD (eliminarPago): ${error.message}`);
    }
  }

  static async cancelarFactura(invoiceId, cashierId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('InvoiceId', sql.Int, invoiceId)
        .input('CashierId', sql.Int, cashierId)
        .execute('GYM_BILLING.SP_CancelarFactura');
      
      return { success: true, message: result.recordset[0]?.Message };
    } catch (error) {
      throw new Error(`Error BD (cancelarFactura): ${error.message}`);
    }
  }
}

module.exports = PagoModel;