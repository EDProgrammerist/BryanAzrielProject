import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import { ENV } from "@/config/env";
import type { users } from "@/db/schema";
import * as userRepo from "@/repositories/user.repository";
import * as tokenRepo from "@/repositories/token.repository";
import { HttpError } from "@/utils/httpError";

type UserRow = typeof users.$inferSelect;

export const ACCESS_TTL_MS = 15 * 60 * 1000;
export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function publicUser(user: UserRow) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function issueTokens(user: UserRow) {
  const accessToken = jwt.sign({ sub: String(user.id), role: user.role }, ENV.JWT_SECRET, {
    expiresIn: Math.floor(ACCESS_TTL_MS / 1000),
  });
  const refreshToken = randomBytes(48).toString("hex");
  await tokenRepo.create(user.id, hashToken(refreshToken), new Date(Date.now() + REFRESH_TTL_MS));
  return { accessToken, refreshToken };
}

export async function login(email: string, password: string) {
  const user = await userRepo.findByEmail(email.trim().toLowerCase());
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) throw new HttpError(401, "Wrong email or password");
  return { user: publicUser(user), ...(await issueTokens(user)) };
}

export async function refresh(refreshToken: string | undefined) {
  if (!refreshToken) throw new HttpError(401, "Please sign in");
  const record = await tokenRepo.findByHash(hashToken(refreshToken));
  if (!record) throw new HttpError(401, "Please sign in");

  if (record.revokedAt || record.expiresAt < new Date()) {
    await tokenRepo.revokeAllForUser(record.userId);
    throw new HttpError(401, "Please sign in");
  }

  await tokenRepo.revoke(record.id);
  const user = await userRepo.findById(record.userId);
  if (!user) throw new HttpError(401, "Please sign in");
  return issueTokens(user);
}

export async function logout(refreshToken: string | undefined) {
  if (!refreshToken) return;
  const record = await tokenRepo.findByHash(hashToken(refreshToken));
  if (record) await tokenRepo.revoke(record.id);
}

export async function getSession(userId: number) {
  const user = await userRepo.findById(userId);
  if (!user) throw new HttpError(401, "Please sign in");
  return publicUser(user);
}

export async function seedAdmin() {
  if ((await userRepo.countAll()) > 0) return;
  if (!ENV.ADMIN_PASSWORD) {
    console.warn("No users yet and ADMIN_PASSWORD is empty, so no admin was created.");
    return;
  }
  const passwordHash = await bcrypt.hash(ENV.ADMIN_PASSWORD, 10);
  await userRepo.create({
    name: "Admin",
    email: ENV.ADMIN_EMAIL.trim().toLowerCase(),
    passwordHash,
    role: "ADMIN",
  });
  console.log(`Admin account created for ${ENV.ADMIN_EMAIL}`);
}