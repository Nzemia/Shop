import { useAuth } from "../lib/auth";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  roles
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { token, user, loadFromStorage } = useAuth();

  useEffect(() => {
    loadFromStorage();
  }, []);

  if (!token) return <Navigate to="/login" />;

 if (roles && user?.role && !roles.includes(user.role)) {
   return <Navigate to="/access-denied" />;
 }

  return <>{children}</>;
}
