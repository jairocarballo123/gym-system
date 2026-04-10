// models/CronModel.js
const { getConnection } = require('../config/db');

class CronModel {
    static async ejecutarVencimiento(fechaReferencia = null) {
        try {
            const pool = await getConnection();
            const request = pool.request();
            if (fechaReferencia) {
                request.input('ReferenceDate', sql.Date, fechaReferencia);
            }
            await request.execute('GYM_OPERATIONS.Sp_UpdateExpiredMemberships');
            return true;
        } catch (error) {
            throw new Error(`Error al ejecutar vencimiento: ${error.message}`);
        }
    }
}

module.exports = CronModel;