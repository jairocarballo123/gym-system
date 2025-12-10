const pool = require('../DB/db');

class PlanModel {
    static async crear(plan) {
        const query = `INSERT INTO planes (id, nombre, precio, duracion_dias, descripcion, activo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [plan.id, plan.nombre, plan.precio, plan.duracion_dias, plan.descripcion, plan.activo];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async listar() {
        const result = await pool.query('SELECT * FROM planes');
        return result.rows;
    }

    static async buscarPorId(id) {
        const result = await pool.query('SELECT * FROM planes WHERE id = $1', [id]);
        return result.rows[0];
    }



    static async actualizar(id, data) {
    try { 
      const planActual = await pool.query('SELECT * FROM planes WHERE id = $1', [id]);
      
      if (planActual.rows.length === 0) {
        throw new Error('Plan no encontrado');
      }
      
      const viejo = planActual.rows[0];

      const query = `
        UPDATE Planes 
        SET nombre = $1, 
            precio = $2, 
            duracion_dias = $3, 
            descripcion = $4,
            activo = $5
        WHERE id = $6
        RETURNING *
      `;
      
      const values = [
        data.nombre || viejo.nombre,              
        data.precio || viejo.precio,              
        data.duracion_dias || viejo.duracion_dias,
        data.descripcion || viejo.descripcion,
        data.activo || viejo.activo,
        id
      ];
      
      const result = await pool.query(query, values);
      return result.rows[0];

    } catch (error) {
      throw new Error(`Error al actualizar: ${error.message}`);
    }
  }


static async eliminar(id) {
    try {
        // Primero verificamos si existe
        const check = await pool.query('SELECT id FROM Planes WHERE id = $1', [id]);
        if (check.rows.length === 0) {
            throw new Error('Plan no encontrado');
        }

        const query = 'DELETE FROM Planes WHERE id = $1';
        await pool.query(query, [id]);
        
        return { mensaje: 'Plan eliminado correctamente', id };
    } catch (error) {
        
        if (error.code === '23503') {
            throw new Error('No se puede eliminar el plan porque hay miembros o pagos asociados a él. Intenta desactivarlo en su lugar.');
        }
        throw new Error(`Error al eliminar plan: ${error.message}`);
    }
}

}
module.exports = PlanModel;