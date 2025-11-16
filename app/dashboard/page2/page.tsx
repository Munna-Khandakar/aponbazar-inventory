"use client"

import { CustomerSegmentsChart } from "@/components/dashboard/customer-segments-chart"
import { ChurnPredictionChart } from "@/components/dashboard/churn-prediction-chart"
import { BehaviorMetricsTable } from "@/components/dashboard/behavior-metrics-table"
import { CustomerLTVChart } from "@/components/dashboard/customer-ltv-chart"
import { CustomerSatisfactionRadarChart } from "@/components/dashboard/customer-satisfaction-radar-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPageTwo() {
  return (
    <div className="space-y-6">
      <Card className="border border-dashed border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Predictive Customer Behavior Insights</CardTitle>
          <CardDescription>
            AI-driven analytics for customer engagement, retention, and lifetime value
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Understand your customers better with predictive insights on churn, segmentation, and behavior trends.
        </CardContent>
      </Card>

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
