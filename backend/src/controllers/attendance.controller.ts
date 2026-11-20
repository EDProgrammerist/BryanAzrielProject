
import type { Request, Response } from "express";
import * as attendanceService from "@/services/attendance.service";
import { attendanceQuery, saveAttendanceSchema } from "@/schema/attendance.schema";
import { validate } from "@/utils/validate";

export async function get(req: Request, res: Response) {
  const { date } = validate(attendanceQuery, req.query);
  res.json(await attendanceService.getForDate(date));
}

export async function save(req: Request, res: Response) {
  const input = validate(saveAttendanceSchema, req.body);
  await attendanceService.saveForDate(input);
  res.json({ ok: true });
}
