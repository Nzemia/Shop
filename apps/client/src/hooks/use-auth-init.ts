import { useEffect } from 'react'
import { useAuthStore } from '@/lib/auth-store'

export function useAuthInit() {
    const { verifyAuth } = useAuthStore()

    useEffect(() => {
        // Initialize auth state when the app starts
        verifyAuth()
    }, [verifyAuth])
}