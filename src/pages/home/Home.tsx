import { Link } from "react-router-dom";

function Home() {
    return (
        <main className="bg-indigo-900 flex justify-center min-h-[80vh]">
            <section className="container grid grid-cols-1 lg:grid-cols-2 text-white">

                <article className="flex flex-col gap-6 items-center justify-center py-8">

                    <h1 className="text-5xl font-bold text-center">
                        Gerencie suas Tarefas!
                    </h1>

                    <p className="text-xl text-center">
                        Organize seu dia a dia com facilidade
                    </p>

                    <div className="flex flex-col gap-4 w-64">

                        <Link to="/editarPerfil">
                            <button className="rounded bg-indigo-400 hover:bg-indigo-700 text-white w-full py-3">
                                Gerenciar Usuário
                            </button>
                        </Link>

                        <Link to="/tarefas">
                            <button className="rounded bg-indigo-400 hover:bg-indigo-700 text-white w-full py-3">
                                Cadastrar Tarefa
                            </button>
                        </Link>

                        <Link to="/gerenciarTarefas">
                            <button className="rounded bg-indigo-400 hover:bg-indigo-700 text-white w-full py-3">
                                Gerenciar Tarefas
                            </button>
                        </Link>

                    </div>

                </article>

                <figure className="hidden lg:flex justify-center items-center">
                    <img
                        src="https://i.imgur.com/fyfri1v.png"
                        alt="Imagem Página Home"
                        className="w-2/3"
                    />
                </figure>

            </section>
        </main>
    );
}

export default Home;