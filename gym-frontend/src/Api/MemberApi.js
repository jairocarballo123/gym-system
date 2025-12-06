import api from "./AxiosConfig";

export const membersApi = {
  getAll: async () => {
    try {
      const res = await api.get("/members");
      return res.data;
    } catch (err) {
      console.error("Error en getAll:", err.response?.data || err.message);
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/members/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en getById:", err.response?.data || err.message);
      throw err;
    }
  },

  create: async (member) => {
    try {
      const res = await api.post("/members", member);
      return res.data;
    } catch (err) {
      console.error("Error en create:", err.response?.data || err.message);
      throw err;
    }
  },

  update: async (id, member) => {
    try {
      const res = await api.put(`/members/${id}`, member);
      return res.data;
    } catch (err) {
      console.error("Error en update:", err.response?.data || err.message);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const res = await api.delete(`/members/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en delete:", err.response?.data || err.message);
      throw err;
    }
  },
};
