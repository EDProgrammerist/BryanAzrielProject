import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  enrollmentDate: text("enrollment_date").notNull(),
  gradeLevel: text("grade_level").notNull(),
  address: text("address").notNull(),
  status: text("status").notNull().default("Active"),
});

export const grades = pgTable("grades", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  term: text("term").notNull(),
  subject: text("subject").notNull(),
  assignment: text("assignment").notNull(),
  score: integer("score").notNull(),
});

export const attendance = pgTable(
  "attendance",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    status: text("status").notNull(),
  },
  table => [unique("attendance_student_date").on(table.studentId, table.date)]
);

export const activity = pgTable("activity", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("ADMIN"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});