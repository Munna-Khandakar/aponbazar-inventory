"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { PromoImpactChart } from "@/components/dashboard/promo-impact-chart"
import { StorePerformanceTable } from "@/components/dashboard/store-performance-table"

export default function SalesPredictionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales Prediction</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Forecast sales trends, analyze revenue patterns, and predict future performance
        </p>
      </div>

      <DashboardFilters />

      <section>
        <SalesForecastChart />
      </section>

      <section>
        <PromoImpactChart />
      </section>

      <section>
        <StorePerformanceTable />
      </section>
    </div>
  )
}
