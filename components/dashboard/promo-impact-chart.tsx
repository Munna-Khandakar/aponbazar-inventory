"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePromoImpact } from "@/hooks/use-dashboard"

const chartConfig = {
  actualSales: {
    label: "Actual Sales",
    color: "#0f766e",
  },
} satisfies ChartConfig

const formatBdtCompact = (value: number) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)}L`
  return `৳${value.toLocaleString("en-BD")}`
}

const formatBdt = (value: number) => `৳${value.toLocaleString("en-BD")}`
const formatPeriodTick = (value: string) => value.split(" ")[0].slice(0, 3)

export function PromoImpactChart() {
  const { data, isLoading } = usePromoImpact()
  const chartData = data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Wise Sales</CardTitle>
        <CardDescription>Actual net sales by month</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
            Loading shop wise sales...
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="periodLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={formatPeriodTick}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatBdtCompact(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Period: ${value}`}
                    formatter={(value) => formatBdt(Number(value))}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="actualSales"
                stroke="var(--color-actualSales)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
