
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "@/utils/httpError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Server error, please try again" });
}
