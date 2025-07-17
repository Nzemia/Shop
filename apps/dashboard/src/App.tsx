import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useEffect } from "react";
import DashboardLayout from "./components/layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import { useAuth } from "./lib/auth";
import NotFoundPage from "./pages/errors/NotFoundPage";
import AccessDeniedPage from "./pages/errors/AccessDeniedPage";

export default function App() {
  const { isAuthenticated, isLoading, initialize } = useAuth();

  // Initialize auth state on app start
  useEffect(() => {
    const initAuth = async () => {
      await initialize();
    };
    initAuth();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Error pages */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute roles={["ADMIN", "SUPERADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
