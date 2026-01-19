import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from "./pages/home/Home";
import Cadastro from "./pages/cadastro/Cadastro";
import Footer from "./components/footer/Footer"; 
import Login from './pages/login/Login';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/navbar/Navbar';
import Tarefas from './pages/tarefas/Tarefas'; 

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <div className='min-h-[80vh]'> 
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />

              
              <Route path="/home" element={<Home />} />

              
              <Route path="/editarPerfil" element={<Cadastro />} />

              
              <Route path="/tarefas" element={<Tarefas />} />
              
              
              <Route path="/gerenciarTarefas" element={<Tarefas />} />
              
              
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