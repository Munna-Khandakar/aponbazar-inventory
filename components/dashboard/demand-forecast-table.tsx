"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDemandForecast } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function DemandForecastTable() {
  const { data, isLoading, error } = useDemandForecast()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast</CardTitle>
          <CardDescription>SKU-level demand predictions and recommendations</CardDescription>
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
          <CardTitle>Demand Forecast</CardTitle>
          <CardDescription>SKU-level demand predictions and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load demand forecast data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Forecast</CardTitle>
        <CardDescription>SKU-level demand predictions and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">SKU</th>
                <th className="pb-3 pr-4 text-left font-medium text-muted-foreground">Product</th>
                <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">
                  Current Stock
                </th>
                <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">
                  Predicted Demand
                </th>
                <th className="pb-3 pr-4 text-right font-medium text-muted-foreground">
                  Recommended Order
                </th>
                <th className="pb-3 text-center font-medium text-muted-foreground">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((row, index) => (
                <tr
                  key={row.sku}
                  className={cn(
                    "border-b border-border/50",
                    index === data.length - 1 && "border-b-0"
                  )}
                >
                  <td className="py-3 pr-4 font-mono text-xs">{row.sku}</td>
                  <td className="py-3 pr-4">{row.product}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">{row.currentStock}</td>
                  <td className="py-3 pr-4 text-right font-medium tabular-nums">
                    {row.predictedDemand}
                  </td>
                  <td
                    className={cn(
                      "py-3 pr-4 text-right font-medium tabular-nums",
                      row.recommendedOrder > 0 ? "text-orange-600" : ""
                    )}
                  >
                    {row.recommendedOrder > 0 ? `+${row.recommendedOrder}` : "-"}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                        row.confidence === "high" && "bg-green-100 text-green-700",
                        row.confidence === "medium" && "bg-yellow-100 text-yellow-700",
                        row.confidence === "low" && "bg-red-100 text-red-700"
                      )}
                    >
                      {row.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
