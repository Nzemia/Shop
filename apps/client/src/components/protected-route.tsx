import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth-store'

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, verifyAuth } = useAuthStore()
    const location = useLocation()

    useEffect(() => {
        // Only verify auth if we don't have a token or user
        const token = localStorage.getItem('auth-token')
        if (!token && requireAuth) {
            verifyAuth()
        } else if (token && !isAuthenticated) {
            verifyAuth()
        }
    }, [verifyAuth, isAuthenticated, requireAuth])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    if (requireAuth && !isAuthenticated) {
        // Redirect to login with return url
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (!requireAuth && isAuthenticated) {
        // Redirect authenticated users away from auth pages
        const from = location.state?.from?.pathname || '/'
        return <Navigate to={from} replace />
    }

    return <>{children}</>
}