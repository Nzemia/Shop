import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../nav/Sidebar";
import Header from "../nav/Header";
import DashboardHome from "../../pages/dashboard/DashboardHome";
import ProductsPage from "../../pages/products/ProductsPage";
import OrdersPage from "../../pages/orders/OrdersPage";
import UsersPage from "../../pages/users/UsersPage";
import ProfilePage from "../../pages/profile/ProfilePage";
import { SupportList, SupportDetail } from "../../pages/support";
import NotFoundPage from "../../pages/errors/NotFoundPage";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="" element={<DashboardHome />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="support" element={<SupportList />} />
            <Route path="support/:id" element={<SupportDetail />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
