// features/auth/hooks/useAuth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../Services/authApi";
import { useAuth as useAuthContext } from "../../../context/AuthContext"; 

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuthContext(); // ← Cambio 2: Usa el alias

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authApi.login(credentials);
      contextLogin(data);
      navigate("/dashboard");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    navigate("/login");
  };

  return {
    login,
    logout,
    loading,
    error
  };
};