import { count, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users } from "@/db/schema";

export async function findByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}

export async function findById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function countAll() {
  const [row] = await db.select({ value: count() }).from(users);
  return row.value;
}

export async function create(values: { name: string; email: string; passwordHash: string; role: string }) {
  const [user] = await db.insert(users).values(values).returning();
  return user;
}