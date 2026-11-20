
import * as studentRepo from "@/repositories/student.repository";
import * as gradeRepo from "@/repositories/grade.repository";
import * as attendanceRepo from "@/repositories/attendance.repository";
import * as activityRepo from "@/repositories/activity.repository";

export async function getStats() {
  const counts = await studentRepo.counts();
  const average = await gradeRepo.overallAverage();

  return {
    totalStudents: counts.total,
    activeNow: counts.active,
    avgGrade: Number(average.toFixed(1)),
    attendanceRate: await attendanceRepo.rate(),
    recent: await activityRepo.recent(),
  };
}
