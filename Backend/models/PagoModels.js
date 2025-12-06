const pool = require('../DB/db');

class PaymentModel {
    
    // Obtener el último pago registrado (Para calcular el siguiente recibo)
    static async getLast() {
        try {
            const query = 'SELECT recibo_id FROM pagos ORDER BY id DESC LIMIT 1';
            const { rows } = await pool.query(query);
            return rows[0]; // Retorna { recibo_id: 'REC-0005' } o undefined
        } catch (error) {
            throw error;
        }
    }

    static async findAll() {
        const query = `
            SELECT p.*, m.nombre as miembro_nombre 
            FROM pagos p
            JOIN miembro m ON p.miembro_id = m.id
            ORDER BY p.id DESC
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    static async create(paymentEntity) {
        const query = `
            INSERT INTO pagos (recibo_id, miembro_id, monto, fecha_pago)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [
            paymentEntity.recibo_id,
            paymentEntity.miembro_id,
            paymentEntity.monto,
            paymentEntity.fecha_pago
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM pagos WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = PaymentModel;