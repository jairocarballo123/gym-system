const PaymentService = require('../services/PagoServices');

class PaymentController {
    static async getAll(req, res) {
        try {
            const data = await PaymentService.obtenerTodos();
            res.json(data);
        } catch (e) { res.status(500).json({ error: e.message }); }
    }

    static async create(req, res) {
        try {
            const data = await PaymentService.registrarPago(req.body);
            res.status(201).json(data);
        } catch (e) { res.status(400).json({ error: e.message }); }
    }

    static async delete(req, res) {
        try {
            await PaymentService.anularPago(req.params.id);
            res.json({ message: "Eliminado" });
        } catch (e) { res.status(500).json({ error: e.message }); }
    }
}
module.exports = PaymentController;