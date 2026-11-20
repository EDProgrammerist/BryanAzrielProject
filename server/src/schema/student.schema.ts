
import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email"),
  enrollmentDate: z.string().trim().min(1, "Enrollment date is required"),
  gradeLevel: z.string().trim().min(1, "Grade level is required"),
  address: z.string().trim().min(1, "Address is required"),
});

export const listStudentsQuery = z.object({
  q: z.string().default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
