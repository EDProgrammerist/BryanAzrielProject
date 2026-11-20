
import type { Request, Response } from "express";
import * as gradeService from "@/services/grade.service";
import { createGradeSchema, gradeSchema, listGradesQuery } from "@/schema/grade.schema";
import { idParamSchema } from "@/schema/common.schema";
import { validate } from "@/utils/validate";

export async function list(req: Request, res: Response) {
  const filters = validate(listGradesQuery, req.query);
  res.json(await gradeService.listGrades(filters));
}

export async function create(req: Request, res: Response) {
  const input = validate(createGradeSchema, req.body);
  res.status(201).json(await gradeService.addGrade(input));
}

export async function update(req: Request, res: Response) {
  const { id } = validate(idParamSchema, req.params);
  const input = validate(gradeSchema, req.body);
  await gradeService.updateGrade(id, input);
  res.json({ ok: true });
}

export async function remove(req: Request, res: Response) {
  const { id } = validate(idParamSchema, req.params);
  await gradeService.removeGrade(id);
  res.json({ ok: true });
}
