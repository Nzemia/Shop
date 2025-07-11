import { create } from "zustand";

type User = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
};

type AuthState = {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loadFromStorage: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  token: null,
  user: null,
  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, user: null });
  },
  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user) set({ token, user });
  }
}));
