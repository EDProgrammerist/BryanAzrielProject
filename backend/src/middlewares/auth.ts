import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import { HttpError } from "@/utils/httpError";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.["access-token"];
  if (!token) throw new HttpError(401, "Please sign in");
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as jwt.JwtPayload;
    req.user = { id: Number(payload.sub), role: String(payload.role) };
  } catch {
    throw new HttpError(401, "Please sign in");
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) throw new HttpError(403, "Not allowed");
    next();
  };
}