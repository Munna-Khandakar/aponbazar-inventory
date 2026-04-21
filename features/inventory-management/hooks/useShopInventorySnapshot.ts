"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { inventoryManagementApi } from "@/features/inventory-management/api/inventory-management.api"
import { inventoryManagementQueryKeys } from "@/features/inventory-management/query-keys/inventoryManagementQueryKeys"
import type {
  InventoryHealthStatus,
  ShopInventorySnapshotTableRow,
} from "@/features/inventory-management/types/ShopInventorySnapshotReport"
import { useReportFilters } from "@/hooks/use-report-filters"

const getInventoryHealth = ({
  currentStockQty,
  fiveDayLifting,
  optimumInventoryValue,
}: {
  currentStockQty: number
  fiveDayLifting: number | null
  optimumInventoryValue: number | null
}): InventoryHealthStatus | null => {
  if (optimumInventoryValue !== null && currentStockQty > optimumInventoryValue) {
    return "Overstocked"
  }

  if (fiveDayLifting !== null && currentStockQty < fiveDayLifting) {
    return "Stockout Risk"
  }

  if (optimumInventoryValue !== null && fiveDayLifting !== null) {
    return "Healthy"
  }

  return null
}

export const useShopInventorySnapshot = () => {
  const { shopName } = useReportFilters()
  const query = useQuery({
    queryKey: inventoryManagementQueryKeys.shopInventorySnapshot(shopName),
    queryFn: () => inventoryManagementApi.getShopInventorySnapshot(shopName),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const rows = useMemo<ShopInventorySnapshotTableRow[]>(() => {
    return (query.data?.data ?? []).map((row) => {
      const fiveDayLifting = row.fiveDayLifting ?? null
      const optimumInventoryValue = null
      const forecastAccuracy = null

      return {
        shopName: row.shopName,
        currentStockQty: row.currentStockQty,
        currentStockValue: row.currentStockValue,
        fiveDayLifting,
        optimumInventoryValue,
        inventoryHealth: getInventoryHealth({
          currentStockQty: row.currentStockQty,
          fiveDayLifting,
          optimumInventoryValue,
        }),
        forecastAccuracy,
      }
    })
  }, [query.data])

  return {
    ...query,
    rows,
  }
}
