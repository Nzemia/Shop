import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from './api'

export interface User {
    id: string
    email: string
    username: string
    role: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>
    register: (email: string, username: string, password: string) => Promise<void>
    logout: () => void
    verifyAuth: () => Promise<void>
    clearError: () => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Actions
            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null })

                    const response = await authAPI.login({ email, password })
                    const { token, user } = response.data

                    // Store token in localStorage
                    localStorage.setItem('auth-token', token)

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'Login failed'
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                        user: null,
                        token: null,
                    })
                    throw new Error(errorMessage)
                }
            },

            register: async (email: string, username: string, password: string) => {
                try {
                    set({ isLoading: true, error: null })

                    const response = await authAPI.register({ email, username, password })

                    // After successful registration, automatically log in
                    await get().login(email, password)
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || 'Registration failed'
                    set({
                        error: errorMessage,
                        isLoading: false,
                    })
                    throw new Error(errorMessage)
                }
            },

            logout: () => {
                localStorage.removeItem('auth-token')
                localStorage.removeItem('auth-user')
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                })
            },

            verifyAuth: async () => {
                try {
                    const token = localStorage.getItem('auth-token')
                    if (!token) {
                        set({ isAuthenticated: false, user: null, token: null })
                        return
                    }

                    set({ isLoading: true })

                    const response = await authAPI.verifyAuth()
                    const { user } = response.data

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                } catch (error: any) {
                    // Token is invalid or expired
                    localStorage.removeItem('auth-token')
                    localStorage.removeItem('auth-user')
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    })
                }
            },

            clearError: () => set({ error: null }),

            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)