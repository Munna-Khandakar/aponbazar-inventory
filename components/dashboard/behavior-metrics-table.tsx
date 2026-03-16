"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useBehaviorMetrics } from "@/hooks/use-dashboard"
import { ArrowDown, ArrowUp, Minus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function BehaviorMetricsTable() {
  const { data, isLoading, error } = useBehaviorMetrics()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Behavior Metrics</CardTitle>
          <CardDescription>Key engagement and retention indicators</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Behavior Metrics</CardTitle>
          <CardDescription>Key engagement and retention indicators</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load behavior metrics data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Behavior Metrics</CardTitle>
        <CardDescription>Key engagement and retention indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Metric</th>
                <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">
                  Current Value
                </th>
                <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">Change</th>
                <th className="pb-3 text-left font-medium text-muted-foreground">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((row, index) => (
                <tr
                  key={row.metric}
                  className={cn(
                    "border-b border-border/50",
                    index === data.length - 1 && "border-b-0"
                  )}
                >
                  <td className="py-3 pr-4 font-medium">{row.metric}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{row.value}</td>
                  <td className="py-3 pr-4 text-right">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 font-medium tabular-nums",
                        row.trend === "up" && "text-green-600",
                        row.trend === "down" && "text-red-600",
                        row.trend === "stable" && "text-muted-foreground"
                      )}
                    >
                      {row.trend === "up" && <ArrowUp className="h-3 w-3" />}
                      {row.trend === "down" && <ArrowDown className="h-3 w-3" />}
                      {row.trend === "stable" && <Minus className="h-3 w-3" />}
                      <span>{row.change}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{row.prediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
