import { useEffect, useState, useContext, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cadastrarUsuario, atualizar, deletar } from "../../services/Service";
import { AuthContext } from "../../contexts/AuthContext";
import { ClipLoader } from "react-spinners";

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

  useEffect(() => {
    if (isEdicao) {
      const storage = JSON.parse(localStorage.getItem('usuarioToken') || '{}');
      const idParaUso = usuarioLogado.id !== 0 ? usuarioLogado.id : storage.id;

      if (idParaUso) {
        setUsuario({
          id: idParaUso,
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

  async function processarFormulario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const storage = JSON.parse(localStorage.getItem('usuarioToken') || '{}');
    const tokenRaw = usuarioLogado.token || storage.token;
    const tokenFormatado = tokenRaw?.startsWith('Bearer ') ? tokenRaw : `Bearer ${tokenRaw}`;

    try {
      if (isEdicao) {
        const idParaEnvio = usuario.id || storage.id;

const dadosAtualizacao = {
    name: usuario.name,
    username: usuario.username,
    email: usuario.email,
};

await atualizar(
    `/usuarios/${idParaEnvio}`,
    dadosAtualizacao,
    setUsuario,
    {
        headers: { Authorization: tokenFormatado },
    }
);
        alert("Perfil atualizado com sucesso!");
        navigate("/home");
      } else {
        if (confirmarSenha === usuario.password && (usuario.password?.length ?? 0) >= 8) {
          await cadastrarUsuario(`/usuarios/`, usuario, setUsuario);
          alert("Usuário cadastrado com sucesso!");
          navigate("/tarefas");
        } else {
          alert("As senhas não conferem ou são menores que 8 caracteres.");
        }
      }
    } catch (error: any) {
        const erroBackend = error.response?.data?.error || "";
        if (erroBackend.includes("UniqueViolation")) {
            alert("Erro: Username ou E-mail já em uso.");
        } else {
            alert("Erro na operação. Verifique o servidor no Render.");
        }
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async () => {
    const storage = JSON.parse(localStorage.getItem('usuarioToken') || '{}');
    const idParaDeletar = usuario.id || storage.id;
    const tokenRaw = usuarioLogado.token || storage.token;
    const tokenFormatado = tokenRaw?.startsWith('Bearer ') ? tokenRaw : `Bearer ${tokenRaw}`;

    if (window.confirm("ATENÇÃO: Deseja realmente excluir sua conta?")) {
      try {
        setIsLoading(true);
        await deletar(`/usuarios/${idParaDeletar}`, {
          headers: { Authorization: tokenFormatado },
        });
        alert("Sua conta foi removida.");
        handleLogout();
        navigate("/login");
      } catch (error) {
        alert("Erro ao excluir conta. Verifique se há tarefas pendentes.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
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
            <input type="text" name="name" value={usuario.name} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2 focus:border-indigo-900 outline-none" required />
          </div>

          <div className="flex flex-col w-full">
            <label>Username</label>
            <input type="text" name="username" value={usuario.username} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2 focus:border-indigo-900 outline-none" required />
          </div>

          <div className="flex flex-col w-full">
            <label>E-mail</label>
            <input type="email" name="email" value={usuario.email} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2 focus:border-indigo-900 outline-none" required />
          </div>

          {!isEdicao && (
            <>
              <div className="flex flex-col w-full">
                <label>Senha</label>
                <input type="password" name="password" value={usuario.password} onChange={atualizarEstado} className="border-2 border-slate-700 rounded p-2 focus:border-indigo-900 outline-none" required />
              </div>
              <div className="flex flex-col w-full">
                <label>Confirmar Senha</label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className="border-2 border-slate-700 rounded p-2 focus:border-indigo-900 outline-none" required />
              </div>
            </>
          )}

          <div className="flex flex-row gap-2 w-full mt-4">
            <button type="submit" disabled={isLoading} className="flex-1 rounded text-white bg-indigo-900 hover:bg-indigo-950 py-2 flex justify-center items-center disabled:bg-indigo-300 transition shadow-md">
              {isLoading ? <ClipLoader color="#ffffff" size={24} /> : <span>{isEdicao ? "Salvar" : "Cadastrar"}</span>}
            </button>

            <button
                type="button"
                onClick={() => navigate(isEdicao ? "/cadastro" : "/editarPerfil")}
                className="flex-1 rounded text-white bg-teal-600 hover:bg-teal-700 py-2 font-bold transition shadow-md"
            >
                {isEdicao ? "Novo Cadastro" : "Ir para Perfil"}
            </button>
          </div>

          {isEdicao && (
            <div className="flex flex-col w-full gap-2">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="rounded text-white bg-slate-500 hover:bg-slate-600 w-full py-2 font-bold transition shadow-md"
              >
                Voltar para Home
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="rounded text-white bg-red-600 hover:bg-red-800 w-full py-2 font-bold mt-2 disabled:bg-red-300 transition shadow-md"
              >
                Excluir Minha Conta
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default Cadastro;