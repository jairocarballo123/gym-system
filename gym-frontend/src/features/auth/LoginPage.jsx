// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../Api/authApi";
import { useAuth } from "../../Hooks/useauth";
import "./LoginPage.css";   

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await authApi.login(id, password);
      login(data); // guarda en contexto
      navigate("/"); // redirige al dashboard
    } catch (err) {
      console.error("[LoginPage] Error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow">
        <h1 className="gym-title">🏋️ Gym System</h1>
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">ID Empleado</label>
            <input
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};



export default LoginPage;
