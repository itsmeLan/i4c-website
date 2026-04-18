import { Navigate } from "react-router-dom";
import { getAdminToken } from "@/lib/api";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const token = getAdminToken();
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

