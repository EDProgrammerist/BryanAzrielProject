import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/context/use-auth";

// Shared wrapper for auth pages. Signed-in visitors go straight to the app.
export function AuthLayout() {
  const { user, ready } = useAuth();
  if (!ready) return <p>Loading…</p>;
  if (user) return <Navigate to="/" replace />;
  return <div className="login"><Outlet /></div>;
}
