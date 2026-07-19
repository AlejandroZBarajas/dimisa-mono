import { createContext, useState, useContext, useEffect } from "react";
import type { AuthUser, LoginResponse } from "./auth_entity";

interface AuthContextType {
  auth: LoginResponse;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
 
const AUTH_STORAGE_KEY = "auth_data";

function saveAuthToStorage(auth: LoginResponse) {
  try {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
  }
}

function loadAuthFromStorage(): LoginResponse {
  try {
    const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error al cargar desde localStorage:", error);
  }
  return { access_token: null, user: null };
}

function clearAuthFromStorage() {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Error al limpiar localStorage:", error);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<LoginResponse>(() => loadAuthFromStorage());

  useEffect(() => {
    if (auth.access_token && auth.user) {
      saveAuthToStorage(auth);
    } else {
      clearAuthFromStorage();
    }
  }, [auth]);

  const login = (token: string, user: AuthUser) => {
    setAuth({ access_token: token, user });
  };

  const logout = () => {
    setAuth({ access_token: null, user: null });
    clearAuthFromStorage();
  };

  const isAuthenticated = !!(auth.access_token && auth.user);

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}