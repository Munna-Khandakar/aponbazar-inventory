"use client"

import { ToplineSalesOverview } from "@/components/dashboard/topline-sales-overview"
import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { PromoImpactChart } from "@/components/dashboard/promo-impact-chart"
import { StorePerformanceTable } from "@/components/dashboard/store-performance-table"

export default function SalesPredictionPage() {
  return (
    <div className="space-y-6">
      <section>
        <ToplineSalesOverview />
      </section>

      <section className="grid gap-6 xl:grid-cols-2 xl:items-stretch">
        <SalesForecastChart />
        <StorePerformanceTable />
      </section>

      <section>
        <PromoImpactChart />
      </section>
    </div>
  )
}
