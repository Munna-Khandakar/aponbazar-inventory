"use client"

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

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
  baseSales: {
    label: "Base Sales",
    color: "#94a3b8",
  },
  actualSales: {
    label: "Actual Sales",
    color: "#0f766e",
  },
  salesPerformance: {
    label: "Sales Performance",
    color: "#ea580c",
  },
} satisfies ChartConfig

const formatBdtCompact = (value: number) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)}L`
  return `৳${value.toLocaleString("en-BD")}`
}

const formatBdt = (value: number) => `৳${value.toLocaleString("en-BD")}`
const formatPerformance = (value: number) => `${value.toFixed(2)}%`
const formatShopTick = (value: string) =>
  value.length > 12 ? `${value.slice(0, 12)}…` : value

export function PromoImpactChart() {
  const { data, isLoading } = usePromoImpact()
  const chartData = data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Wise Sales</CardTitle>
        <CardDescription>Base sales, actual sales, and sales performance by shop</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
            Loading shop wise sales...
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[380px] w-full">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="shopName"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={18}
                tickFormatter={formatShopTick}
              />
              <YAxis
                yAxisId="sales"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatBdtCompact(Number(value))}
              />
              <YAxis
                yAxisId="performance"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Number(value)}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Shop: ${value}`}
                    formatter={(value, name) =>
                      name === "Sales Performance"
                        ? formatPerformance(Number(value))
                        : formatBdt(Number(value))
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                yAxisId="sales"
                dataKey="baseSales"
                fill="var(--color-baseSales)"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              <Bar
                yAxisId="sales"
                dataKey="actualSales"
                fill="var(--color-actualSales)"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              <Line
                yAxisId="performance"
                type="monotone"
                dataKey="salesPerformance"
                stroke="var(--color-salesPerformance)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                connectNulls={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
