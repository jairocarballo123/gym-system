// models/Producto.model.js
const { getConnection, sql } = require('../config/db');

class ProductoModel {
  // ==================== CRUD ====================
  static async crear(productoData) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('ProductName', sql.VarChar(100), productoData.ProductName)
        .input('Price', sql.Decimal(10, 2), productoData.Price)
        .input('StatusId', sql.Int, productoData.StatusId)
        .query(`
          INSERT INTO GYM_INVENTORY.Tbl_Products (ProductName, Price, StatusId)
          OUTPUT INSERTED.ProductId, INSERTED.ProductName, INSERTED.Price, INSERTED.StatusId
          VALUES (@ProductName, @Price, @StatusId)
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (crear producto): ${error.message}`);
    }
  }

  static async listar() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT 
            p.ProductId AS id,
            p.ProductName AS nombre,
            p.Price AS precio,
            p.StatusId AS statusId,
            ISNULL(s.CurrentQuantity, 0) AS stockActual
          FROM GYM_INVENTORY.Tbl_Products p
          LEFT JOIN GYM_INVENTORY.Tbl_Stock s ON p.ProductId = s.ProductId
          WHERE p.StatusId = 1
          ORDER BY p.ProductName
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (listar productos): ${error.message}`);
    }
  }

  static async buscarPorId(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT 
            p.ProductId AS id,
            p.ProductName AS nombre,
            p.Price AS precio,
            p.StatusId AS statusId,
            ISNULL(s.CurrentQuantity, 0) AS stockActual
          FROM GYM_INVENTORY.Tbl_Products p
          LEFT JOIN GYM_INVENTORY.Tbl_Stock s ON p.ProductId = s.ProductId
          WHERE p.ProductId = @id
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (buscar producto): ${error.message}`);
    }
  }


static async actualizar(id, productoData) {
  try {
    const pool = await getConnection();
    

    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT ProductId FROM GYM_INVENTORY.Tbl_Products WHERE ProductId = @id');
    
    if (checkResult.recordset.length === 0) {
      throw new Error('Producto no encontrado');
    }


    await pool.request()
      .input('id', sql.Int, id)
      .input('ProductName', sql.VarChar(100), productoData.ProductName)
      .input('Price', sql.Decimal(10, 2), productoData.Price)
      .input('StatusId', sql.Int, productoData.StatusId)
      .query(`
        UPDATE GYM_INVENTORY.Tbl_Products
        SET 
          ProductName = @ProductName,
          Price = @Price,
          StatusId = @StatusId
        WHERE ProductId = @id
      `);

  
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          ProductId, 
          ProductName, 
          Price, 
          StatusId
        FROM GYM_INVENTORY.Tbl_Products
        WHERE ProductId = @id
      `);

    return result.recordset[0];
  } catch (error) {
    throw new Error(`Error BD (actualizar producto): ${error.message}`);
  }
}

  static async desactivar(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          UPDATE GYM_INVENTORY.Tbl_Products
          SET StatusId = 2
          WHERE ProductId = @id AND StatusId = 1
        `);
      if (result.rowsAffected[0] === 0) throw new Error('Producto no encontrado o ya inactivo');
      return true;
    } catch (error) {
      throw new Error(`Error BD (desactivar producto): ${error.message}`);
    }
  }

  // ==================== STOCK ====================
  static async obtenerStock(productId) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('ProductId', sql.Int, productId)
        .query(`
          SELECT ISNULL(CurrentQuantity, 0) AS stock
          FROM GYM_INVENTORY.Tbl_Stock
          WHERE ProductId = @ProductId
        `);
      return result.recordset[0]?.stock || 0;
    } catch (error) {
      throw new Error(`Error BD (obtener stock): ${error.message}`);
    }
  }

  static async crearStockInicial(productId, cantidad) {
    try {
      const pool = await getConnection();
      await pool.request()
        .input('ProductId', sql.Int, productId)
        .input('CurrentQuantity', sql.Int, cantidad)
        .query(`
          INSERT INTO GYM_INVENTORY.Tbl_Stock (ProductId, CurrentQuantity)
          VALUES (@ProductId, @CurrentQuantity)
        `);
      return true;
    } catch (error) {
      throw new Error(`Error BD (crear stock inicial): ${error.message}`);
    }
  }

  static async ajustarStock(productId, cantidad, userId, motivo) {
    try {
      const pool = await getConnection();

      // Contexto para auditoría
      await pool.request()
        .input('userId', sql.Int, userId)
        .query('EXEC sp_set_session_context @key = N\'UserId\', @value = @userId;');

      // Actualizar stock
      await pool.request()
        .input('ProductId', sql.Int, productId)
        .input('Cantidad', sql.Int, cantidad)
        .query(`
          UPDATE GYM_INVENTORY.Tbl_Stock
          SET CurrentQuantity = CurrentQuantity + @Cantidad,
              LastUpdated = GETDATE()
          WHERE ProductId = @ProductId
        `);

      // Registrar movimiento
      const movimientoType = cantidad > 0 ? 'ENTRADA' : 'SALIDA';
      await pool.request()
        .input('ProductId', sql.Int, productId)
        .input('Quantity', sql.Int, cantidad)
        .input('MovementType', sql.VarChar(20), movimientoType)
        .input('Notes', sql.NVarChar(255), motivo)
        .query(`
          INSERT INTO GYM_INVENTORY.Tbl_InventoryMovements (ProductId, Quantity, MovementType, Notes, CreatedAt)
          VALUES (@ProductId, @Quantity, @MovementType, @Notes, GETDATE())
        `);

      return true;
    } catch (error) {
      throw new Error(`Error BD (ajustar stock): ${error.message}`);
    }
  }


  // ==================== ESTADÍSTICAS ====================

static async obtenerResumen() {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN p.StatusId = 1 THEN 1 ELSE 0 END) AS activos,
          SUM(CASE WHEN ISNULL(s.CurrentQuantity, 0) = 0 THEN 1 ELSE 0 END) AS sinStock,
          SUM(CASE WHEN ISNULL(s.CurrentQuantity, 0) <= 5 AND ISNULL(s.CurrentQuantity, 0) > 0 THEN 1 ELSE 0 END) AS stockBajo,
          SUM(p.Price * ISNULL(s.CurrentQuantity, 0)) AS valorInventario
        FROM GYM_INVENTORY.Tbl_Products p
        LEFT JOIN GYM_INVENTORY.Tbl_Stock s ON p.ProductId = s.ProductId
        WHERE p.StatusId = 1
      `);
    return result.recordset[0];
  } catch (error) {
    throw new Error(`Error BD (obtenerResumen): ${error.message}`);
  }
}

static async obtenerStockBajo(umbral = 5) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('umbral', sql.Int, umbral)
      .query(`
        SELECT TOP 10
          p.ProductId AS id,
          p.ProductName AS nombre,
          ISNULL(s.CurrentQuantity, 0) AS stockActual,
          p.Price AS precio
        FROM GYM_INVENTORY.Tbl_Products p
        LEFT JOIN GYM_INVENTORY.Tbl_Stock s ON p.ProductId = s.ProductId
        WHERE p.StatusId = 1 AND ISNULL(s.CurrentQuantity, 0) <= @umbral
        ORDER BY stockActual ASC
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (obtenerStockBajo): ${error.message}`);
  }
}

static async obtenerMasVendidos(limite = 5) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('limite', sql.Int, limite)
      .query(`
        SELECT TOP (@limite)
          p.ProductId AS id,
          p.ProductName AS nombre,
          SUM(d.Quantity) AS unidadesVendidas,
          SUM(d.SubTotal) AS totalVendido
        FROM GYM_INVENTORY.Tbl_Products p
        INNER JOIN GYM_BILLING.Tbl_InvoiceDetails d ON p.ProductId = d.ItemId
        WHERE d.ItemType = 'PRODUCT'
        GROUP BY p.ProductId, p.ProductName
        ORDER BY unidadesVendidas DESC
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (obtenerMasVendidos): ${error.message}`);
  }
}



static async ajustarStock(productId, cantidad, userId, motivo) {
  try {
    const pool = await getConnection();

    await pool.request()
      .input('userId', sql.Int, userId)
      .query('EXEC sp_set_session_context @key = N\'UserId\', @value = @userId;');

    await pool.request()
      .input('ProductId', sql.Int, productId)
      .input('Cantidad', sql.Int, cantidad)
      .query(`
        UPDATE GYM_INVENTORY.Tbl_Stock
        SET CurrentQuantity = CurrentQuantity + @Cantidad,
            LastUpdated = GETDATE()
        WHERE ProductId = @ProductId
      `);

    const movimientoType = cantidad > 0 ? 'ENTRADA' : 'SALIDA';
    await pool.request()
      .input('ProductId', sql.Int, productId)
      .input('Quantity', sql.Int, cantidad)
      .input('MovementType', sql.VarChar(20), movimientoType)
     
      .query(`
        INSERT INTO GYM_INVENTORY.Tbl_InventoryMovements 
          (ProductId, Quantity, MovementType, CreatedAt)
        VALUES (@ProductId, @Quantity, @MovementType, GETDATE())
      `);

    return true;
  } catch (error) {
    throw new Error(`Error BD (ajustarStock): ${error.message}`);
  }
}

static async obtenerMovimientos(productId, limite = 50) {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('ProductId', sql.Int, productId)
      .input('limite', sql.Int, limite)
      .query(`
        SELECT TOP (@limite)
          MovementId,
          Quantity,
          MovementType,
          CreatedAt AS fecha
        FROM GYM_INVENTORY.Tbl_InventoryMovements
        WHERE ProductId = @ProductId
        ORDER BY CreatedAt DESC
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (obtenerMovimientos): ${error.message}`);
  }
}
}

module.exports = ProductoModel;