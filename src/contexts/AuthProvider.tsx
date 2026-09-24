import { useState, type ReactNode } from "react";
import type LoginUsuario from "../models/LoginUsuario";
import { login } from "../services/Service";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [usuario, setUsuario] = useState<LoginUsuario>(() => {
    const storage = localStorage.getItem('usuarioToken');
    if (storage) {
      try {
        return JSON.parse(storage);
      } catch {
        localStorage.removeItem('usuarioToken');
      }
    }
    return {
      id: 0,
      name: "",
      username: "",
      email: "",
      password: "",
      token: "",
    };
  });

  const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(loginUsuario: LoginUsuario) {
    setIsLoading(true);

    try {
      await login(`/usuarios/logar/`, loginUsuario, (resposta: any) => {
        setUsuario(resposta);

        const { password, ...dadosSeguros } = resposta;
        localStorage.setItem('usuarioToken', JSON.stringify(dadosSeguros));
      });

      alert("Login feito com sucesso!");
    } catch (error: unknown) {
      console.error("Erro no login:", error);

      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response: { status: number } };
        alert(`Erro ${err.response.status}: Dados de acesso inválidos.`);
      } else {
        alert("Erro de conexão. Verifique se o backend está online.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setUsuario({
      id: 0,
      name: "",
      username: "",
      email: "",
      password: "",
      token: "",
    });
    localStorage.removeItem('usuarioToken');
  }

  return (
    <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}