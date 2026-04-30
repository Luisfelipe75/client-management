import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute"; 
import DashboardPage from "./pages/dashboard"; // Reverted to Dashboard
import ClientePage from "./pages/client";
import ClientCreatePage from "./pages/clientDetail"; 
import LoginGuard from "./components/LoginGuard";
import NotFound from "./pages/not-found"; 

const App = () => {
  return (
    <Routes>
       {/* Públicas: solo si NO autenticado */}
      <Route 
        path="/login" 
        element={
          <LoginGuard>
            <LoginPage />
          </LoginGuard>
        } 
      />
      <Route 
        path="/register" 
        element={
          <LoginGuard>
            <RegisterPage />
          </LoginGuard>
        } 
      />
      
      {/* Protegidas: solo si autenticado */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clientes" element={<ClientePage />} />
        <Route path="/cliente/nuevo" element={<ClientCreatePage />} />
        <Route index element={<DashboardPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      
    </Routes>
  );
};
export default App;