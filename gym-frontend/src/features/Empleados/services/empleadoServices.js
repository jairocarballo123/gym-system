// src/features/Empleados/services/empleadoServices.js
import api from '../../../Api/AxiosConfig';

export const empleadoServices = {
  getAll: async () => {
    try {
      const response = await api.get('/empleados');
      return response;
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  },

   listarEntrenadores: async () => {
    try {
      const response = await api.get('/empleados/entrenadores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener entrenadores:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/empleados/id/${id}`);
      return response;
    } catch (error) {
      console.error(`Error al obtener empleado con id ${id}:`, error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/empleados', data);
      return response.data.data;
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  },

 update: async (id, data) => {
  try {
    const response = await api.put(`/empleados/id/${id}`, data);
    return response.data.data; 
  } catch (error) {
    console.error(`Error al actualizar empleado con id ${id}:`, error);
    throw error;
  }
},

  delete: async (id) => {
    try {
      const response = await api.delete(`/empleados/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar empleado con id ${id}:`, error);
      throw error;
    }
  },
};