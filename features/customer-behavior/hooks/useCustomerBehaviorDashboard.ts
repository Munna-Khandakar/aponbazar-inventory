"use client"

import { useQuery } from "@tanstack/react-query"

import { customerBehaviorMockApi } from "@/features/customer-behavior/api/customer-behavior.mock-api"
import { customerBehaviorQueryKeys } from "@/features/customer-behavior/query-keys/customerBehaviorQueryKeys"
import { useReportFilters } from "@/hooks/use-report-filters"

export const useCustomerBehaviorDashboard = () => {
  const { startDate, endDate, shopName } = useReportFilters()
  const filters = {
    startDate,
    endDate,
    ...(shopName ? { shopName } : {}),
  }

  return useQuery({
    queryKey: customerBehaviorQueryKeys.dashboard(filters),
    queryFn: () => customerBehaviorMockApi.getDashboard(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
