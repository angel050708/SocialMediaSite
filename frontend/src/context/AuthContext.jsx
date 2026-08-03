import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api.js";
import { connectSocket, disconnectSocket } from "../lib/socket.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch((err) => {
        if (!(err instanceof ApiError) || err.status !== 401) {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  const login = useCallback(async (username, password) => {
    const data = await api.post("/api/auth/login", { username, password });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (fields) => {
    const data = await api.post("/api/auth/register", fields);
    setUser(data.user);
    return data.user;
  }, []);

  const guestLogin = useCallback(async () => {
    const data = await api.post("/api/auth/guest");
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await api.get("/api/auth/me");
    setUser(data.user);
    return data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, guestLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
