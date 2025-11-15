'use client'

import {useCallback, useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {AuthPayload, clearAuthPayload, getAuthPayload, saveAuthPayload} from "@/lib/auth-storage"

export const useAuth = () => {
    const [auth, setAuth] = useState<AuthPayload | null>(() => getAuthPayload())

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
    const [auth, setAuth] = useState<AuthPayload | null>(() => getAuthPayload())

    useEffect(() => {
        if (!auth) {
            router.replace("/login")
        }
    }, [auth, router])

    const signOut = useCallback(() => {
        clearAuthPayload()
        setAuth(null)
        router.replace("/login")
    }, [router])

    return {auth, isChecking: auth === null, signOut}
}
