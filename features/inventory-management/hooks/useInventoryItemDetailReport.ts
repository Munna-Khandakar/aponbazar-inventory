"use client"

import { useQuery } from "@tanstack/react-query"

import { inventoryManagementApi } from "@/features/inventory-management/api/inventory-management.api"
import { inventoryManagementQueryKeys } from "@/features/inventory-management/query-keys/inventoryManagementQueryKeys"
import { useReportFilters } from "@/hooks/use-report-filters"

export const useInventoryItemDetailReport = (subCategory: string | null) => {
  const { startDate, endDate, shopName } = useReportFilters()

  return useQuery({
    queryKey: inventoryManagementQueryKeys.itemDetailReport(
      startDate,
      endDate,
      subCategory ?? "",
      shopName
    ),
    queryFn: () =>
      inventoryManagementApi.getInventoryItemDetailReport(
        startDate,
        endDate,
        subCategory ?? "",
        shopName
      ),
    enabled: Boolean(subCategory),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
