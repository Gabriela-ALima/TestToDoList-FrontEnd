import { useLocation, Link } from "react-router-dom";

function Navbar() {
    const location = useLocation();

    
    const isAuthPage = location.pathname === '/login' || location.pathname === '/cadastro';

    
    if (!isAuthPage) {
        return null;
    }

    return (
        <div className="w-full flex justify-center py-4 bg-indigo-900 text-white">
            <div className="container flex justify-between text-lg mx-8">
               
                <Link to='/home' className="text-2xl font-bold uppercase">App To Do List</Link>

                <div className="flex gap-4">
                   
                    <Link to='/home' className="hover:underline">
                        Voltar para Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;