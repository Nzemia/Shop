import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-background shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        🛍 JengaShop
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/shop">Shop</Link>
        <Link to="/cart">
          <ShoppingCart size={20} />
        </Link>
        <Link to="/orders">My Orders</Link>
        {user ? (
          <button onClick={logout} className="text-sm text-muted-foreground">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
