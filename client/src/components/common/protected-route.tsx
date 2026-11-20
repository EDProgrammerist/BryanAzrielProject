import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/context/use-auth";

// Waits for the startup check, sends signed-out visitors to login.
// Navigation only: the backend requireAuth middleware is what secures the data.
export function ProtectedRoute() {
  const { user, ready } = useAuth();
  if (!ready) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
