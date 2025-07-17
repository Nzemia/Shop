import ThemeToggle from "../ui/ThemeToggle";
import { Menu, UserCircle, Bell, Search } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function Header() {
  const { toggle } = useSidebarStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Modern Hamburger Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden h-9 w-9 p-0 hover:bg-muted"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title */}
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
          <p className="text-xs text-muted-foreground">Welcome back, {user?.username}</p>
        </div>

        {/* Mobile Title */}
        <div className="sm:hidden">
          <h2 className="text-base font-semibold text-foreground">Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search Button (Mobile) */}
        <Button
          variant="ghost"
          size="sm"
          className="sm:hidden h-9 w-9 p-0"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 p-0"
        >
          <Bell className="h-4 w-4" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
          >
            3
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 md:w-auto md:px-3 md:gap-2"
          onClick={() => navigate("/dashboard/profile")}
        >
          <UserCircle className="h-5 w-5" />
          <span className="hidden md:inline text-sm font-medium">
            {user?.username}
          </span>
        </Button>
      </div>
    </header>
  );
}
