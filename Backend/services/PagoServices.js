const PaymentModel = require('../models/PagoModels');
const Payment = require('../Entidades/Pago');

class PaymentService {

    static async _generarProximoRecibo() {
        const ultimoPago = await PaymentModel.getLast();
        
        if (!ultimoPago || !ultimoPago.recibo_id) {
            return 'REC-0001';
        }

      
        const partes = ultimoPago.recibo_id.split('-'); 
        const numeroActual = parseInt(partes[1]); 
        

        const siguienteNumero = numeroActual + 1;

       
        return `REC-${siguienteNumero.toString().padStart(4, '0')}`;
    }

    static async obtenerTodos() {
        return await PaymentModel.findAll();
    }

    static async registrarPago(data) {
        try {
    
            const nuevoReciboId = await this._generarProximoRecibo();

       
            const datosCompletos = {
                ...data,
                recibo_id: nuevoReciboId 
            };

            const pagoValidado = new Payment(datosCompletos);

         
            return await PaymentModel.create(pagoValidado);

        } catch (error) {
            if (error.code === '23503') throw new Error("El socio indicado no existe.");
            throw error;
        }
    }

    static async anularPago(id) {
        const eliminado = await PaymentModel.delete(id);
        if (!eliminado) throw new Error("El pago no existe.");
        return eliminado;
    }
}

module.exports = PaymentService;