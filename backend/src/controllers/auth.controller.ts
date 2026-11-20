import type { Request, Response } from "express";
import { ENV } from "@/config/env";
import { generateCsrfToken } from "@/middlewares/csrf";
import { loginSchema } from "@/schema/auth.schema";
import * as authService from "@/services/auth.service";
import { validate } from "@/utils/validate";

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: ENV.NODE_ENV === "production",
};
const accessOptions = { ...base, path: "/", maxAge: authService.ACCESS_TTL_MS };
const refreshOptions = { ...base, path: "/api/auth", maxAge: authService.REFRESH_TTL_MS };

function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
  res.cookie("access-token", tokens.accessToken, accessOptions);
  res.cookie("refresh-token", tokens.refreshToken, refreshOptions);
}

function clearAuthCookies(res: Response) {
  res.clearCookie("access-token", { ...base, path: "/" });
  res.clearCookie("refresh-token", { ...base, path: "/api/auth" });
}

export async function csrfToken(req: Request, res: Response) {
  const token = generateCsrfToken(req, res, { overwrite: true });
  res.json({ csrfToken: token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = validate(loginSchema, req.body);
  const { user, accessToken, refreshToken } = await authService.login(email, password);
  setAuthCookies(res, { accessToken, refreshToken });
  res.json({ user });
}

export async function refresh(req: Request, res: Response) {
  try {
    const tokens = await authService.refresh(req.cookies?.["refresh-token"]);
    setAuthCookies(res, tokens);
    res.json({ ok: true });
  } catch (err) {
    clearAuthCookies(res);
    throw err;
  }
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.cookies?.["refresh-token"]);
  clearAuthCookies(res);
  res.json({ ok: true });
}

export async function session(req: Request, res: Response) {
  const user = await authService.getSession(req.user!.id);
  res.json({ user });
}