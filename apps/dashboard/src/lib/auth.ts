import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Types
interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  setLoading: (loading: boolean) => void;
}

// Zustand store with persistence
const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('http://localhost:8080/api/auth/login', {
            email,
            password,
          });

          const { token, user } = response.data;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store token in localStorage for API calls
          localStorage.setItem('authToken', token);
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Login error:', error.response?.data || error.message);
          throw error;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      },

      initialize: () => {
        const state = get();
        if (state.token && state.user) {
          set({ isAuthenticated: true });
          localStorage.setItem('authToken', state.token);
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hook for components
export const useAuth = () => {
  const store = useAuthStore();
  return store;
};

// Utility functions for API calls and uploadthing
export const getAuthToken = (): string | null => {
  const state = useAuthStore.getState();
  return state.token || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// For uploadthing, we need to pass headers through the request
export const getUploadthingHeaders = () => {
  return getAuthHeaders();
};

// Export logout function for components that need it directly
export const logout = () => {
  useAuthStore.getState().logout();
};