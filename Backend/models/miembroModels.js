const pool = require('../DB/db');

class MiembroModel {


  static async crear(miembroData) {
    const query = `
      INSERT INTO Miembro (id, nombre, direccion, telefono, fecha_registro, plan_actual_id ,fecha_vencimiento, estado_Membresia, entrenador_id)
      VALUES ($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9)
      RETURNING *
    `;
    const values = [
      miembroData.id || null,
      miembroData.nombre|| null,
      miembroData.direccion || null,
      miembroData.telefono ||null,
      miembroData.fecha_registro ||null,
      miembroData.plan_id ||null,
      miembroData.fechaVencimiento ||null, 
      miembroData.estadoMembresia||null,
      miembroData.entrenadorId || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0]; 
  }


static async listar() {
  try {
    const query = `
      SELECT 
        m.id,
        m.nombre,
        m.direccion,
        m.telefono,
        m.fecha_registro,
        m.plan_actual_id,
        m.fecha_vencimiento,
        m.estado_membresia,
        m.entrenador_id
      FROM Miembro m
      ORDER BY m.fecha_registro DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    throw new Error(`Error al listar miembros: ${error.message}`);
  }
}



static async buscarSimplePorId(id) {
  const query = `
    SELECT *
    FROM Miembro
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0]; 
}




static async buscarPorId(id) {
  try {
    const query = `
      SELECT 
        m.*,
        e.nombre as entrenador_nombre,
        e.rol as entrenador_rol,
        e.telefono as entrenador_telefono
      FROM Miembro m
      LEFT JOIN Empleados e ON m.entrenador_id = e.id
      WHERE m.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new Error('Miembro no encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error al buscar miembro: ${error.message}`);
  }
}

static async actualizarEntrenador(id, entrenadorId) {
  try {
    const query = `
      UPDATE Miembro 
      SET entrenador_id = $1 
      WHERE id = $2
      RETURNING *
    `;
    const values = [entrenadorId, id];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      throw new Error('Miembro no encontrado');
    }
    
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error al actualizar entrenador: ${error.message}`);
  }
}

  // 📌 ACTUALIZAR miembro
 static async actualizar(id, miembroData) {
  const query = `
    UPDATE Miembro 
    SET nombre = $1,
        direccion = $2,
        telefono = $3,
        plan_actual_id = $4,
        fecha_vencimiento = $5,
        estado_membresia = $6,
        entrenador_id = $7
    WHERE id = $8
    RETURNING *
  `;
  
  const values = [
    miembroData.nombre || null,
    miembroData.direccion || null,
    miembroData.telefono || null,
    miembroData.plan_id || null,
    miembroData.fechaVencimiento || null,
    miembroData.estadoMembresia || null,
    miembroData.entrenadorId || null,
    id
    
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}



  static async eliminar(id) {
 
    await this.buscarPorId(id);

    const result = await pool.query('DELETE FROM Miembro WHERE id = $1', [id]);
    return { mensaje: 'Miembro eliminado correctamente' };
  }


  static async telefonoExiste(telefono, excluirId = null) {
    let query = 'SELECT id FROM Miembro WHERE telefono = $1';
    const values = [telefono];

    if (excluirId) {
      query += ' AND id != $2';
      values.push(excluirId);
    }

    const result = await pool.query(query, values);
    return result.rows.length > 0;
  }
}

module.exports = MiembroModel;