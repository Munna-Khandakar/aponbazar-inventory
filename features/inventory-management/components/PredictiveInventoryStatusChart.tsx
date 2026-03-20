"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useInventoryPrediction } from "@/hooks/use-dashboard"

const chartConfig = {
  availableStock: {
    label: "Available Stock",
    color: "#b9ea62",
  },
  predictedDemand: {
    label: "Predicted Demand",
    color: "#29c5ff",
  },
  reorderThreshold: {
    label: "Reorder Threshold",
    color: "#b35dff",
  },
} satisfies ChartConfig

const formatCompactNumber = (value: number) => {
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString("en-BD")
}

export function PredictiveInventoryStatusChart() {
  const { data, isLoading, error } = useInventoryPrediction()

  const chartData = (data ?? []).map((row) => {
    const availableStock =
      row.electronics + row.clothing + row.groceries + row.homeGoods

    return {
      period: row.month,
      availableStock,
      predictedDemand: Math.round(availableStock * 0.68),
      reorderThreshold: Math.round(availableStock * 0.3),
    }
  })

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
            2
          </span>
          <div>
            <CardTitle>Predictive Inventory Status (Main Visualization)</CardTitle>
            <CardDescription>
              Predicted Demand, Available Stock, Reorder Threshold over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[380px] items-center justify-center text-sm text-muted-foreground">
            Loading predictive inventory status...
          </div>
        ) : error ? (
          <div className="flex h-[380px] items-center justify-center text-sm text-destructive">
            Failed to load predictive inventory status data.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[380px] w-full">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: -20 }}>
              <defs>
                <linearGradient id="availableStockFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-availableStock)" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="var(--color-availableStock)" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="predictedDemandFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-predictedDemand)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-predictedDemand)" stopOpacity={0.06} />
                </linearGradient>
                <linearGradient id="reorderThresholdFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-reorderThreshold)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--color-reorderThreshold)" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactNumber(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Period: ${value}`}
                    formatter={(value) => formatCompactNumber(Number(value))}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="reorderThreshold"
                stroke="var(--color-reorderThreshold)"
                fill="url(#reorderThresholdFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="predictedDemand"
                stroke="var(--color-predictedDemand)"
                fill="url(#predictedDemandFill)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="availableStock"
                stroke="var(--color-availableStock)"
                fill="url(#availableStockFill)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
