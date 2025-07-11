import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../nav/Sidebar";
import Header from "../nav/Header";


export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="" element={<div>Welcome to Jenga Admin</div>} />
            {/* We'll add /products, /orders, /users here soon */}
          </Routes>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
