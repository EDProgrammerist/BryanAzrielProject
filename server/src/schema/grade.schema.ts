
import { z } from "zod";

const scoreMessage = "Score must be a number from 0 to 100";

export const gradeSchema = z.object({
  subject: z.string().trim().min(1, "Please fill in the subject"),
  assignment: z.string().trim().min(1, "Please fill in the assignment"),
  score: z.preprocess(
    value => (value === "" || value === null || value === undefined ? NaN : Number(value)),
    z.number({ invalid_type_error: scoreMessage })
      .int("Score must be a whole number")
      .min(0, scoreMessage)
      .max(100, scoreMessage)
  ),
});

export const createGradeSchema = gradeSchema.extend({
  studentId: z.coerce.number({ invalid_type_error: "Pick a student first" })
    .int()
    .positive("Pick a student first"),
  term: z.string().trim().min(1, "Pick a semester first"),
});

export const listGradesQuery = z.object({
  studentId: z.coerce.number().int().positive().optional(),
  term: z.string().optional(),
});

export type GradeInput = z.infer<typeof gradeSchema>;
export type CreateGradeInput = z.infer<typeof createGradeSchema>;
