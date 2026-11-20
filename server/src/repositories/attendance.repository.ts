
import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { attendance } from "@/db/schema";

export async function findByDate(date: string) {
  return db
    .select({ studentId: attendance.studentId, status: attendance.status })
    .from(attendance)
    .where(eq(attendance.date, date));
}

export async function saveForDate(
  date: string,
  records: { studentId: number; status: string }[]
) {
  await db.transaction(async tx => {
    for (const r of records) {
      await tx
        .insert(attendance)
        .values({ studentId: r.studentId, date, status: r.status })
        .onConflictDoUpdate({
          target: [attendance.studentId, attendance.date],
          set: { status: r.status },
        });
    }
  });
}

export async function rate() {
  const [row] = await db
    .select({
      total: count(),
      came: sql<number>`count(*) filter (where ${attendance.status} <> 'Absent')`.mapWith(Number),
    })
    .from(attendance);
  return row.total ? Math.round((row.came / row.total) * 100) : 0;
}
