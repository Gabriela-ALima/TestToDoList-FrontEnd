import { createContext, useState, useEffect, type ReactNode } from "react";
import type LoginUsuario from "../models/LoginUsuario";
import { login } from "../services/Service";

interface AuthContextProps {
  usuario: LoginUsuario;
  handleLogout(): void;
  handleLogin(usuario: LoginUsuario): Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  
  // AJUSTE: O estado inicial agora busca no localStorage para evitar perda de ID no F5
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

  // Hook para garantir sincronização (opcional)
  useEffect(() => {
    const storage = localStorage.getItem('usuarioToken');
    if (storage) {
        const usuarioDados = JSON.parse(storage);
        if (usuarioDados.id !== usuario.id) {
            setUsuario(usuarioDados);
        }
    }
  }, []);

  async function handleLogin(loginUsuario: LoginUsuario) {
    setIsLoading(true);

    try {
      // Chamada para o Service passando a rota de login
      await login(`/usuarios/logar/`, loginUsuario, (resposta: any) => {
        
        // Verifique no Console (F12) se a 'resposta' do seu backend contém o campo 'id'
        console.log("Login realizado. Dados recebidos:", resposta);
        
        // Atualiza o estado global com os dados (incluindo ID e Token)
        setUsuario(resposta);
        
        // Salva no localStorage para persistência
        localStorage.setItem('usuarioToken', JSON.stringify(resposta));
      });
      
      alert("Login feito com sucesso!");
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      if (error.response) {
        alert(`Erro ${error.response.status}: Dados de acesso inválidos.`);
      } else {
        alert("Erro de conexão. Verifique se o backend está online.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    // Limpa o estado e o armazenamento local
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