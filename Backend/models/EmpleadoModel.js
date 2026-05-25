// models/EmpleadoModel.js
const { getConnection, sql } = require('../config/db');

class EmpleadoModel {

  static async findById(id) {
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('Id', sql.Int, id)
        .query(`
          SELECT 
            E.EmployeeId AS id, 
            E.FullName AS nombre, 
            E.Phone AS telefono, 
            R.RoleName AS Rol, 
            S.StatusName AS Estado,
            E.Specialty AS Especialidad,
            E.Availability AS Disponibilidad,
            E.RoleId AS roleId,
            E.StatusId AS statusId,
            (SELECT COUNT(*) FROM GYM_OPERATIONS.Tbl_Members M WHERE M.TrainerId = E.EmployeeId) AS ClientesAsignados,
            (SELECT COUNT(*) FROM GYM_BILLING.Tbl_Invoices I WHERE I.CashierId = E.EmployeeId) AS FacturasProcesadas
          FROM GYM_HR.Tbl_Employees E
          INNER JOIN GYM_SECURITY.Tbl_Roles R ON E.RoleId = R.RoleId
          INNER JOIN GYM_CATALOGS.Tbl_Statuses S ON E.StatusId = S.StatusId
          WHERE E.EmployeeId = @Id
        `);
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
            INSERTED.EmployeeId AS id, INSERTED.FullName AS nombre, INSERTED.Phone AS telefono, 
            INSERTED.RoleId AS roleId, INSERTED.StatusId AS statusId, INSERTED.Specialty AS specialty, INSERTED.Availability AS availability
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
            E.EmployeeId AS id, 
            E.FullName AS nombre, 
            E.Phone AS telefono, 
            R.RoleName AS Rol, 
            S.StatusName AS Estado,
            E.Specialty AS Especialidad,
            E.Availability AS Disponibilidad,
            E.RoleId AS roleId,
            E.StatusId AS statusId,
            -- Conteo de alumnos activos asignados al entrenador
            (SELECT COUNT(*) FROM GYM_OPERATIONS.Tbl_Members M WHERE M.TrainerId = E.EmployeeId) AS ClientesAsignados,
            -- Conteo de transacciones facturadas por el empleado
            (SELECT COUNT(*) FROM GYM_BILLING.Tbl_Invoices I WHERE I.CashierId = E.EmployeeId) AS FacturasProcesadas
          FROM GYM_HR.Tbl_Employees E
          INNER JOIN GYM_SECURITY.Tbl_Roles R ON E.RoleId = R.RoleId
          INNER JOIN GYM_CATALOGS.Tbl_Statuses S ON E.StatusId = S.StatusId
          ORDER BY E.FullName ASC
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
            INSERTED.EmployeeId AS id, INSERTED.FullName AS nombre, INSERTED.Phone AS telefono,
            INSERTED.RoleId AS roleId, INSERTED.StatusId AS statusId, INSERTED.Specialty AS specialty, INSERTED.Availability AS availability
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