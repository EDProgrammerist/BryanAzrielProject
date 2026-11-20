
import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid id"),
});

export const dateString = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must look like 2026-11-18"
);
