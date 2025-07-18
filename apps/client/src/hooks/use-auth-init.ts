import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'

export function useAuthInit() {
    const { verifyAuth, isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (!isAuthenticated) {
            const token = localStorage.getItem('auth-token')
            if (token) {
                verifyAuth()
            }
        }
    }, [verifyAuth, isAuthenticated])
}