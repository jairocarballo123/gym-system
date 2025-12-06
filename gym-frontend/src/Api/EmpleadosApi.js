import api from "./AxiosConfig";

export const empleadosApi = {

  getAll: async () => {
    const res = await api.get("/Empleados"); 
    return res.data;
  },

 
  create: async (data) => {
    const res = await api.post("/Empleados", data);
    return res.data;
  },

 
  update: async (id, data) => {
    const res = await api.put(`/Empleados/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/Empleados/${id}`);
    return res.data;
  },

  // GET /id/:id (Buscar por ID específico)
  getById: async (id) => {
    const res = await api.get(`/Empleados/id/${id}`);
    return res.data;
  },


  getByRol: async (rol) => {
    const res = await api.get(`/Empleados/rol/${rol}`);
    return res.data;
  }
};