import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

type User = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

// axios interceptor to handle token
const setupAxiosInterceptor = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: (token, user) => {
        setupAxiosInterceptor(token);
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false
        });
      },

      logout: () => {
        setupAxiosInterceptor(null);
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      initialize: async () => {
        const state = get();
        if (state.token && state.user) {
          setupAxiosInterceptor(state.token);
          // Verify token is still valid
          try {
            const isValid = await state.checkAuth();
            if (isValid) {
              set({ isAuthenticated: true, isLoading: false });
            } else {
              state.logout();
            }
          } catch (error) {
            state.logout();
          }
        } else {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        const state = get();
        if (!state.token) return false;

        try {
          // Verify token with backend
          const response = await axios.get("/api/auth/verify", {
            headers: { Authorization: `Bearer ${state.token}` }
          });

          // If user data has changed, update it
          if (response.data.user) {
            set({ user: response.data.user });
          }

          return true;
        } catch (error) {
          console.error("Token verification failed:", error);
          return false;
        }
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user
      })
    }
  )
);

// Auto-initialize when the store is created
useAuth.getState().initialize();
