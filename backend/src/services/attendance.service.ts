
import * as studentRepo from "@/repositories/student.repository";
import * as attendanceRepo from "@/repositories/attendance.repository";
import * as activityRepo from "@/repositories/activity.repository";
import type { SaveAttendanceInput } from "@/schema/attendance.schema";

export async function getForDate(date: string) {
  const students = await studentRepo.findActive();
  const saved = await attendanceRepo.findByDate(date);

  return students.map(s => {
    const record = saved.find(r => r.studentId === s.id);
    return {
      studentId: s.id,
      name: s.name,
      status: record ? record.status : "Present"
    };
  });
}

export async function saveForDate(input: SaveAttendanceInput) {
  await attendanceRepo.saveForDate(input.date, input.records);
  await activityRepo.add(`Attendance saved for ${input.date}`);
}
