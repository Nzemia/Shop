import { useSidebarStore } from "../../store/useSidebarStore";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  ShieldCheck,
  LogOut
} from "lucide-react";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Products", icon: Package, path: "/dashboard/products" },
  { name: "Orders", icon: ShoppingCart, path: "/dashboard/orders" },
  { name: "Users", icon: Users, path: "/dashboard/users" },
  { name: "Admins", icon: ShieldCheck, path: "/dashboard/admins" }
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { isOpen, close } = useSidebarStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-60 bg-muted text-muted-foreground hidden md:flex flex-col p-4">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-50 md:hidden"
          onClick={close}
        >
          <aside
            className="w-64 bg-background h-full p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={close} className="mb-4 text-sm text-right w-full">
              <X size={20} className="ml-auto" />
            </button>
            <SidebarContent pathname={pathname} />
          </aside>
        </div>
      )}
    </>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      <h1 className="text-xl font-bold text-foreground mb-6">Jenga Admin</h1>
      <nav className="flex flex-col gap-2">
        {links.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-accent transition ${
              pathname === path ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            <Icon size={18} />
            <span>{name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t">
        <button className="flex items-center gap-2 text-red-500 hover:underline">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );
}
