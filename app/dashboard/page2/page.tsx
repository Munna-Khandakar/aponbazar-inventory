"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { CustomerSegmentsChart } from "@/components/dashboard/customer-segments-chart"
import { ChurnPredictionChart } from "@/components/dashboard/churn-prediction-chart"
import { BehaviorMetricsTable } from "@/components/dashboard/behavior-metrics-table"
import { CustomerLTVChart } from "@/components/dashboard/customer-ltv-chart"
import { CustomerSatisfactionRadarChart } from "@/components/dashboard/customer-satisfaction-radar-chart"

export default function DashboardPageTwo() {
  return (
    <div className="space-y-6">
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
