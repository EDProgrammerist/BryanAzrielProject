import { Router } from "express";
import { requireAuth } from "@/middlewares/auth";
import { csrfProtection } from "@/middlewares/csrf";
import { asyncHandler } from "@/utils/asyncHandler";
import * as authController from "@/controllers/auth.controller";
import * as students from "@/controllers/student.controller";
import * as grades from "@/controllers/grade.controller";
import * as attendance from "@/controllers/attendance.controller";
import * as dashboard from "@/controllers/dashboard.controller";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "success",
    message: "API is healthy",
    timestamp: new Date().toISOString()
  });
});


router.get("/auth/v1/csrf-token", asyncHandler(authController.csrfToken));

router.use(csrfProtection);

router.post("/auth/v1/login", asyncHandler(authController.login));
router.post("/auth/v1/refresh", asyncHandler(authController.refresh));
router.post("/auth/v1/logout", asyncHandler(authController.logout));
router.get("/auth/v1/session", requireAuth, asyncHandler(authController.session));


router.use(requireAuth);

router.get("/dashboard", asyncHandler(dashboard.stats));

router.get("/students", asyncHandler(students.list));
router.post("/students", asyncHandler(students.create));
router.delete("/students/:id", asyncHandler(students.remove));

router.get("/grades", asyncHandler(grades.list));
router.post("/grades", asyncHandler(grades.create));
router.put("/grades/:id", asyncHandler(grades.update));
router.delete("/grades/:id", asyncHandler(grades.remove));

router.get("/attendance", asyncHandler(attendance.get));
router.put("/attendance", asyncHandler(attendance.save));

export default router;