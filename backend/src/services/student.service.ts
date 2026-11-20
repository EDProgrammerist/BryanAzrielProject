
import * as studentRepo from "@/repositories/student.repository";
import * as activityRepo from "@/repositories/activity.repository";
import type { CreateStudentInput } from "@/schema/student.schema";
import { toLetter } from "@/utils/grading";
import { HttpError } from "@/utils/httpError";

export async function listStudents(search: string, page: number, limit: number) {
  const { rows, total } = await studentRepo.findAll(search, page, limit);
  const data = rows.map(s => ({
    ...s,
    grade: s.avgScore === null ? "-" : toLetter(s.avgScore)
  }));
  return { data, total, pages: Math.max(1, Math.ceil(total / limit)) };
}

export async function addStudent(input: CreateStudentInput) {
  const id = await studentRepo.create(input);
  await activityRepo.add(`Added student ${input.firstName} ${input.lastName}`);
  return { id };
}

export async function removeStudent(id: number) {
  const student = await studentRepo.findById(id);
  if (!student) throw new HttpError(404, "Student not found");

  await studentRepo.remove(id);
  await activityRepo.add(`Removed student ${student.firstName} ${student.lastName}`);
}
