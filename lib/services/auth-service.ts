import type { AuthPayload } from "@/lib/auth-storage"
import type { LoginInput } from "@/lib/types/LoginInput"

const validEmail = "admin@gmail.com"
const validPassword = "qwer@1234"

const demoAuthPayload: AuthPayload = {
  access_token: "dummy_string",
  refresh_token: "dummy_string",
  user: {
    id: 1,
    name: "Munna Khandakar",
    role: "admin",
  },
}

export const authService = {
  login: async ({ email, password }: LoginInput) => {
    if (email !== validEmail || password !== validPassword) {
      return Promise.reject(new Error("Invalid credentials"))
    }

    return Promise.resolve(demoAuthPayload)
  },
}
