// src/api/auth.api.js
import api from "./AxiosConfig";

export const authApi = {
  login: async (id, password) => {
    try {
      const res = await api.post("/auth/login", { id, password });
      return res.data; // { message, token, user }
    } catch (error) {
      console.error("[authApi.login] Error:", error);
      throw new Error(
        error.response?.data?.message || "Error al intentar iniciar sesión"
      );
    }
  },
};
