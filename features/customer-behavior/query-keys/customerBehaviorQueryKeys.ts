import type { CustomerBehaviorFilters } from "@/features/customer-behavior/types/CustomerBehaviorDashboard"

export const customerBehaviorQueryKeys = {
  all: ["customer-behavior"] as const,
  dashboard: (filters: CustomerBehaviorFilters) =>
    [
      "customer-behavior",
      "dashboard",
      filters.startDate,
      filters.endDate,
      filters.shopName ?? "",
    ] as const,
}
