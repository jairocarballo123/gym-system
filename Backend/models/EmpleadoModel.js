// models/empleadoModel.js
const pool = require('../DB/db');

class EmpleadoModel {

  static async crear(empleado) {
    try {
    
      const query = `
        INSERT INTO Empleados (id, nombre, telefono, rol, especialidad, disponibilidad, fecha_ingreso, activo,password)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
        RETURNING *
      `;

      
      const values = [
        empleado.id,
        empleado.nombre,
        empleado.telefono,
        empleado.rol,
        empleado.especialidad || null,
        empleado.disponibilidad,
        empleado.fecha_ingreso,
        empleado.activo,
        empleado.password || null
      ];

      const result = await pool.query(query, values);
      return result.rows[0];

    } catch (error) {
      if (error.code === '23505') { // Código PostgreSQL para violación de unique (ID duplicado)
        throw new Error('El ID generado ya existe o el empleado ya está registrado.');
      }
      throw new Error(`Error en base de datos al crear empleado: ${error.message}`);
    }
  }

  static async listar() {
    try {
      const query = `
        SELECT id, nombre, rol, telefono, especialidad, disponibilidad, fecha_ingreso, activo, password
        FROM Empleados 
        ORDER BY fecha_ingreso DESC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error al listar empleados: ${error.message}`);
    }
  }

  static async buscarPorId(id) {
    try {
      const query = `
        SELECT * FROM Empleados WHERE id = $1
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al buscar empleado: ${error.message}`);
    }
  }

  static async actualizar(id, data) {
    try {
     
      const query = `
        UPDATE Empleados 
        SET nombre = $1, 
            rol = $2, 
            telefono = $3, 
            especialidad = $4, 
            disponibilidad = $5, 
            activo = $6,
            password =$7
        WHERE id = $8
        RETURNING *
      `;

      const values = [
        data.nombre,
        data.rol,
        data.telefono,
        data.especialidad,
        data.disponibilidad,
        data.activo,
        data.password,
        id
      ];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('No se pudo actualizar, empleado no encontrado.');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Error al actualizar empleado: ${error.message}`);
    }
  }

  static async eliminar(id) {
    try {
      // Primero verificamos existencia (opcional si confías en el DELETE count)
      const checkQuery = 'SELECT id FROM Empleados WHERE id = $1';
      const check = await pool.query(checkQuery, [id]);

      if (check.rows.length === 0) {
        throw new Error('Empleado no encontrado');
      }

      const query = 'DELETE FROM Empleados WHERE id = $1';
      await pool.query(query, [id]);

      return { mensaje: 'Empleado eliminado correctamente', id: id };
    } catch (error) {
      throw new Error(`Error al eliminar empleado: ${error.message}`);
    }
  }

  static async buscarPorRol(rol) {
    try {
      const query = `
        SELECT id, nombre, rol, telefono, especialidad, disponibilidad
        FROM Empleados 
        WHERE rol = $1
        ORDER BY nombre ASC
      `;

      const result = await pool.query(query, [rol]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error al buscar por rol: ${error.message}`);
    }
  }

  static async obtenerMiembrosAsignados(entrenadorId) {
    try {
     
      const query = `
        SELECT m.id, m.nombre, m.telefono, m.fecha_registro, m.objetivo
        FROM miembros m
        WHERE m.entrenador_id = $1
      `;

      const result = await pool.query(query, [entrenadorId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error al obtener miembros: ${error.message}`);
    }
  }

 static async obtenerEmpleadosPorNombre(nombre) {
  try {
    const query = `
      SELECT * FROM Empleados
      WHERE nombre ILIKE $1
      ORDER BY nombre ASC
    `; 
    // Agregamos los % aquí para permitir búsquedas parciales
    const result = await pool.query(query, [`%${nombre}%`]);

    return result.rows; 

  } catch (error) {
    throw new Error(`Error al buscar empleado: ${error.message}`);
  }
}


}

module.exports = EmpleadoModel;