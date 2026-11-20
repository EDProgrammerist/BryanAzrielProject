import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db/index";
import { refreshTokens } from "@/db/schema";

export async function create(userId: number, tokenHash: string, expiresAt: Date) {
  await db.insert(refreshTokens).values({ userId, tokenHash, expiresAt });
}

export async function findByHash(tokenHash: string) {
  const [row] = await db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, tokenHash)).limit(1);
  return row;
}

export async function revoke(id: number) {
  await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.id, id));
}

export async function revokeAllForUser(userId: number) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(and(eq(refreshTokens.userId, userId), isNull(refreshTokens.revokedAt)));
}