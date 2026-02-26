import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from './api';
import { logoutUser, unsubscribeUser } from './api';

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => Promise<void>;
  unsubscribe: (password: string) => Promise<void>;
  loggingOut: boolean;
  unsubscribing: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = 'auth:user';
const AUTH_TOKEN_KEY = 'auth:token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });
  const [loggingOut, setLoggingOut] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);

  const setUser = (newUser: User | null, token?: string | null) => {
    setUserState(newUser);
    if (newUser === null) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } else {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      if (token != null) localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [user]);

  const logout = async () => {
    try {
      setLoggingOut(true);
      await logoutUser().catch(() => {});
    } finally {
      setUser(null);
      setLoggingOut(false);
    }
  };

  const unsubscribe = async (password: string) => {
    if (!user) return;
    try {
      setUnsubscribing(true);
      await unsubscribeUser({ email: user.email, password });
      setUser(null);
    } finally {
      setUnsubscribing(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: setUser, logout, unsubscribe, loggingOut, unsubscribing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
