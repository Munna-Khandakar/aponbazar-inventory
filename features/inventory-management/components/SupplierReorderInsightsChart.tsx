"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useDemandForecast } from "@/hooks/use-dashboard"

const chartConfig = {
  predictedDemand: {
    label: "Predicted Demand",
    color: "#c55bff",
  },
  recommendedOrder: {
    label: "Reorder Qty",
    color: "#22c7ff",
  },
} satisfies ChartConfig

const formatCompactNumber = (value: number) => {
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toLocaleString("en-BD")
}

const truncateLabel = (value: string) => (value.length > 10 ? `${value.slice(0, 10)}...` : value)

export function SupplierReorderInsightsChart() {
  const { data, isLoading, error } = useDemandForecast()

  const chartData = [...(data ?? [])]
    .filter((row) => row.recommendedOrder > 0)
    .sort((left, right) => right.recommendedOrder - left.recommendedOrder)
    .slice(0, 6)
    .map((row) => ({
      label: row.sku,
      predictedDemand: row.predictedDemand,
      recommendedOrder: row.recommendedOrder,
    }))

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <div>
            <CardTitle>Supplier &amp; Reorder Insights</CardTitle>
            <CardDescription>
              Identify supplier dependencies, lead time risks, and reorder schedule
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Loading reorder insights...
          </div>
        ) : error ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-destructive">
            Failed to load reorder insights.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={truncateLabel}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactNumber(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `SKU: ${value}`}
                    formatter={(value) => formatCompactNumber(Number(value))}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="predictedDemand"
                fill="var(--color-predictedDemand)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="recommendedOrder"
                fill="var(--color-recommendedOrder)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
