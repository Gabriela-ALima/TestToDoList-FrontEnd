import { createContext } from "react";
import type LoginUsuario from "../models/LoginUsuario";

export interface AuthContextProps {
  usuario: LoginUsuario;
  handleLogout(): void;
  handleLogin(usuario: LoginUsuario): Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext({} as AuthContextProps);