import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/components/context/auth-provider";
import { SettingsProvider } from "@/components/context/settings-provider";
import { AppLayout } from "@/components/common/app-layout";
import { ProtectedRoute } from "@/components/common/protected-route";
import { AuthLayout } from "@/pages/auth/layout";
import { LoginPage } from "@/pages/auth/login-page";
import { DashboardPage } from "@/pages/app/dashboard-page";
import { StudentsPage } from "@/pages/app/students-page";
import { AddStudentPage } from "@/pages/app/add-student-page";
import { GradesPage } from "@/pages/app/grades-page";
import { AttendancePage } from "@/pages/app/attendance-page";
import { SettingsPage } from "@/pages/app/settings-page";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="students/new" element={<AddStudentPage />} />
                <Route path="grades" element={<GradesPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
