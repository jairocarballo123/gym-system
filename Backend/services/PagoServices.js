// services/PagoService.js
const Pago = require('../Entidades/Pago');
const PagoModel = require('../models/PagoModels');
const MiembroModel = require('../models/miembroModels');
const ProductoModel = require('../models/ProductoModel');

class PagoService {

  static async procesarVenta(data, userId) {
    try {
      const pago = new Pago(data);
      pago.validar();

      for (const detalle of pago.details) {
        if (detalle.itemType === 'PRODUCT') {
          const stock = await ProductoModel.obtenerStock(detalle.itemId);
          if (stock < detalle.quantity) {
            throw new Error(`Stock insuficiente para el producto ID ${detalle.itemId}. Disponible: ${stock}`);
          }
        }
      }

      if (pago.memberId) {
        const miembro = await MiembroModel.buscarPorId(pago.memberId);
        if (!miembro) {
          throw new Error(`Miembro con ID ${pago.memberId} no encontrado.`);
        }
      }

      const result = await PagoModel.procesarVenta(pago.toJSON(), userId);

      return {
        success: true,
        invoiceId: result.InvoiceId,
        invoiceNumber: result.InvoiceNumber,
        message: result.Message
      };
    } catch (error) {
      throw new Error(`Error al procesar venta: ${error.message}`);
    }
  }


  static async listarFacturas(filtros) {
    try {
      return await PagoModel.listarFacturas(filtros);
    } catch (error) {
      throw new Error(`Error al listar facturas: ${error.message}`);
    }
  }


  static async obtenerDetalleFactura(invoiceId) {
    try {
      const detalle = await PagoModel.obtenerDetalleFactura(invoiceId);
      if (!detalle || detalle.length === 0) {
        throw new Error('Factura no encontrada');
      }
      return detalle;
    } catch (error) {
      throw new Error(`Error al obtener detalle de factura: ${error.message}`);
    }
  }


  static async obtenerIngresosHoy() {
    try {
      return await PagoModel.obtenerIngresosHoy();
    } catch (error) {
      throw new Error(`Error al obtener ingresos de hoy: ${error.message}`);
    }
  }

  static async obtenerIngresosSemana() {
    try {
      return await PagoModel.obtenerIngresosSemana();
    } catch (error) {
      throw new Error(`Error al obtener ingresos de la semana: ${error.message}`);
    }
  }

  static async obtenerIngresosMes() {
    try {
      return await PagoModel.obtenerIngresosMes();
    } catch (error) {
      throw new Error(`Error al obtener ingresos del mes: ${error.message}`);
    }
  }

  static async obtenerIngresosPorMetodoPago() {
    try {
      return await PagoModel.obtenerIngresosPorMetodoPago();
    } catch (error) {
      throw new Error(`Error al obtener ingresos por método de pago: ${error.message}`);
    }
  }

  static async obtenerFacturasPendientes() {
    try {
      return await PagoModel.obtenerFacturasPendientes();
    } catch (error) {
      throw new Error(`Error al obtener facturas pendientes: ${error.message}`);
    }
  }

  static async obtenerHistorialPagos(invoiceId) {
    try {
      return await PagoModel.obtenerHistorialPagos(invoiceId);
    } catch (error) {
      throw new Error(`Error al obtener historial de pagos: ${error.message}`);
    }
  }

  static async registrarAbono(invoiceId, amount, paymentMethodId, cashierId, referenceNumber, notes) {
    try {
      if (!invoiceId) throw new Error('ID de factura requerido');
      if (!amount || amount <= 0) throw new Error('El monto debe ser mayor a cero');
      if (!paymentMethodId) throw new Error('Método de pago requerido');
      if (!cashierId) throw new Error('Cajero requerido');

      return await PagoModel.registrarAbono(invoiceId, amount, paymentMethodId, cashierId, referenceNumber, notes);
    } catch (error) {
      throw new Error(`Error al registrar abono: ${error.message}`);
    }
  }

  static async eliminarPago(paymentId, cashierId) {
    try {
      if (!paymentId) throw new Error('ID de pago requerido');
      return await PagoModel.eliminarPago(paymentId, cashierId);
    } catch (error) {
      throw new Error(`Error al eliminar pago: ${error.message}`);
    }
  }

  static async cancelarFactura(invoiceId, cashierId) {
    try {
      if (!invoiceId) throw new Error('ID de factura requerido');
      return await PagoModel.cancelarFactura(invoiceId, cashierId);
    } catch (error) {
      throw new Error(`Error al cancelar factura: ${error.message}`);
    }
  }
}

module.exports = PagoService;