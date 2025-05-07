import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as authApi from "../api/auth.api.js";
import { setAccessToken, setUnauthorizedHandler } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [pendingUserId, setPendingUserId] = useState(null);

  const handleSession = useCallback((data) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAccessToken(null);
      setUser(null);
    });

    authApi
      .refreshSession()
      .then(handleSession)
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setInitializing(false));
  }, [handleSession]);

  const login = async (payload) => {
    const data = await authApi.login(payload);
    setPendingUserId(data.userId);
    return data;
  };

  const verifyTwoFactor = async (code) => {
    const data = await authApi.verifyTwoFactor({ userId: pendingUserId, code });
    handleSession(data);
    setPendingUserId(null);
    return data.user;
  };

  const signup = (payload) => authApi.signup(payload);

  const logout = async () => {
    await authApi.logout().catch(() => {});
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, initializing, pendingUserId, login, verifyTwoFactor, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
