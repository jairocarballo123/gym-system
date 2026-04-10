// src/features/productos/services/productoApi.js
import axios from '../../../api/AxiosConfig';

export const productoApi = {
  // CRUD
  getAll: async () => {
    try {
      const res = await axios.get('/productos');
      return res.data.data;
    } catch (err) {
      console.error("Error en getAll productos:", err.response?.data || err.message);
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const res = await axios.get(`/productos/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error en getById producto:", err.response?.data || err.message);
      throw err;
    }
  },

  create: async (data) => {
    try {
      const res = await axios.post('/productos', data);
      return res.data;
    } catch (err) {
      console.error("Error en create producto:", err.response?.data || err.message);
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      const res = await axios.put(`/productos/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("Error en update producto:", err.response?.data || err.message);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const res = await axios.delete(`/productos/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en delete producto:", err.response?.data || err.message);
      throw err;
    }
  },

  // Stock
  getStock: async (id) => {
    try {
      const res = await axios.get(`/productos/${id}/stock`);
      return res.data.data;
    } catch (err) {
      console.error("Error en getStock producto:", err.response?.data || err.message);
      throw err;
    }
  },

  ajustarStock: async (id, cantidad, motivo) => {
    try {
      const res = await axios.patch(`/productos/${id}/stock`, { cantidad, motivo });
      return res.data;
    } catch (err) {
      console.error("Error en ajustarStock producto:", err.response?.data || err.message);
      throw err;
    }
  },

  // Estadísticas
  getResumen: async () => {
    try {
      const res = await axios.get('/productos/resumen');
      return res.data.data;
    } catch (err) {
      console.error("Error en getResumen productos:", err.response?.data || err.message);
      throw err;
    }
  },

  getStockBajo: async () => {
    try {
      const res = await axios.get('/productos/stock-bajo');
      return res.data.data;
    } catch (err) {
      console.error("Error en getStockBajo productos:", err.response?.data || err.message);
      throw err;
    }
  },

  getMasVendidos: async () => {
    try {
      const res = await axios.get('/productos/mas-vendidos');
      return res.data.data;
    } catch (err) {
      console.error("Error en getMasVendidos productos:", err.response?.data || err.message);
      throw err;
    }
  },

  getMovimientos: async (id) => {
    try {
      const res = await axios.get(`/productos/${id}/movimientos`);
      return res.data.data;
    } catch (err) {
      console.error("Error en getMovimientos producto:", err.response?.data || err.message);
      throw err;
    }
  }
};