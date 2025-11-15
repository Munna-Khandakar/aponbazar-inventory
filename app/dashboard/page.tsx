"use client"

import { Loader2 } from "lucide-react"

import { AlertList } from "@/components/dashboard/alert-list"
import { InsightList } from "@/components/dashboard/insight-list"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ReminderList } from "@/components/dashboard/reminder-list"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboardStats, usePageTwoAlerts } from "@/hooks/use-dashboard"

export default function DashboardHomePage() {
  const { data, isLoading, isError } = useDashboardStats()
  const {
    data: alertData,
    isLoading: areAlertsLoading,
    isError: alertsError,
  } = usePageTwoAlerts()

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
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <InsightList insights={data.insights} />
        <ReminderList reminders={data.reminders} />
      </section>
      {areAlertsLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="animate-spin" size={18} />
            Loading recent alerts...
          </CardContent>
        </Card>
      ) : alertsError || !alertData ? (
        <Card>
          <CardContent className="py-8 text-sm font-medium text-destructive">
            Could not load alert summary.
          </CardContent>
        </Card>
      ) : (
        <AlertList alerts={alertData.alerts.slice(0, 2)} />
      )}
    </div>
  )
}
