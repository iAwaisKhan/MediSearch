import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("ms_user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("ms_token");
    if (!token) { setLoading(false); return; }
    authAPI.getMe()
      .then((res) => setUser(res.data.data.user))
      .catch(() => { localStorage.removeItem("ms_token"); localStorage.removeItem("ms_user"); })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (token, userData) => {
    localStorage.setItem("ms_token", token);
    localStorage.setItem("ms_user",  JSON.stringify(userData));
    setUser(userData);
  };

  const register = useCallback(async (formData) => {
    const res = await authAPI.register(formData);
    saveSession(res.data.token, res.data.data.user);
    toast.success(`Welcome, ${res.data.data.user.name}! 🎉`);
    return res.data;
  }, []);

  const login = useCallback(async (formData) => {
    const res = await authAPI.login(formData);
    saveSession(res.data.token, res.data.data.user);
    toast.success(`Welcome back, ${res.data.data.user.name}!`);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout().catch(() => {});
    localStorage.removeItem("ms_token");
    localStorage.removeItem("ms_user");
    setUser(null);
    toast.success("Logged out successfully.");
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem("ms_user", JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
