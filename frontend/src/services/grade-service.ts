import { http } from "@/lib/axios";
import type { GradeFormValues, GradeResult } from "@/types";

export async function getGradesService(studentId: number, term: string): Promise<GradeResult> {
  const response = await http.get("/grades", { params: { studentId, term } });
  return response.data;
}

export async function createGradeService(
  values: GradeFormValues & { studentId: number; term: string }
): Promise<{ id: number }> {
  const response = await http.post("/grades", values);
  return response.data;
}

export async function updateGradeService(id: number, values: GradeFormValues): Promise<void> {
  await http.put(`/grades/${id}`, values);
}

export async function deleteGradeService(id: number): Promise<void> {
  await http.delete(`/grades/${id}`);
}
