import { useSidebarStore } from "../../store/useSidebarStore";
import { X, ChevronRight, User, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  MessageSquare,
  LogOut
} from "lucide-react";
import { logout, useAuth } from "../../lib/auth";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard", description: "Overview & Analytics" },
  { name: "Products", icon: Package, path: "/dashboard/products", description: "Manage Inventory" },
  { name: "Orders", icon: ShoppingCart, path: "/dashboard/orders", description: "Track & Fulfill" },
  { name: "Users", icon: Users, path: "/dashboard/users", description: "User Management" },
  { name: "Support", icon: MessageSquare, path: "/dashboard/support", description: "Help & Tickets" }
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { isOpen, close } = useSidebarStore();
  const { user } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-60 bg-muted text-muted-foreground hidden md:flex flex-col p-4">
        <SidebarContent pathname={pathname} user={user} onNavigate={() => { }} />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden backdrop-enter"
            onClick={close}
          />

          {/* Mobile Menu */}
          <aside
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r shadow-2xl z-50 md:hidden mobile-menu-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">Jenga Admin</h1>
                    <p className="text-xs text-muted-foreground">Management Portal</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={close}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User Profile Section */}
              {user && (
                <div className="p-4 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Badge
                      variant={user.role === 'SUPERADMIN' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-4">
                <SidebarContent pathname={pathname} user={user} onNavigate={close} />
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/30">
                <div className="space-y-2">
                  <Link
                    to="/dashboard/profile"
                    onClick={close}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>

                  <Separator />

                  <button
                    onClick={() => {
                      logout();
                      close();
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

function SidebarContent({
  pathname,
  user,
  onNavigate
}: {
  pathname: string;
  user: any;
  onNavigate: () => void;
}) {
  return (
    <>
      {/* Desktop Content */}
      <div className="md:block hidden">
        <h1 className="text-xl font-bold text-foreground mb-6">Jenga Admin</h1>
        <nav className="flex flex-col gap-2">
          {links.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-accent transition ${pathname === path ? "bg-accent text-accent-foreground" : ""
                }`}
            >
              <Icon size={18} />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t">
          <button
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:underline"
            onClick={logout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden block px-4">
        <nav className="space-y-1">
          {links.map(({ name, path, icon: Icon, description }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={onNavigate}
                className={`menu-item group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 active"
                  : "hover:bg-muted/50 active:bg-muted"
                  }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${isActive
                  ? "bg-primary-foreground/20"
                  : "bg-muted group-hover:bg-muted-foreground/10"
                  }`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${isActive ? "text-primary-foreground" : "text-foreground"
                    }`}>
                    {name}
                  </p>
                  <p className={`text-xs truncate ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}>
                    {description}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`} />
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
