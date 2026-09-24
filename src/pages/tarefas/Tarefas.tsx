import {
    useEffect,
    useState,
    useContext,
    type ChangeEvent,
    type FormEvent,
} from "react";

import { useNavigate, useLocation, useParams } from "react-router-dom";

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
                (dados: any) => {
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
            buscar(`/tasks/${id}`, (dados: Tarefa) => {
                setTarefa({
                    titulo: dados.titulo ?? "",
                    descricao: dados.descricao ?? "",
                    id: dados.id,
                });
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

                alert("Tarefa atualizada com sucesso!");

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

                alert("Tarefa criada com sucesso!");

                navigate("/gerenciarTarefas");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);

            alert(
                "Erro ao processar. Verifique se o servidor está rodando e tente novamente."
            );
        } finally {
            setIsLoading(false);
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

                alert("Tarefa removida com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir tarefa:", error);

                alert("Erro ao excluir tarefa. Verifique sua conexão.");
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
                                            className="border-2 border-slate-700 p-4 rounded bg-white shadow-sm flex flex-col gap-2"
                                        >

                                            <h3 className="text-indigo-900 text-xl">
                                                {t.titulo}
                                            </h3>

                                            <p className="font-normal text-slate-600 text-sm mb-3">
                                                {t.descricao}
                                            </p>

                                            <div className="flex gap-2">

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