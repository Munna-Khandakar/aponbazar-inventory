"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDemandForecast } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

const getDaysUntilStockout = (currentStock: number, predictedDemand: number) => {
  if (predictedDemand <= 0) return 30
  return Math.max(1, Math.round((currentStock / predictedDemand) * 30))
}

export function ProductLevelForecastPanel() {
  const { data, isLoading, error } = useDemandForecast()

  const rows = [...(data ?? [])]
    .sort(
      (left, right) =>
        right.predictedDemand -
        right.currentStock -
        (left.predictedDemand - left.currentStock)
    )
    .slice(0, 5)

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            3
          </span>
          <div>
            <CardTitle>Product-Level Forecast</CardTitle>
            <CardDescription>
              Data-driven actionable list view with sorting and drilldown options,
              starting with focus products first
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
            Loading product-level forecast...
          </div>
        ) : error ? (
          <div className="flex h-[240px] items-center justify-center text-sm text-destructive">
            Failed to load product-level forecast data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border/70 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 text-left font-medium">Product</th>
                  <th className="pb-3 text-right font-medium">Current</th>
                  <th className="pb-3 text-right font-medium">Predicted</th>
                  <th className="pb-3 text-right font-medium">Days Left</th>
                  <th className="pb-3 text-right font-medium">Reorder</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const daysUntilStockout = getDaysUntilStockout(
                    row.currentStock,
                    row.predictedDemand
                  )

                  return (
                    <tr
                      key={row.sku}
                      className={cn(
                        "border-b border-border/50 last:border-b-0",
                        index === 0 && "bg-amber-50/60"
                      )}
                    >
                      <td className="py-3 pr-3">
                        <div className="font-medium text-foreground">{row.product}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                          {row.sku}
                        </div>
                      </td>
                      <td className="py-3 text-right tabular-nums text-muted-foreground">
                        {row.currentStock.toLocaleString("en-BD")}
                      </td>
                      <td className="py-3 text-right font-medium tabular-nums text-foreground">
                        {row.predictedDemand.toLocaleString("en-BD")}
                      </td>
                      <td className="py-3 text-right tabular-nums text-muted-foreground">
                        {daysUntilStockout}d
                      </td>
                      <td className="py-3 text-right font-medium tabular-nums text-cyan-600">
                        +{row.recommendedOrder.toLocaleString("en-BD")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
