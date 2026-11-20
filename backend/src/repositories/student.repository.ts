
import { count, eq, ilike, avg, sql } from "drizzle-orm";
import { db } from "@/db/index";
import { students, grades } from "@/db/schema";

type NewStudent = typeof students.$inferInsert;

const fullName = sql`${students.firstName} || ' ' || ${students.lastName}`;

export async function findAll(search: string, page: number, limit: number) {
  const rows = await db
    .select({
      id: students.id,
      firstName: students.firstName,
      lastName: students.lastName,
      status: students.status,
      avgScore: avg(grades.score),
    })
    .from(students)
    .leftJoin(grades, eq(grades.studentId, students.id))
    .where(ilike(fullName, `%${search}%`))
    .groupBy(students.id)
    .orderBy(students.id)
    .limit(limit)
    .offset((page - 1) * limit);

  const [counted] = await db
    .select({ total: count() })
    .from(students)
    .where(ilike(fullName, `%${search}%`));

  return {
    rows: rows.map(r => ({
      ...r,
      avgScore: r.avgScore === null ? null : Number(r.avgScore)
    })),
    total: counted.total,
  };
}

export async function findById(id: number) {
  const [row] = await db
    .select({ id: students.id, firstName: students.firstName, lastName: students.lastName })
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return row;
}

export async function findActive() {
  return db
    .select({ id: students.id, name: sql<string>`${fullName}` })
    .from(students)
    .where(eq(students.status, "Active"))
    .orderBy(students.id);
}

export async function counts() {
  const [row] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) filter (where ${students.status} = 'Active')`.mapWith(Number),
    })
    .from(students);
  return row;
}

export async function create(data: NewStudent) {
  const [row] = await db.insert(students).values(data).returning({ id: students.id });
  return row.id;
}

export async function remove(id: number) {
  const deleted = await db.delete(students).where(eq(students.id, id)).returning({ id: students.id });
  return deleted.length;
}
