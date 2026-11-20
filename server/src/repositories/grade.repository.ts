
import { and, avg, eq } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "@/db/index";
import { grades } from "@/db/schema";

export async function findGrades(filters: { studentId?: number; term?: string }) {
  const conditions: SQL[] = [];
  if (filters.studentId) conditions.push(eq(grades.studentId, filters.studentId));
  if (filters.term) conditions.push(eq(grades.term, filters.term));

  return db
    .select({
      id: grades.id,
      subject: grades.subject,
      assignment: grades.assignment,
      score: grades.score
    })
    .from(grades)
    .where(and(...conditions))
    .orderBy(grades.id);
}

export async function overallAverage() {
  const [row] = await db.select({ value: avg(grades.score) }).from(grades);
  return Number(row.value) || 0;
}

export async function create(data: {
  studentId: number;
  term: string;
  subject: string;
  assignment: string;
  score: number
}) {
  const [row] = await db.insert(grades).values(data).returning({ id: grades.id });
  return row.id;
}

export async function update(
  id: number,
  data: { subject: string; assignment: string; score: number }
) {
  const updated = await db.update(grades).set(data)
    .where(eq(grades.id, id)).returning({ id: grades.id });
  return updated.length;
}

export async function remove(id: number) {
  const deleted = await db.delete(grades).where(eq(grades.id, id)).returning({ id: grades.id });
  return deleted.length;
}
