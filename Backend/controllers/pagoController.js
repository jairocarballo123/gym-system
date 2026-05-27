// controllers/PagoController.js
const PagoService = require('../services/PagoServices');

const PagoController = {
  // ============================================
  // VENTAS
  // ============================================
  async procesarVenta(req, res) {
    try {
      const result = await PagoService.procesarVenta(req.body, req.user.id);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      if (error.message.includes('Stock')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async listarFacturas(req, res) {
    try {
      const facturas = await PagoService.listarFacturas(req.query);
      res.status(200).json({ success: true, data: facturas });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },


  async obtenerDetalleFactura(req, res) {
  try {
    const detalle = await PagoService.obtenerDetalleFactura(req.params.id);
    if (!detalle) {
      return res.status(404).json({ success: false, message: 'Factura no encontrada' });
    }
    res.status(200).json({ success: true, data: detalle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
},
  // ============================================
  // REPORTES
  // ============================================
  async obtenerIngresosHoy(req, res) {
    try {
      const total = await PagoService.obtenerIngresosHoy();
      res.status(200).json({ success: true, data: { total } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async obtenerIngresosSemana(req, res) {
    try {
      const total = await PagoService.obtenerIngresosSemana();
      res.status(200).json({ success: true, data: { total } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async obtenerIngresosMes(req, res) {
    try {
      const total = await PagoService.obtenerIngresosMes();
      res.status(200).json({ success: true, data: { total } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async obtenerIngresosPorMetodoPago(req, res) {
    try {
      const data = await PagoService.obtenerIngresosPorMetodoPago();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async obtenerFacturasPendientes(req, res) {
    try {
      const data = await PagoService.obtenerFacturasPendientes();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async obtenerHistorialPagos(req, res) {
    try {
      const pagos = await PagoService.obtenerHistorialPagos(req.params.id);
      res.status(200).json({ success: true, data: pagos });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  async registrarAbono(req, res) {
    try {
      const { invoiceId, amount, paymentMethodId, referenceNumber, notes } = req.body;
      const result = await PagoService.registrarAbono(
        invoiceId, amount, paymentMethodId, req.user.id, referenceNumber, notes
      );
      res.status(200).json({ success: true, message: result.message, nuevoBalance: result.nuevoBalance });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async eliminarPago(req, res) {
    try {
      const { paymentId } = req.params;
      const result = await PagoService.eliminarPago(paymentId, req.user.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async cancelarFactura(req, res) {
    try {
      const { invoiceId } = req.params;
      const result = await PagoService.cancelarFactura(invoiceId, req.user.id);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = PagoController;