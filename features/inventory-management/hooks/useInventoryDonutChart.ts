"use client"

import { useQuery } from "@tanstack/react-query"

import { inventoryManagementMockApi } from "@/features/inventory-management/api/inventory-management.mock-api"
import { inventoryManagementQueryKeys } from "@/features/inventory-management/query-keys/inventoryManagementQueryKeys"

export const useInventoryDonutChart = () => {
  return useQuery({
    queryKey: inventoryManagementQueryKeys.donutChart,
    queryFn: inventoryManagementMockApi.getInventoryDonutChart,
    staleTime: 30000,
    retry: 1,
  })
}
