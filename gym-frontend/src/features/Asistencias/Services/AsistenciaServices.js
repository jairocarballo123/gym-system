// src/features/asistencias/services/asistenciaApi.js
import api from '../../../api/AxiosConfig';

export const asistenciaApi = {
  registrar: async (memberId) => {
    try {
      const res = await api.post('/asistencia/registrar', { memberId });
      return res.data;
    } catch (error) {
     
      throw error;
    }
  },

  getHoy: async () => {
    const res = await api.get('/asistencia/hoy');
    return res.data.data;
  },

  getHoraPico: async () => {
    const res = await api.get('/asistencia/hora-pico');
    return res.data.data;
  },

  getPromedioDiario: async () => {
    const res = await api.get('/asistencia/promedio-diario');
    return res.data.data;
  },

  getDiasAfluencia: async () => {
    const res = await api.get('/asistencia/dias-afluencia');
    return res.data.data;
  },

  getMiembrosInactivos: async () => {
    const res = await api.get('/asistencia/miembros-inactivos');
    return res.data.data;
  },

  getTopActivos: async () => {
    const res = await api.get('/asistencia/top-activos');
    return res.data.data;
  },
};