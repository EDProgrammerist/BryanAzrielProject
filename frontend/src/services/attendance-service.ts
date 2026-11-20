import { http } from "@/lib/axios";
import type { AttendanceRow } from "@/types";

export async function getAttendanceService(date: string): Promise<AttendanceRow[]> {
  const response = await http.get("/attendance", { params: { date } });
  return response.data;
}

export async function saveAttendanceService(date: string, records: AttendanceRow[]): Promise<void> {
  await http.put("/attendance", {
    date,
    records: records.map(({ studentId, status }) => ({ studentId, status })),
  });
}
