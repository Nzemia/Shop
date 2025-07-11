import { useAuth } from "../lib/auth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const { token, loadAuth } = useAuth();

  useEffect(() => {
    loadAuth();
  }, []);

  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
}
