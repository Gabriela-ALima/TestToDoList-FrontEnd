import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/home/Home";
import Cadastro from "./pages/cadastro/Cadastro";
import Footer from "./components/footer/Footer";
import Login from './pages/login/Login';
import { AuthProvider } from './contexts/AuthProvider';
import Navbar from './components/navbar/Navbar';
import Tarefas from './pages/tarefas/Tarefas';
import RotaProtegida from './components/rotaProtegida/RotaProtegida';

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

              <Route path="/home" element={<RotaProtegida><Home /></RotaProtegida>} />

              <Route path="/editarPerfil" element={<RotaProtegida><Cadastro /></RotaProtegida>} />

              <Route path="/tarefas" element={<RotaProtegida><Tarefas /></RotaProtegida>} />

              <Route path="/gerenciarTarefas" element={<RotaProtegida><Tarefas /></RotaProtegida>} />

              <Route path="/editarTarefa/:id" element={<RotaProtegida><Tarefas /></RotaProtegida>} />

            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
