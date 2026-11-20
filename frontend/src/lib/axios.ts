import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const AUTH_EXPIRED_EVENT = "auth:expired";


export const http = axios.create({ baseURL, withCredentials: true });

const bare = axios.create({ baseURL, withCredentials: true });


let csrfToken: string | null = null;
let csrfRequest: Promise<string> | null = null;

export function clearCsrfToken() {
  csrfToken = null;
  csrfRequest = null;
}

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = bare
      .get("/auth/v1/csrf-token")
      .then((response) => {
        csrfToken = response.data.csrfToken as string;
        return csrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }
  return csrfRequest;
}

const UNSAFE_METHODS = ["post", "put", "patch", "delete"];

http.interceptors.request.use(async function attachCsrf(config) {
  if (UNSAFE_METHODS.includes((config.method || "get").toLowerCase())) {
    config.headers["x-csrf-token"] = await getCsrfToken();
  }
  return config;
});


let refreshRequest: Promise<void> | null = null;

export function refreshSession(): Promise<void> {
  if (!refreshRequest) {
    clearCsrfToken();
    refreshRequest = (async () => {
      const token = await getCsrfToken();
      await bare.post("/auth/v1/refresh", null, { headers: { "x-csrf-token": token } });
      clearCsrfToken();
    })().finally(() => {
      refreshRequest = null;
    });
  }
  return refreshRequest;
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

http.interceptors.response.use(
  (response) => response,
  async function handleError(error: AxiosError) {
    const original = error.config as RetryConfig | undefined;
    const isAuthCall = original?.url?.startsWith("/auth/v1/");

    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      try {
        await refreshSession();
        return http(original);
      } catch {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
    }
    return Promise.reject(error);
  }
);


export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error || "Something went wrong";
  }
  return "Something went wrong";
}
