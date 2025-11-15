export const AUTH_STORAGE_KEY = "apon-bazar-auth"

export type AuthUser = {
  id: number
  name: string
  role: string
}

export type AuthPayload = {
  access_token: string
  refresh_token: string
  user: AuthUser
}

export const saveAuthPayload = (payload: AuthPayload) => {
  if (typeof window === "undefined") return

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
}

export const getAuthPayload = (): AuthPayload | null => {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  return stored ? (JSON.parse(stored) as AuthPayload) : null
}

export const clearAuthPayload = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem(AUTH_STORAGE_KEY)
}
