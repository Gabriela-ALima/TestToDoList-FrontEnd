import { useEffect, useState, useContext, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cadastrarUsuario, atualizar, deletar } from "../../services/Service";
import { AuthContext } from "../../contexts/AuthContext";
import { ClipLoader } from "react-spinners";
import Navbar from "../../components/navbar/Navbar";

interface Usuario {
  id?: number;
  name: string;
  username: string;
  email: string;
  password?: string;
}

function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario: usuarioLogado, handleLogout } = useContext(AuthContext);

  const isEdicao = location.pathname === "/editarPerfil";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [usuario, setUsuario] = useState<Usuario>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // 1. CARREGAMENTO DOS DADOS (Busca ID no storage para evitar erro de undefined)
  useEffect(() => {
    if (isEdicao) {
      const storage = JSON.parse(localStorage.getItem('usuarioToken') || '{}');
      const idEfetivo = usuarioLogado.id !== 0 ? usuarioLogado.id : storage.id;
      
      if (idEfetivo) {
        setUsuario({
          id: idEfetivo,
          name: usuarioLogado.name || storage.name || "",
          username: usuarioLogado.username || storage.username || "",
          email: usuarioLogado.email || storage.email || "",
          password: "", 
        });
      }
    } else {
        setUsuario({ name: "", username: "", email: "", password: "" });
    }
  }, [isEdicao, usuarioLogado]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  }

  // 2. ATUALIZAR OU CADASTRAR USUÁRIO
  async function processarFormulario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    
    const storage = JSON.parse(localStorage.getItem('usuarioToken') || '{}');
    const tokenEfetivo = usuarioLogado.token || storage.token;
    
    // Garante que o ID seja pego antes de enviar a URL
    const idEfetivo = usuario.id || usuarioLogado.id || storage.id;

    try {
      if (isEdicao) {
        if (!idEfetivo || idEfetivo === 0) {
          alert("Erro: ID do usuário não localizado. Faça login novamente.");
          return;
        }

        // Rota PUT sem barra final para bater com o Backend
        await atualizar(`/usuarios/${idEfetivo}`, usuario, setUsuario, {
          headers: { Authorization: tokenEfetivo },
        });
        alert("Perfil atualizado com sucesso!");
        navigate("/home");
      } else {
        // Lógica de Cadastro
        if (confirmarSenha === usuario.password && (usuario.password?.length ?? 0) >= 8) {
          await cadastrarUsuario(`/usuarios/`, usuario, setUsuario);
          alert("Usuário cadastrado com sucesso!");
          navigate("/login");
        } else {
          alert("Senhas não conferem ou são menores que 8 caracteres.");
        }
      }
    } catch (error: any) {
        // Tratamento do erro UniqueViolation que vimos no seu console
        const erroBackend = error.response?.data?.error || "";
        if (erroBackend.includes("UniqueViolation")) {
            alert("Erro: Este Username ou E-mail já está em uso por outra conta.");
        } else {
            alert("Erro na operação. Verifique os dados ou a conexão.");
        }
    } finally {
      setIsLoading(false);
    }
  }

  // 3. FUNÇÃO PARA DELETAR CONTA (Usa o mesmo idEfetivo)
  const handleDelete = async () => {
    const storage = JSON.parse(localStorage.getItem('usuarioToken') || '{}');
    const idParaDeletar = usuario.id || usuarioLogado.id || storage.id;
    const token = usuarioLogado.token || storage.token;

    if (!idParaDeletar || idParaDeletar === 0) {
      alert("Não foi possível encontrar o ID para exclusão.");
      return;
    }

    if (window.confirm("ATENÇÃO: Deseja realmente excluir sua conta permanentemente?")) {
      try {
        setIsLoading(true);
        await deletar(`/usuarios/${idParaDeletar}`, {
          headers: { Authorization: token },
        });
        alert("Sua conta foi removida.");
        handleLogout();
        navigate("/login");
      } catch (error) {
        alert("Erro ao excluir conta. Verifique se existem tarefas pendentes.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isEdicao && <Navbar />}

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${isEdicao ? 'min-h-[80vh]' : 'h-screen'} place-items-center font-bold`}>
        
        {!isEdicao && (
          <div className="bg-[url('https://i.imgur.com/ZZFAmzo.jpg')] lg:block hidden bg-no-repeat w-full min-h-screen bg-cover bg-center"></div>
        )}
        
        <form onSubmit={processarFormulario} className={`flex justify-center items-center flex-col gap-3 p-8 ${isEdicao ? 'w-full max-w-md' : 'w-2/3'}`}>
          <h2 className="text-indigo-900 text-5xl mb-4 text-center">
            {isEdicao ? "Editar Perfil" : "Cadastrar"}
          </h2>

          <div className="flex flex-col w-full">
            <label>Nome Completo</label>
            <input type="text" name="name" value={usuario.name} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2" required />
          </div>

          <div className="flex flex-col w-full">
            <label>Username</label>
            <input type="text" name="username" value={usuario.username} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2" required />
          </div>

          <div className="flex flex-col w-full">
            <label>E-mail</label>
            <input type="email" name="email" value={usuario.email} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2" required />
          </div>

          {!isEdicao && (
            <>
              <div className="flex flex-col w-full">
                <label>Senha</label>
                <input type="password" name="password" value={usuario.password} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2" required />
              </div>
              <div className="flex flex-col w-full">
                <label>Confirmar Senha</label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="border-2 border-slate-700 rounded p-2" required />
              </div>
            </>
          )}

          <div className="flex flex-row gap-2 w-full mt-4">
            <button type="submit" disabled={isLoading} className="flex-1 rounded text-white bg-indigo-900 py-2 flex justify-center items-center disabled:bg-indigo-300">
              {isLoading ? <ClipLoader color="#ffffff" size={24} /> : <span>{isEdicao ? "Salvar" : "Cadastrar"}</span>}
            </button>

            <button 
                type="button" 
                onClick={() => navigate(isEdicao ? "/home" : "/login")}
                className="flex-1 rounded text-white bg-slate-500 hover:bg-slate-600 py-2 font-bold"
            >
                {isEdicao ? "Voltar" : "Entrar"}
            </button>
          </div>

          {isEdicao && (
            <button 
              type="button" 
              onClick={handleDelete}
              disabled={isLoading}
              className="rounded text-white bg-red-600 hover:bg-red-800 w-full py-2 font-bold mt-2 disabled:bg-red-300"
            >
              Excluir Minha Conta
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default Cadastro;