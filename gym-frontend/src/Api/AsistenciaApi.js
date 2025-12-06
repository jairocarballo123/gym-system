import api from "./AxiosConfig";

export const asistenciasApi = {

  getAll: async () => {
    const res = await api.get("/asistencias");
    return res.data;
  },

  registrar: async (data) => {
    const res = await api.post("/asistencias", data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/asistencias/${id}`);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get("/asistencias");
    return res.data;
  },


  getByMiembro: async (miembroId) => {
    const res = await api.get(`/asistencias/members/${miembroId}`);
    return res.data;
  }
};