import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AccessDenied from "./pages/errors/AccessDenied";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/errors/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/access-denied" element={<AccessDenied />} />

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
