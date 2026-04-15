import axios from "axios"

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://163.227.239.237:9099"
  // "https://crabbedly-blatant-randy.ngrok-free.dev"

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "true",
  },
  withCredentials: false,
})
