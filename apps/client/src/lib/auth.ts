import { create } from "zustand";

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loadAuth: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, user: null });
    window.location.href = "/login";
  },
  loadAuth: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (token && user) set({ token, user });
  }
}));
