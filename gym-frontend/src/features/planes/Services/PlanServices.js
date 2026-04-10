// src/features/planes/services/planApi.js
import axios from '../../../Api/AxiosConfig';

export const planApi = {
  // CRUD
  getAll: async () => {
    try {
      const res = await axios.get('/planes');
      return res.data.data;
    } catch (err) {
      console.error("Error en getAll planes:", err.response?.data || err.message);
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const res = await axios.get(`/planes/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Error en getById plan:", err.response?.data || err.message);
      throw err;
    }
  },

  create: async (data) => {
    try {
      const res = await axios.post('/planes', data);
      return res.data;
    } catch (err) {
      console.error("Error en create plan:", err.response?.data || err.message);
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      const res = await axios.put(`/planes/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("Error en update plan:", err.response?.data || err.message);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const res = await axios.patch(`/planes/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en delete plan:", err.response?.data || err.message);
      throw err;
    }
  },

  // Estadísticas
  getResumen: async () => {
    try {
      const res = await axios.get('/planes/resumen');
      return res.data.data;
    } catch (err) {
      console.error("Error en getResumen planes:", err.response?.data || err.message);
      throw err;
    }
  },

  getMasVendido: async () => {
    try {
      const res = await axios.get('/planes/mas-vendido');
      return res.data.data;
    } catch (err) {
      console.error("Error en getMasVendido planes:", err.response?.data || err.message);
      throw err;
    }
  },

  getIngresosPorPlan: async () => {
    try {
      const res = await axios.get('/planes/ingresos');
      return res.data.data;
    } catch (err) {
      console.error("Error en getIngresosPorPlan:", err.response?.data || err.message);
      throw err;
    }
  },

  getMiembrosPorPlan: async () => {
    try {
      const res = await axios.get('/planes/miembros-por-plan');
      return res.data.data;
    } catch (err) {
      console.error("Error en getMiembrosPorPlan:", err.response?.data || err.message);
      throw err;
    }
  },

  getProximosVencer: async () => {
    try {
      const res = await axios.get('/planes/proximos-vencer');
      return res.data.data;
    } catch (err) {
      console.error("Error en getProximosVencer:", err.response?.data || err.message);
      throw err;
    }
  },
};