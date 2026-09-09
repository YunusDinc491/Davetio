import { createContext, useContext, useState, useCallback } from "react";
import { loginRequest, registerRequest } from "../api/auth";

const AuthContext = createContext(null);
const STORAGE_KEY = "davetio_auth";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored);

  const persist = useCallback((value) => {
    setAuth(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* yok say */
    }
  }, []);

  const login = useCallback(
    async (username, password) => {
      const data = await loginRequest(username, password);
      persist({ token: data.token, username: data.username });
    },
    [persist]
  );

  const register = useCallback(
    async (username, password) => {
      const data = await registerRequest(username, password);
      persist({ token: data.token, username: data.username });
    },
    [persist]
  );

  const logout = useCallback(() => persist(null), [persist]);

  return (
    <AuthContext.Provider
      value={{
        user: auth ? { username: auth.username } : null,
        token: auth?.token ?? null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}