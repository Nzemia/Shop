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
  const { token, user, isLoading, isAuthenticated, initialize } = useAuth();

  useEffect(() => {
    // Initialize auth state if not already done
    if (!isAuthenticated && !isLoading) {
      initialize();
    }
  }, [initialize, isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role permissions if specified
  if (roles && user?.role && !roles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}
