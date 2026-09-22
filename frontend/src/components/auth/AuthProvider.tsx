"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  type CurrentUser,
} from "@/lib/auth";

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  authenticated: boolean;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<CurrentUser | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    useCallback(async () => {
      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      } catch {
        setUser(null);
      }
    }, []);

  const clearUser =
    useCallback(() => {
      setUser(null);
    }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const currentUser =
          await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated:
          Boolean(user),
        refreshUser,
        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}