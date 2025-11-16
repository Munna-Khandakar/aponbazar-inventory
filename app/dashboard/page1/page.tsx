"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { InventoryPredictionChart } from "@/components/dashboard/inventory-prediction-chart"
import { DemandForecastTable } from "@/components/dashboard/demand-forecast-table"
import { StockLevelsChart } from "@/components/dashboard/stock-levels-chart"
import { ProductPerformanceRadarChart } from "@/components/dashboard/product-performance-radar-chart"

export default function DashboardPageOne() {
  return (
    <div className="space-y-6">
      <DashboardFilters />

      <section>
        <SalesForecastChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <InventoryPredictionChart />
        <StockLevelsChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <DemandForecastTable />
        <ProductPerformanceRadarChart />
      </section>
    </div>
  )
}
