import axios from "axios";
import { getAuthHeaders } from "./auth";

// Create axios instance with base configuration
const api = axios.create({
    baseURL:
        process.env.NODE_ENV === "production"
            ? "https://your-api-domain.com/api"
            : "http://localhost:8080/api",
    timeout: 10000
});

// Add auth headers to all requests
api.interceptors.request.use((config) => {
    const authHeaders = getAuthHeaders();
    if (config.headers) {
        Object.assign(config.headers, authHeaders);
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login or refresh token
            console.error("Unauthorized request:", error);
        }
        return Promise.reject(error);
    }
);

export default api;

// Upload-specific API calls
export const uploadAPI = {
    // Get upload configuration
    getConfig: () => api.get("/uploads/config"),

    // Health check for upload service
    checkHealth: () => api.get("/uploads/health")
};
