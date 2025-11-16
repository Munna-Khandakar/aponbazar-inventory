"use client"

import { Loader2 } from "lucide-react"

import { MetricCard } from "@/components/dashboard/metric-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrderVolumeChart } from "@/components/dashboard/order-volume-chart"
import { KPIComparisonChart } from "@/components/dashboard/kpi-comparison-chart"
import { MonthlyGoalsRadialChart } from "@/components/dashboard/monthly-goals-radial-chart"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboardStats } from "@/hooks/use-dashboard"

export default function DashboardHomePage() {
  const { data, isLoading, isError } = useDashboardStats()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="animate-spin" size={18} />
          Loading dashboard metrics...
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="py-10 text-sm font-medium text-destructive">
          Unable to load dashboard data. Please refresh.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <OrderVolumeChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <KPIComparisonChart />
        <MonthlyGoalsRadialChart />
      </section>
    </div>
  )
}
