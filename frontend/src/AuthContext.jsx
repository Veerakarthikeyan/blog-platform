import { createContext, useContext, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const saveSession = (data) => {
    const u = { id: data.id, username: data.username, email: data.email };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    saveSession(data);
  };

  const register = async (username, email, password) => {
    const { data } = await api.post("/auth/register", { username, email, password });
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
