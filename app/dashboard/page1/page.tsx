"use client"

import { Loader2 } from "lucide-react"

import { InsightList } from "@/components/dashboard/insight-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePageOneItems } from "@/hooks/use-dashboard"

export default function DashboardPageOne() {
  const { data, isLoading, isError } = usePageOneItems()

  return (
    <div className="space-y-6">
      <Card className="border border-dashed border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Workflow queue</CardTitle>
          <CardDescription>This view highlights the operational checklists your team should review next.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Every item below is hard-coded inside `dashboardService.getPageOneItems` while the backend is under construction,
          so you can wire a real API later without touching this component tree.
        </CardContent>
      </Card>
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center gap-2 py-10 text-muted-foreground">
            <Loader2 className="animate-spin" size={18} />
            Loading tasks...
          </CardContent>
        </Card>
      ) : isError || !data ? (
        <Card>
          <CardContent className="py-10 text-sm font-medium text-destructive">
            Unable to fetch the workflow queue. Refresh to retry.
          </CardContent>
        </Card>
      ) : (
        <InsightList insights={data.items} />
      )}
    </div>
  )
}
