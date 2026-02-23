"use client"

import { useQuery } from "@tanstack/react-query"

import { inventoryManagementMockApi } from "@/features/inventory-management/api/inventory-management.mock-api"
import { inventoryManagementQueryKeys } from "@/features/inventory-management/query-keys/inventoryManagementQueryKeys"

export const useInventoryKpiSummary = () => {
  return useQuery({
    queryKey: inventoryManagementQueryKeys.kpiSummary,
    queryFn: inventoryManagementMockApi.getInventoryKpiSummary,
    staleTime: 30000,
    retry: 1,
  })
}
