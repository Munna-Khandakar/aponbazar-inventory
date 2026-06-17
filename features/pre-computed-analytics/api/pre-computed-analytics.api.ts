import { apiClient } from "@/lib/api-client"

import type { PreComputedDashboardResponse } from "../types/PreComputedDashboard"

export const preComputedAnalyticsApi = {
  getDashboard: async (shopName?: string): Promise<PreComputedDashboardResponse> => {
    const { data } = await apiClient.get<PreComputedDashboardResponse>(
      "/api/dashboard/summary",
      { params: shopName ? { shopName } : {} }
    )
    if (!data.success) throw new Error("Failed to load pre-computed dashboard")
    return data
  },
}
