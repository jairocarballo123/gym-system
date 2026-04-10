// features/auth/services/authApi.js
import api from "../../../Api/AxiosConfig";

export const authApi = {
  login: async ({ nombre, password }) => {
    try {
      const response = await api.post("/auth/login", { nombre, password });
      return response.data; // { message, token, user }
    } catch (error) {
      console.error("[authApi.login] Error:", error);
      throw new Error(
        error.response?.data?.message || "Error al conectar con el servidor"
      );
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};