// models/EmpleadoModel.js
const { getConnection, sql } = require('../config/db');

class EmpleadoModel {

  static async findById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('Id', sql.Int, id)
        .query('SELECT * FROM GYM_HR.Tbl_Employees WHERE EmployeeId = @Id');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (findById): ${error.message}`);
    }
  }

  static async findByNombre(nombre) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('nombre', sql.NVarChar, nombre)
        .query('SELECT * FROM GYM_HR.Tbl_Employees WHERE FullName = @nombre');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (findByNombre): ${error.message}`);
    }
  }

  static async crear(empleadoData) {
    try {
      const pool = await getConnection();

      const result = await pool.request()
        .input('FullName', sql.VarChar(100), empleadoData.nombre)
        .input('Phone', sql.VarChar(20), empleadoData.telefono)
        .input('RoleId', sql.Int, empleadoData.roleId)
        .input('StatusId', sql.Int, empleadoData.statusId)
        .input('PasswordHash', sql.VarChar(255), empleadoData.password)
        .input('Specialty', sql.VarChar(100), empleadoData.specialty || null)
        .input('Availability', sql.VarChar(255), empleadoData.availability || null)
        .query(`
          INSERT INTO GYM_HR.Tbl_Employees 
            (FullName, Phone, RoleId, StatusId, PasswordHash, Specialty, Availability, CreatedAt)
          OUTPUT 
            INSERTED.EmployeeId, INSERTED.FullName, INSERTED.Phone, 
            INSERTED.RoleId, INSERTED.StatusId, INSERTED.Specialty, INSERTED.Availability
          VALUES 
            (@FullName, @Phone, @RoleId, @StatusId, @PasswordHash, @Specialty, @Availability, GETDATE());
        `);

      return result.recordset[0];
    } catch (error) {
      if (error.number === 2627) throw new Error('El empleado ya existe.');
      throw new Error(`Error BD (crear): ${error.message}`);
    }
  }

  static async listarEntrenadores() {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .query(`
          SELECT EmployeeId AS id, FullName AS nombre
          FROM GYM_HR.Tbl_Employees
          WHERE RoleId = 2 AND StatusId = 1
          ORDER BY FullName
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error BD (listarEntrenadores): ${error.message}`);
    }
  }

 static async listar() {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`
        SELECT 
          EmployeeId AS id, 
          FullName AS nombre, 
          Phone AS telefono, 
          RoleId AS roleId, 
          StatusId AS statusId,
          Specialty AS specialty,
          Availability AS availability
        FROM GYM_HR.Tbl_Employees
        ORDER BY FullName ASC
      `);
    return result.recordset;
  } catch (error) {
    throw new Error(`Error BD (listar): ${error.message}`);
  }
}
  static async actualizar(id, empleadoData) {
    try {
      const pool = await getConnection();

      const result = await pool.request()
        .input('Id', sql.Int, id)
        .input('FullName', sql.VarChar(100), empleadoData.nombre)
        .input('Phone', sql.VarChar(20), empleadoData.telefono)
        .input('RoleId', sql.Int, empleadoData.roleId)
        .input('StatusId', sql.Int, empleadoData.statusId)
        .input('Specialty', sql.VarChar(100), empleadoData.specialty || null)
        .input('Availability', sql.VarChar(255), empleadoData.availability || null)
        .query(`
          UPDATE GYM_HR.Tbl_Employees 
          SET 
            FullName = @FullName, 
            Phone = @Phone, 
            RoleId = @RoleId, 
            StatusId = @StatusId,
            Specialty = @Specialty,
            Availability = @Availability,
            UpdatedAt = GETDATE()
          OUTPUT 
            INSERTED.EmployeeId, INSERTED.FullName, INSERTED.Phone,
            INSERTED.RoleId, INSERTED.StatusId, INSERTED.Specialty, INSERTED.Availability
          WHERE EmployeeId = @Id
        `);

      if (result.rowsAffected[0] === 0) throw new Error('Empleado no encontrado.');
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error BD (actualizar): ${error.message}`);
    }
  }

  static async desactivar(id) {
    try {
      const pool = await getConnection();

      const result = await pool.request()
        .input('Id', sql.Int, id)
        .query(`
          UPDATE GYM_HR.Tbl_Employees 
          SET StatusId = 2, UpdatedAt = GETDATE()
          OUTPUT INSERTED.EmployeeId
          WHERE EmployeeId = @Id AND StatusId = 1
        `);

      if (result.rowsAffected[0] === 0) throw new Error('El empleado no existe o ya estaba inactivo.');
      return true;
    } catch (error) {
      throw new Error(`Error BD (desactivar): ${error.message}`);
    }
  }
}

module.exports = EmpleadoModel;