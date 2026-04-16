"use client"

import { useQuery } from "@tanstack/react-query"

import { inventoryManagementApi } from "@/features/inventory-management/api/inventory-management.api"
import { inventoryManagementQueryKeys } from "@/features/inventory-management/query-keys/inventoryManagementQueryKeys"
import { useReportFilters } from "@/hooks/use-report-filters"

export const useInventoryBigBlockSeries = () => {
  const { startDate, endDate } = useReportFilters()

  return useQuery({
    queryKey: inventoryManagementQueryKeys.bigBlockSeries(startDate, endDate),
    queryFn: () => inventoryManagementApi.getInventoryBigBlockSeries(startDate, endDate),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
