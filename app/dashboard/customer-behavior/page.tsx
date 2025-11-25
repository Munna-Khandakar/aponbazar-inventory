"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { CustomerSegmentsChart } from "@/components/dashboard/customer-segments-chart"
import { ChurnPredictionChart } from "@/components/dashboard/churn-prediction-chart"
import { BehaviorMetricsTable } from "@/components/dashboard/behavior-metrics-table"
import { CustomerLTVChart } from "@/components/dashboard/customer-ltv-chart"
import { CustomerSatisfactionRadarChart } from "@/components/dashboard/customer-satisfaction-radar-chart"

export default function CustomerBehaviorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Behavior</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze customer segments, predict churn, and understand lifetime value
        </p>
      </div>

      <DashboardFilters />

      <section className="grid gap-6 lg:grid-cols-2">
        <CustomerSegmentsChart />
        <ChurnPredictionChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <CustomerLTVChart />
        <CustomerSatisfactionRadarChart />
      </section>

      <section>
        <BehaviorMetricsTable />
      </section>
    </div>
  )
}
