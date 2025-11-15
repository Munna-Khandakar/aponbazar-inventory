"use client"

import { Loader2 } from "lucide-react"

import { AlertList } from "@/components/dashboard/alert-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePageTwoAlerts } from "@/hooks/use-dashboard"

export default function DashboardPageTwo() {
  const { data, isLoading, isError } = usePageTwoAlerts()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform signals</CardTitle>
          <CardDescription>Placeholder alerts piped via React Query and the dashboard service.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This page exercises the same service + hook flow as the rest of the dashboard but focuses on severity based alerting.
          In production you would hydrate these hooks from your observability pipeline or message bus.
        </CardContent>
      </Card>
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="animate-spin" size={18} />
            Checking alert feed...
          </CardContent>
        </Card>
      ) : isError || !data ? (
        <Card>
          <CardContent className="py-10 text-sm font-medium text-destructive">
            Could not load alerts. Please refresh.
          </CardContent>
        </Card>
      ) : (
        <AlertList alerts={data.alerts} />
      )}
    </div>
  )
}
