// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../features/auth/authContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
