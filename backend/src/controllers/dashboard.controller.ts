
import type { Request, Response } from "express";
import * as dashboardService from "@/services/dashboard.service";

export async function stats(_req: Request, res: Response) {
  res.json(await dashboardService.getStats());
}
