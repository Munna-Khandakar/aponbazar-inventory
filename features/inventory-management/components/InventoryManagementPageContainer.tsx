"use client"

import { PredictiveInventoryStatusChart } from "@/features/inventory-management/components/PredictiveInventoryStatusChart"
import { ProductLevelForecastPanel } from "@/features/inventory-management/components/ProductLevelForecastPanel"
import { SupplierReorderInsightsChart } from "@/features/inventory-management/components/SupplierReorderInsightsChart"
import { ToplineInventoryOverview } from "@/features/inventory-management/components/ToplineInventoryOverview"

export function InventoryManagementPageContainer() {
  return (
    <div className="space-y-6">
      <ToplineInventoryOverview />

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.45fr] xl:items-stretch">
        <div className="space-y-6">
          <ProductLevelForecastPanel />
          <SupplierReorderInsightsChart />
        </div>
        <PredictiveInventoryStatusChart />
      </section>
    </div>
  )
}
