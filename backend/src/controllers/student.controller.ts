
import type { Request, Response } from "express";
import * as studentService from "@/services/student.service";
import { createStudentSchema, listStudentsQuery } from "@/schema/student.schema";
import { idParamSchema } from "@/schema/common.schema";
import { validate } from "@/utils/validate";

export async function list(req: Request, res: Response) {
  const { q, page, limit } = validate(listStudentsQuery, req.query);
  res.json(await studentService.listStudents(q, page, limit));
}

export async function create(req: Request, res: Response) {
  const input = validate(createStudentSchema, req.body);
  res.status(201).json(await studentService.addStudent(input));
}

export async function remove(req: Request, res: Response) {
  const { id } = validate(idParamSchema, req.params);
  await studentService.removeStudent(id);
  res.json({ ok: true });
}
