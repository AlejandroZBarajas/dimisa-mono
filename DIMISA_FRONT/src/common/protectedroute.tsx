import { Navigate } from "react-router-dom";
import { useAuth } from "./auth/auth_context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[]; 
  //userRole: string | null; 
}

export function ProtectedRoute({
  children,
  allowedRoles,
  //userRole,
}: ProtectedRouteProps) {
  const { auth, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!auth.user || !allowedRoles.includes(auth.user.rol)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>;
}