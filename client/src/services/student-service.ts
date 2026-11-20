import { http } from "@/lib/axios";
import type { NewStudent, StudentList } from "@/types";

export async function getStudentsService(q: string, page: number, limit?: number): Promise<StudentList> {
  const response = await http.get("/students", { params: { q, page, limit } });
  return response.data;
}

export async function createStudentService(student: NewStudent): Promise<{ id: number }> {
  const response = await http.post("/students", student);
  return response.data;
}

export async function deleteStudentService(id: number): Promise<void> {
  await http.delete(`/students/${id}`);
}
