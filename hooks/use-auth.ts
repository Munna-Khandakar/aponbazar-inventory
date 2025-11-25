'use client'

import {useCallback, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {AuthPayload, clearAuthPayload, getAuthPayload, saveAuthPayload} from "@/lib/auth-storage"

export const useAuth = () => {
    const [auth, setAuth] = useState<AuthPayload | null>(null)

    useEffect(() => {
        // Hydrate auth state from localStorage after mount to avoid SSR hydration mismatch
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuth(getAuthPayload())
    }, [])

    const setAuthData = useCallback((payload: AuthPayload) => {
        saveAuthPayload(payload)
        setAuth(payload)
    }, [])

    const clearAuth = useCallback(() => {
        clearAuthPayload()
        setAuth(null)
    }, [])

    return {auth, setAuthData, clearAuth}
}

export const useRequireAuth = () => {
    const router = useRouter()
    const [auth, setAuth] = useState<AuthPayload | null>(null)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const authData = getAuthPayload()
        // Hydrate auth state from localStorage after mount to avoid SSR hydration mismatch
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuth(authData)
        setIsChecking(false)

        if (!authData) {
            router.replace("/login")
        }
    }, [router])

    const signOut = useCallback(() => {
        clearAuthPayload()
        setAuth(null)
        router.replace("/login")
    }, [router])

    return {auth, isChecking, signOut}
}
