
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (data) => {
    try {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("[AuthContext.login] Error:", error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } catch (error) {
      console.error("[AuthContext.logout] Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
