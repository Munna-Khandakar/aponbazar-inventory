"use client"

import { useQuery } from "@tanstack/react-query"

import { inventoryManagementMockApi } from "@/features/inventory-management/api/inventory-management.mock-api"
import { inventoryManagementQueryKeys } from "@/features/inventory-management/query-keys/inventoryManagementQueryKeys"
import { useReportFilters } from "@/hooks/use-report-filters"

export const useInventoryBigBlockReport = () => {
  const { startDate, endDate } = useReportFilters()

  return useQuery({
    queryKey: inventoryManagementQueryKeys.bigBlockReport(startDate, endDate),
    queryFn: inventoryManagementMockApi.getInventoryBigBlockReport,
    placeholderData: (previousData) => previousData,
  })
}
