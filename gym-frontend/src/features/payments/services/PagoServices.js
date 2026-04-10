// src/features/pagos/services/pagoApi.js
import api from '../../../api/AxiosConfig';

export const pagoApi = {
  // ========== FACTURAS ==========
  // Listar todas las facturas
  listarFacturas: async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    const res = await api.get(`/pagos${params ? `?${params}` : ''}`);
    return res.data.data;
  },

  // Obtener detalle de una factura
  obtenerDetalle: async (invoiceId) => {
    const res = await api.get(`/pagos/${invoiceId}`);
    return res.data.data;
  },

  // Obtener facturas pendientes (con balance > 0)
  obtenerFacturasPendientes: async () => {
    const res = await api.get('/pagos/facturas-pendientes');
    return res.data.data;
  },

  // Obtener historial de pagos de una factura
  obtenerHistorialPagos: async (invoiceId) => {
    const res = await api.get(`/pagos/${invoiceId}/pagos`);
    return res.data.data;
  },

  // ========== ABONOS ==========
  registrarAbono: async (data) => {
    const res = await api.post('/pagos/abono', data);
    return res.data;
  },

  // ========== REPORTES ==========
  obtenerIngresosHoy: async () => {
    const res = await api.get('/pagos/ingresos/hoy');
    return res.data.data;
  },

  obtenerIngresosSemana: async () => {
    const res = await api.get('/pagos/ingresos/semana');
    return res.data.data;
  },

  obtenerIngresosMes: async () => {
    const res = await api.get('/pagos/ingresos/mes');
    return res.data.data;
  },

  obtenerIngresosPorMetodoPago: async () => {
    const res = await api.get('/pagos/ingresos/metodo-pago');
    return res.data.data;
  },

  // ========== CANCELACIONES ==========
  cancelarFactura: async (invoiceId) => {
    const res = await api.delete(`/pagos/facturas/${invoiceId}`);
    return res.data;
  },

  eliminarPago: async (paymentId) => {
    const res = await api.delete(`/pagos/pagos/${paymentId}`);
    return res.data;
  }
};