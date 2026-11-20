import { clearCsrfToken, http, refreshSession } from "@/lib/axios";
import type { User } from "@/types";

export async function loginService(email: string, password: string): Promise<User> {
  const response = await http.post("/auth/v1/login", { email, password });
  clearCsrfToken(); 
  return response.data.user;
}

export async function logoutService(): Promise<void> {
  try {
    await http.post("/auth/v1/logout");
  } finally {
    clearCsrfToken();
  }
}

export async function getSessionService(): Promise<User> {
  const response = await http.get("/auth/v1/session");
  return response.data.user;
}

export async function restoreSessionService(): Promise<User | null> {
  try {
    return await getSessionService();
  } catch {
    try {
      await refreshSession();
      return await getSessionService();
    } catch {
      return null;
    }
  }
}