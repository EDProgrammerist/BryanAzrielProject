
import { z } from "zod";
import { dateString } from "./common.schema";

export const attendanceQuery = z.object({ date: dateString });

export const saveAttendanceSchema = z.object({
  date: dateString,
  records: z.array(
    z.object({
      studentId: z.coerce.number().int().positive(),
      status: z.enum(["Present", "Absent", "Late"]),
    })
  ),
});

export type SaveAttendanceInput = z.infer<typeof saveAttendanceSchema>;
