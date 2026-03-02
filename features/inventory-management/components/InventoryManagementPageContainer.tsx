"use client"

import { InventoryDonutChartSection } from "@/features/inventory-management/components/InventoryDonutChartSection"
import { InventoryKpiSummaryRow } from "@/features/inventory-management/components/InventoryKpiSummaryRow"
import { InventoryMovementChartSection } from "@/features/inventory-management/components/InventoryMovementChartSection"

export function InventoryManagementPageContainer() {
  return (
    <div className="space-y-6">
      <InventoryKpiSummaryRow />
      <InventoryMovementChartSection />
      <InventoryDonutChartSection />
    </div>
  )
}
