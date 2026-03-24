"use client"

import { BlockInventoryTable } from "@/features/inventory-management/components/BlockInventoryTable"
import { PredictiveInventoryStatusChart } from "@/features/inventory-management/components/PredictiveInventoryStatusChart"
import { SupplierReorderInsightsChart } from "@/features/inventory-management/components/SupplierReorderInsightsChart"
import { ToplineInventoryOverview } from "@/features/inventory-management/components/ToplineInventoryOverview"

export function InventoryManagementPageContainer() {
  return (
    <div className="space-y-6">
      <ToplineInventoryOverview />

      <BlockInventoryTable />

      <PredictiveInventoryStatusChart />

      <SupplierReorderInsightsChart />
    </div>
  )
}
