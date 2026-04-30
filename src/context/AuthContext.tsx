import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import api from "../services/api";
import type { LoginRequest, RegisterRequest, User } from "../types/auth.types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = () => {
      const savedUser = authService.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      console.log("Login response:", response);

      const { data } = response;
      const { token, userid, username } = data;
      if (!token) {
        throw new Error("No se recibió token");
      }

      localStorage.setItem("token", token);
      const user: User = { userid: userid, username };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Sesión iniciada correctamente");
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error al iniciar sesión";
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);

      // Verificamos si el backend devolvió un token en la propiedad data
      if (response?.data?.token) {
        const { token } = response.data; // Ajusta según la estructura real de tu respuesta
        localStorage.setItem("token", token);

        const user: User = {
          userid: response.data.userid,
          username: response.data.username,
        };

        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        toast.success("Registro exitoso");
      } else {
        toast.success("Registro exitoso. Por favor inicia sesión.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al registrarse");
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Notificamos al backend mientras el token aún está en localStorage
      // El interceptor de api.ts adjuntará el Bearer token automáticamente
      await api.post("/auth/logout");
    } catch (error) {
      console.error("No se pudo cerrar sesión en el servidor:", error);
    } finally {
      // Limpiamos el estado local siempre, incluso si falla la red
      setUser(null);
      authService.logout();
      toast.info("Sesión cerrada");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("No existe contexto");
  }
  return context;
};
