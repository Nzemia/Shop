import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        {/* Add auth routes later like <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
}
