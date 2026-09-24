import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home";
import Cadastro from "./pages/cadastro/Cadastro";
import Footer from "./components/footer/Footer";
import Login from "./pages/login/Login";
import { AuthProvider } from "./contexts/AuthProvider";
import Navbar from "./components/navbar/Navbar";
import Tarefas from "./pages/tarefas/Tarefas";
import RotaProtegida from "./components/rotaProtegida/RotaProtegida";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>

                <Navbar />

                <div className="min-h-[80vh]">

                    <Routes>

                        {/* Rotas públicas */}
                        <Route
                            path="/"
                            element={<Login />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/cadastro"
                            element={<Cadastro />}
                        />

                        {/* Home após o login */}
                        <Route
                            path="/home"
                            element={
                                <RotaProtegida>
                                    <Home />
                                </RotaProtegida>
                            }
                        />

                        {/* Gerenciar usuário */}
                        <Route
                            path="/editarPerfil"
                            element={
                                <RotaProtegida>
                                    <Cadastro />
                                </RotaProtegida>
                            }
                        />

                        {/* Cadastrar tarefa */}
                        <Route
                            path="/tarefas"
                            element={
                                <RotaProtegida>
                                    <Tarefas />
                                </RotaProtegida>
                            }
                        />

                        {/* Gerenciar tarefas */}
                        <Route
                            path="/gerenciarTarefas"
                            element={
                                <RotaProtegida>
                                    <Tarefas />
                                </RotaProtegida>
                            }
                        />

                        {/* Editar tarefa */}
                        <Route
                            path="/editarTarefa/:id"
                            element={
                                <RotaProtegida>
                                    <Tarefas />
                                </RotaProtegida>
                            }
                        />

                    </Routes>

                </div>

                <Footer />

            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;