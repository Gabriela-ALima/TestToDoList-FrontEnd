import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/home/Home";
import Cadastro from "./pages/cadastro/Cadastro";
import Footer from "./components/footer/Footer"; 
import Login from './pages/login/Login';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/navbar/Navbar';
import Tarefas from './pages/tarefas/Tarefas'; // Importando o novo componente

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='min-h-[80vh]'> 
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />

              {/* Rota Privada: Home */}
              <Route path="/home" element={<Home />} />

              {/* Rota de Perfil (Sem ID na URL como combinamos) */}
              <Route path="/editarPerfil" element={<Cadastro />} />

              {/* --- NOVAS ROTAS DE TAREFAS --- */}
              {/* 1. Rota para Criar Tarefa */}
              <Route path="/tarefas" element={<Tarefas />} />
              
              {/* 2. Rota para Gerenciar/Listar */}
              <Route path="/gerenciarTarefas" element={<Tarefas />} />
              
              {/* 3. Rota para Editar uma tarefa específica */}
              <Route path="/editarTarefa/:id" element={<Tarefas />} />
              
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>  
    </>  
  );
}

export default App;