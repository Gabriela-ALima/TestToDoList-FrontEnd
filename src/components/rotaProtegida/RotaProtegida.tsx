import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario } = useContext(AuthContext);

  if (usuario.token === "") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default RotaProtegida;