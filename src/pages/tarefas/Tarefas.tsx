import {
    useEffect,
    useState,
    useContext,
    type ChangeEvent,
    type FormEvent,
} from "react";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    buscar,
    atualizar,
    deletar,
    cadastrar,
} from "../../services/Service";

import { AuthContext } from "../../contexts/AuthContext";

import { ClipLoader } from "react-spinners";

interface Tarefa {
    id?: number;
    titulo: string;
    descricao: string;
    status?: boolean;
}

function Tarefas() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();

    const { usuario: usuarioLogado } = useContext(AuthContext);

    const token = usuarioLogado.token;

    const isGerenciar = location.pathname === "/gerenciarTarefas";
    const isEdicao = id !== undefined;

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [listaTarefas, setListaTarefas] = useState<Tarefa[]>([]);

    const [tarefa, setTarefa] = useState<Tarefa>({
        titulo: "",
        descricao: "",
    });

    useEffect(() => {
        if (isGerenciar && token !== "") {
            buscar(
                "/tasks/",
                (dados: Tarefa[] | { tasks?: Tarefa[]; data?: Tarefa[] }) => {
                    console.log("RESPOSTA DAS TAREFAS:", dados);

                    if (Array.isArray(dados)) {
                        setListaTarefas(dados);
                    } else if (Array.isArray(dados.tasks)) {
                        setListaTarefas(dados.tasks);
                    } else if (Array.isArray(dados.data)) {
                        setListaTarefas(dados.data);
                    } else {
                        console.error(
                            "Formato inesperado da lista de tarefas:",
                            dados
                        );

                        setListaTarefas([]);
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }
    }, [isGerenciar, token]);

    useEffect(() => {
        if (isEdicao && token !== "") {
            buscar(
                `/tasks/${id}`,
                (dados: Tarefa) => {
                    setTarefa({
                        titulo: dados.titulo ?? "",
                        descricao: dados.descricao ?? "",
                        id: dados.id,
                        status: dados.status ?? false,
                    });
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }
    }, [id, token, isEdicao]);

    function atualizarEstado(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setTarefa({
            ...tarefa,
            [e.target.name]: e.target.value,
        });
    }

    async function processarFormulario(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsLoading(true);

        try {
            if (isEdicao) {
                await atualizar(
                    `/tasks/${id}`,
                    tarefa,
                    setTarefa,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast.success("Tarefa atualizada com sucesso!");

                navigate("/gerenciarTarefas");
            } else {
                const tarefaComUsuario = {
                    ...tarefa,
                    usuario: {
                        id: usuarioLogado.id,
                    },
                };

                await cadastrar(
                    "/tasks/",
                    tarefaComUsuario,
                    setTarefa,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                toast.success("Tarefa criada com sucesso!");

                navigate("/gerenciarTarefas");
            }
        } catch (error: unknown) {
            console.error("Erro na requisição:", error);

            let mensagemBackend: string | undefined;

            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                mensagemBackend = err.response?.data?.message;
            }

            toast.error(
                mensagemBackend ||
                "Erro ao processar. Verifique se o servidor está rodando e tente novamente."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function alterarStatus(tarefaSelecionada: Tarefa) {
        if (!tarefaSelecionada.id) return;

        try {
            const novoStatus = !tarefaSelecionada.status;

            await atualizar(
                `/tasks/${tarefaSelecionada.id}`,
                {
                    titulo: tarefaSelecionada.titulo,
                    descricao: tarefaSelecionada.descricao,
                    status: novoStatus,
                },
                () => {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setListaTarefas(
                listaTarefas.map((t) =>
                    t.id === tarefaSelecionada.id
                        ? { ...t, status: novoStatus }
                        : t
                )
            );
        } catch (error: unknown) {
            console.error("Erro ao alterar status:", error);

            let mensagemBackend: string | undefined;

            if (error && typeof error === 'object' && 'response' in error) {
                const err = error as { response?: { data?: { message?: string } } };
                mensagemBackend = err.response?.data?.message;
            }

            toast.error(mensagemBackend || "Erro ao alterar o status da tarefa.");
        }
    }

    async function excluirTarefa(idTarefa: number) {
        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                await deletar(`/tasks/${idTarefa}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setListaTarefas(
                    listaTarefas.filter((t) => t.id !== idTarefa)
                );

                toast.success("Tarefa removida com sucesso!");
            } catch (error: unknown) {
                console.error("Erro ao excluir tarefa:", error);

                let mensagemBackend: string | undefined;

                if (error && typeof error === 'object' && 'response' in error) {
                    const err = error as { response?: { data?: { message?: string } } };
                    mensagemBackend = err.response?.data?.message;
                }

                toast.error(mensagemBackend || "Erro ao excluir tarefa. Verifique sua conexão.");
            }
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 h-screen place-items-center font-bold">

                <div
                    className="bg-[url('https://i.imgur.com/ZZFAmzo.jpg')] lg:block hidden bg-no-repeat w-full h-full bg-cover bg-center"
                />

                <div className="flex flex-col justify-center items-center w-full p-8">

                    <h2 className="text-indigo-900 text-5xl mb-6 text-center">
                        {isGerenciar
                            ? "Gerenciar"
                            : isEdicao
                            ? "Editar"
                            : "Nova Tarefa"}
                    </h2>

                    {isGerenciar ? (

                        <div className="w-full max-w-md flex flex-col gap-4">

                            <button
                                onClick={() => navigate("/tarefas")}
                                className="bg-indigo-900 text-white p-2 rounded hover:bg-indigo-950 transition shadow-md"
                            >
                                + Adicionar Nova Tarefa
                            </button>

                            <div className="flex flex-col gap-3 h-[50vh] overflow-y-auto pr-2">

                                {listaTarefas.length === 0 ? (

                                    <p className="text-center text-slate-500 font-normal">
                                        Nenhuma tarefa cadastrada.
                                    </p>

                                ) : (

                                    listaTarefas.map((t) => (

                                        <div
                                            key={t.id}
                                            className={`border-2 p-4 rounded bg-white shadow-sm flex flex-col gap-2 ${
                                                t.status
                                                    ? "border-green-500"
                                                    : "border-slate-700"
                                            }`}
                                        >

                                            <div className="flex items-center justify-between gap-2">

                                                <h3
                                                    className={`text-xl ${
                                                        t.status
                                                            ? "text-slate-400 line-through"
                                                            : "text-indigo-900"
                                                    }`}
                                                >
                                                    {t.titulo}
                                                </h3>

                                                {t.status && (
                                                    <span className="text-green-600 text-sm font-bold">
                                                        Concluída
                                                    </span>
                                                )}

                                            </div>

                                            <p
                                                className={`font-normal text-sm mb-3 ${
                                                    t.status
                                                        ? "text-slate-400 line-through"
                                                        : "text-slate-600"
                                                }`}
                                            >
                                                {t.descricao}
                                            </p>

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() =>
                                                        alterarStatus(t)
                                                    }
                                                    className={`flex-1 text-white rounded py-1 text-sm transition font-bold ${
                                                        t.status
                                                            ? "bg-orange-500 hover:bg-orange-600"
                                                            : "bg-green-600 hover:bg-green-700"
                                                    }`}
                                                >
                                                    {t.status
                                                        ? "Reabrir"
                                                        : "Concluir"}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/editarTarefa/${t.id}`
                                                        )
                                                    }
                                                    className="flex-1 bg-teal-600 text-white rounded py-1 text-sm hover:bg-teal-700 transition font-bold"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        t.id &&
                                                        excluirTarefa(t.id)
                                                    }
                                                    className="flex-1 bg-red-600 text-white rounded py-1 text-sm hover:bg-red-700 transition font-bold"
                                                >
                                                    Excluir
                                                </button>

                                            </div>

                                        </div>

                                    ))

                                )}

                            </div>

                            <button
                                onClick={() => navigate("/home")}
                                className="text-slate-500 hover:underline mt-2"
                            >
                                Voltar para Home
                            </button>

                        </div>

                    ) : (

                        <form
                            onSubmit={processarFormulario}
                            className="flex flex-col w-full max-w-md gap-4"
                        >

                            <div className="flex flex-col w-full">

                                <label>
                                    Título da Tarefa
                                </label>

                                <input
                                    type="text"
                                    name="titulo"
                                    value={tarefa.titulo ?? ""}
                                    onChange={atualizarEstado}
                                    className="border-2 border-slate-700 rounded p-2 focus:border-indigo-900 outline-none"
                                    required
                                />

                            </div>

                            <div className="flex flex-col w-full">

                                <label>
                                    Descrição
                                </label>

                                <textarea
                                    name="descricao"
                                    value={tarefa.descricao ?? ""}
                                    onChange={atualizarEstado}
                                    className="border-2 border-slate-700 rounded p-2 h-32 font-normal focus:border-indigo-900 outline-none"
                                    required
                                />

                            </div>

                            <div className="flex flex-col gap-3 mt-4">

                                <button
                                    type="submit"
                                    className="rounded text-white bg-indigo-900 hover:bg-indigo-950 py-2 flex justify-center items-center shadow-md"
                                >
                                    {isLoading ? (
                                        <ClipLoader
                                            color="#ffffff"
                                            size={24}
                                        />
                                    ) : (
                                        <span>
                                            {isEdicao
                                                ? "Salvar Alterações"
                                                : "Cadastrar Tarefa"}
                                        </span>
                                    )}
                                </button>

                                {!isEdicao && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/gerenciarTarefas")
                                        }
                                        className="rounded text-white bg-teal-600 hover:bg-teal-700 py-2 shadow-md transition"
                                    >
                                        Gerenciar Minhas Tarefas
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            isEdicao
                                                ? "/gerenciarTarefas"
                                                : "/home"
                                        )
                                    }
                                    className="text-slate-500 hover:underline"
                                >
                                    Cancelar
                                </button>

                            </div>

                        </form>

                    )}

                </div>

            </div>
        </>
    );
}

export default Tarefas;
