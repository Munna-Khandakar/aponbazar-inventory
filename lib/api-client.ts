import axios from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://apon-report.duckdns.org"

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
  withCredentials: false,
})
