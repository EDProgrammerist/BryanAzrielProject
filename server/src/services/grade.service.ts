
import * as gradeRepo from "@/repositories/grade.repository";
import * as studentRepo from "@/repositories/student.repository";
import * as activityRepo from "@/repositories/activity.repository";
import type { CreateGradeInput, GradeInput } from "@/schema/grade.schema";
import { gradePoints, toLetter } from "@/utils/grading";
import { HttpError } from "@/utils/httpError";

export async function listGrades(filters: { studentId?: number; term?: string }) {
  const rows = await gradeRepo.findGrades(filters);
  const data = rows.map(g => ({ ...g, grade: toLetter(g.score) }));

  let average = 0;
  let gpa = 0;
  if (data.length > 0) {
    average = data.reduce((sum, g) => sum + g.score, 0) / data.length;
    gpa = data.reduce((sum, g) => sum + gradePoints[g.grade], 0) / data.length;
  }

  return { data, average: Number(average.toFixed(1)), gpa: Number(gpa.toFixed(2)) };
}

export async function addGrade(input: CreateGradeInput) {
  const student = await studentRepo.findById(input.studentId);
  if (!student) throw new HttpError(400, "Pick a student first");

  const id = await gradeRepo.create(input);
  await activityRepo.add(`Added a grade for ${student.firstName} ${student.lastName}`);
  return { id };
}

export async function updateGrade(id: number, input: GradeInput) {
  const changed = await gradeRepo.update(id, input);
  if (!changed) throw new HttpError(404, "Grade not found");
}

export async function removeGrade(id: number) {
  const removed = await gradeRepo.remove(id);
  if (!removed) throw new HttpError(404, "Grade not found");
}
