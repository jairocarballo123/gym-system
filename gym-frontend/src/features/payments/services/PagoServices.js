
import api from '../../../Api/AxiosConfig';

export const pagoApi = {
  
  listarFacturas: async (filtros = {}) => {
    const params = new URLSearchParams(filtros).toString();
    const res = await api.get(`/pagos${params ? `?${params}` : ''}`);
    return res.data.data;
  },


  obtenerDetalle: async (invoiceId) => {
    const res = await api.get(`/pagos/${invoiceId}`);
    return res.data.data;
  },


  obtenerFacturasPendientes: async () => {
    const res = await api.get('/pagos/facturas-pendientes');
    return res.data.data;
  },


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

  cancelarFactura: async (invoiceId) => {
    const res = await api.delete(`/pagos/facturas/${invoiceId}`);
    return res.data;
  },

  eliminarPago: async (paymentId) => {
    const res = await api.delete(`/pagos/pagos/${paymentId}`);
    return res.data;
  }
};