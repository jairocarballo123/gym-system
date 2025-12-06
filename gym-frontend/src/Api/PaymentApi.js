import api from "./AxiosConfig";

export const paymentApi = {
  // Obtener todos los pagos
  getAll: async () => {
    try {
      const res = await api.get("/pagos");
      return res.data;
    } catch (err) {
      console.error("Error en getAll pagos:", err.response?.data || err.message);
      throw err;
    }
  },

  // Crear un nuevo pago
  create: async (data) => {
    try {
      const res = await api.post("/pagos", data);
      return res.data;
    } catch (err) {
      console.error("Error en create pago:", err.response?.data || err.message);
      throw err;
    }
  },

  // Eliminar un pago por ID
  delete: async (id) => {
    try {
      const res = await api.delete(`/pagos/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error en delete pago:", err.response?.data || err.message);
      throw err;
    }
  }
};
