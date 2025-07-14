import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../nav/Sidebar";
import Header from "../nav/Header";
import ProductsPage from "../../pages/products/ProductsPage";
import OrdersPage from "../../pages/orders/OrdersPage";
import UsersPage from "../../pages/users/UsersPage";
import AdminsPage from "../../pages/admins/AdminsPage";
import ProfilePage from "../../pages/profile/ProfilePage";
import { Alert } from "../ui/alert";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route
              path=""
              element={
                <div>
                  Welcome to Jenga Admin. You can modify this page the way you
                  want to suit your business needs!
                </div>
              }
            />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="admins" element={<AdminsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
