import { http } from "@/lib/axios";
import type { DashboardStats } from "@/types";

export async function getDashboardService(): Promise<DashboardStats> {
  const response = await http.get("/dashboard");
  return response.data;
}
