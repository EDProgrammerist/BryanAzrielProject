import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "@/components/context/auth-state";
import { AUTH_EXPIRED_EVENT } from "@/lib/axios";
import { loginService, logoutService, restoreSessionService } from "@/services/auth-service";
import type { User } from "@/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(function restoreSession() {
    let active = true;
    async function loadSession() {
      const restored = await restoreSessionService();
      if (active) {
        setUser(restored);
        setReady(true);
      }
    }
    loadSession();
    return function cleanup() { active = false; };
  }, []);

  useEffect(function listenForExpiry() {
    function handleExpired() {
      setUser(null);
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return function cleanup() {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    };
  }, []);

  async function login(email: string, password: string) {
    const loggedIn = await loginService(email, password);
    setUser(loggedIn);
    return loggedIn;
  }

  async function logout() {
    try {
      await logoutService();
    } finally {
      setUser(null);
    }
  }

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}