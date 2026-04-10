// src/features/Recepcion/Services/RecepcionServices.js
import api from '../../../Api/AxiosConfig';

export const recepcionServices = {
  // Buscar miembros por nombre o teléfono
  buscarMiembros: async (termino) => {
    const { data } = await api.get('/miembros', { params: { search: termino } });
    return data; // { success: true, data: [...] }
  },

  // Obtener todos los planes activos
  obtenerPlanes: async () => {
    const { data } = await api.get('/planes');
    return data; // { success: true, data: [...] }
  },

  // Obtener todos los productos activos con stock
  obtenerProductos: async () => {
    const { data } = await api.get('/productos');
    return data; // { success: true, data: [...] }
  },

  // Registrar una venta (recibe el JSON completo)
  registrarVenta: async (ventaData) => {
    const { data } = await api.post('/pagos', ventaData);
    return data; // { success: true, data: { invoiceId, invoiceNumber, message } }
  },
};