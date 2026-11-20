import type { NextFunction, Request, Response } from "express";
import { doubleCsrf } from "csrf-csrf";
import { ENV } from "@/config/env";
import { HttpError } from "@/utils/httpError";

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => ENV.CSRF_SECRET,
  getSessionIdentifier: (req) => req.cookies?.["access-token"] ?? "",
  cookieName: "csrf-token",
  cookieOptions: {
    sameSite: "lax",
    secure: ENV.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
  },
  getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

export { generateCsrfToken };

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  doubleCsrfProtection(req, res, (err?: unknown) => {
    if (err) return next(new HttpError(403, "Invalid CSRF token"));
    next();
  });
}