import axios from './AxiosConfig';
export const planApi = {

  getAll: async () => {
    try {
      const res = await axios.get('/planes');
      return res.data.data;
    } catch (err) {
      console.error("Error en getAll planes:", err.response?.data || err.message);
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
      const res = await axios.delete(`/planes/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en delete plan:", err.response?.data || err.message);
      throw err;
    }
  }
};
