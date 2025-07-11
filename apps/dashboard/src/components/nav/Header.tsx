import ThemeToggle from "../ui/ThemeToggle";
import { Menu, UserCircle } from "lucide-react";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { toggle } = useSidebarStore();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={toggle}>
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div
          className="cursor-pointer"
          onClick={() => navigate("/dashboard/profile")}
        >
          <UserCircle size={24} />
        </div>
      </div>
    </header>
  );
}
