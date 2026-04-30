import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LoginGuardProps {
  children: React.ReactNode;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Cargando...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

export default LoginGuard;