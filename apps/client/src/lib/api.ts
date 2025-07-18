import axios from 'axios'

const API_BASE_URL = "http://localhost:8080/api";


export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('auth-token')
            localStorage.removeItem('auth-user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth API endpoints
export const authAPI = {
    register: (data: { email: string; username: string; password: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    verifyAuth: () =>
        api.get('/auth/verify'),

    getProfile: () =>
        api.get('/auth/profile'),

    forgotPassword: (data: { email: string }) =>
        api.post('/auth/forgot-password', data),

    resetPassword: (data: { token: string; newPassword: string }) =>
        api.post('/auth/reset-password', data),
}

export default api