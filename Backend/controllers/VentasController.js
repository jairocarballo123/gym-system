const MembersService = require('../services/MiembroServices');

const VentasController = {
    // Este método es el que llamará React desde la pantalla de Recepción
    crearVentaRecepcion: async (req, res) => {
        try {
            const payload = req.body;
            
            // Delegamos la tarea al servicio experto (Members)
            const resultado = await MembersService.registerFullMember(payload);

            res.status(201).json({
                success: true,
                data: resultado
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = VentasController;