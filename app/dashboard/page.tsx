"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { InsightList } from "@/components/dashboard/insight-list"
import { InventoryHealthChart } from "@/components/dashboard/inventory-health-chart"
import { MetricCard } from "@/components/dashboard/metric-card"
import { MonthlyGoalsRadialChart } from "@/components/dashboard/monthly-goals-radial-chart"
import { OrderVolumeChart } from "@/components/dashboard/order-volume-chart"
import { PromoImpactChart } from "@/components/dashboard/promo-impact-chart"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { StorePerformanceTable } from "@/components/dashboard/store-performance-table"
import { useDashboardStats } from "@/hooks/use-dashboard"

export default function DashboardHomePage() {
  const { data } = useDashboardStats()
  const metrics = data?.metrics ?? []
  const insights = data?.insights ?? []

  return (
    <div className="space-y-6">
      <DashboardFilters />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <SalesForecastChart />
        <div className="space-y-6">
          <MonthlyGoalsRadialChart />
          <InventoryHealthChart />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <PromoImpactChart />
        <InsightList insights={insights} />
      </section>

      <StorePerformanceTable />

      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <OrderVolumeChart />
      </section>
    </div>
  )
}
