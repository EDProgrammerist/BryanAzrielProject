export type AttendanceStatus = "Present" | "Absent" | "Late";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string;
  gradeLevel: string;
  address: string;
  status: "Active" | "Inactive";
  grade: string;
}

export interface StudentList {
  data: Student[];
  total: number;
  pages: number;
}

export interface NewStudent {
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string;
  gradeLevel: string;
  address: string;
}

export interface Grade {
  id: number;
  studentId: number;
  term: string;
  subject: string;
  assignment: string;
  score: number;
  grade: string;
}

export interface GradeResult {
  data: Grade[];
  gpa: number;
  average: number;
}

export interface GradeFormValues {
  subject: string;
  assignment: string;
  score: string | number;
}

export interface AttendanceRow {
  studentId: number;
  name: string;
  status: AttendanceStatus;
}

export interface DashboardStats {
  totalStudents: number;
  activeNow: number;
  avgGrade: number;
  attendanceRate: number;
  recent: { msg: string; at: string }[];
}