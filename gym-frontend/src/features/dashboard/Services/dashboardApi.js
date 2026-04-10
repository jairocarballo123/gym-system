import api from '../../../api/AxiosConfig';

export const dashboardApi = {
  getResumen: async () => {
    try {
      const response = await api.get('/dashboard/resumen');
      return response.data;
    } catch (err) {
      console.error("Error al obtener resumen:", err);
      throw err;
    }
  },

getUltimasActividades: async (limite = 10) => {
  try {
    const response = await api.get(`/dashboard/ultimas-actividades?limite=${limite}`);
    return response.data;
  } catch (err) {
    console.error("Error al obtener últimas actividades:", err);
    throw err; 
  }
},


};

   
  


