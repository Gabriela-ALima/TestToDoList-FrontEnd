import { useState, type ReactNode } from "react";
import { toast } from "react-toastify";
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
      await login(`/usuarios/logar/`, loginUsuario, (resposta: LoginUsuario) => {
        setUsuario(resposta);

        const dadosSeguros = {
          id: resposta.id,
          name: resposta.name,
          username: resposta.username,
          email: resposta.email,
          token: resposta.token,
        };
        localStorage.setItem('usuarioToken', JSON.stringify(dadosSeguros));
      });

      toast.success("Login feito com sucesso!");
    } catch (error: unknown) {
      console.error("Erro no login:", error);

      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as {
          response: {
            status: number;
            data?: { message?: string };
          };
        };
        const mensagemBackend = err.response.data?.message;

        if (err.response.status === 404) {
          toast.error(mensagemBackend || "Usuário não encontrado.");
        } else if (err.response.status === 401) {
          toast.error(mensagemBackend || "Senha incorreta.");
        } else if (err.response.status === 400) {
          toast.error(mensagemBackend || "Preencha usuário e senha.");
        } else {
          toast.error(mensagemBackend || "Erro ao fazer login. Tente novamente.");
        }
      } else {
        toast.error("Erro de conexão. Verifique se o backend está online.");
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
