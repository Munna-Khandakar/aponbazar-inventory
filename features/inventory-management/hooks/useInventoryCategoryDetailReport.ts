"use client"

import { useQuery } from "@tanstack/react-query"

import { inventoryManagementApi } from "@/features/inventory-management/api/inventory-management.api"
import { inventoryManagementQueryKeys } from "@/features/inventory-management/query-keys/inventoryManagementQueryKeys"
import { useReportFilters } from "@/hooks/use-report-filters"

export const useInventoryCategoryDetailReport = (bigBlock: string | null) => {
  const { startDate, endDate } = useReportFilters()

  return useQuery({
    queryKey: inventoryManagementQueryKeys.categoryDetailReport(
      startDate,
      endDate,
      bigBlock ?? ""
    ),
    queryFn: () =>
      inventoryManagementApi.getInventoryCategoryDetailReport(startDate, endDate, bigBlock ?? ""),
    enabled: Boolean(bigBlock),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
