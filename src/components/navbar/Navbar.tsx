import { useLocation, Link } from "react-router-dom";

function Navbar() {
    const location = useLocation();

    // Define se estamos na página de Login ou Cadastro
    const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

    // Se NÃO estivermos no Login ou Cadastro, a Navbar não aparece (fica invisível na Home)
    if (!isAuthPage) {
        return null;
    }

    return (
        <div className="w-full flex justify-center py-4 bg-indigo-900 text-white">
            <div className="container flex justify-between text-lg mx-8">
                {/* Logo que também volta para a Home */}
                <Link to='/home' className="text-2xl font-bold uppercase">App To Do List</Link>

                <div className="flex gap-4">
                    {/* Botão simples para voltar para a Home sem alertas */}
                    <Link to='/home' className="hover:underline">
                        Voltar para Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;