import api from "../../../Api/AxiosConfig";

export const miembroServices = {
  getAll: async () => {
    try {
      const res = await api.get("/miembros");
      return res.data;
    } catch (err) {
      console.error("Error en getAll:", err.response?.data || err.message);
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/miembros/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en getById:", err.response?.data || err.message);
      throw err;
    }
  },

  create: async (member) => {
    try {
      const res = await api.post("/miembros", member);
      return res.data;
    } catch (err) {
      console.error("Error en create:", err.response?.data || err.message);
      throw err;
    }
  },

  update: async (id, member) => {
    try {
      const res = await api.put(`/miembros/${id}`, member);
      return res.data;
    } catch (err) {
      console.error("Error en update:", err.response?.data || err.message);
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const res = await api.delete(`/miembros/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en delete:", err.response?.data || err.message);
      throw err;
    }
  },

  getResumen: async () => {
    try {
      const res = await api.get("/miembros/resumen");
      return res.data;
    } catch (err) {
      console.error("Error en getResumen:", err.response?.data || err.message);
      throw err;
    }
  },

  getDetalleCompleto: async (id) => {
    try {
      const res = await api.get(`/miembros/${id}/detalle`);
      return res.data;
    } catch (err) {
      console.error("Error en getDetalleCompleto:", err.response?.data || err.message);
      throw err;
    }
  }
};

// Exportamos el objeto correcto
export default miembroServices;