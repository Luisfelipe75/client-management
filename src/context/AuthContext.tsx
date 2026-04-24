import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { LoginRequest, RegisterRequest, User } from "../types/auth.types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
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

      const { token, userid, username } = response;
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

      if (response.token) {
        const { token, ...userData } = response;
        localStorage.setItem("token", token);

        const user: User = {
          userid: userData.userId,
          username: userData.username,
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

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info("Sesión cerrada");
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
