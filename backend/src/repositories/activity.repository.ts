
import { desc } from "drizzle-orm";
import { db } from "@/db/index";
import { activity } from "@/db/schema";

export async function add(message: string) {
  await db.insert(activity).values({ message });
}

export async function recent() {
  return db
    .select({ msg: activity.message, at: activity.createdAt })
    .from(activity)
    .orderBy(desc(activity.id))
    .limit(10);
}
