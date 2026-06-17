"use client"

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

import type { SalesChartPoint } from "../types/PreComputedDashboard"

const chartConfig = {
  netSales: { label: "Net Sales", color: "#2563eb" },
  predictedSales: { label: "Predicted Sales", color: "#f59e0b" },
  predictedMargin: { label: "Predicted Margin", color: "#10b981" },
} satisfies ChartConfig

function formatBdt(value: number) {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `৳${(value / 1_000).toFixed(0)}k`
  return `৳${value.toLocaleString("en-BD")}`
}

type Props = {
  data: SalesChartPoint[]
  isLoading: boolean
}

export function SalesGrowthChart({ data, isLoading }: Props) {
  const latest = [...data].reverse().find((p) => p.predictedSales != null)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Sales Growth — Month over Month</CardTitle>
            <CardDescription className="mt-1">
              Historical net sales since Jan 2022 with current-month predictions
            </CardDescription>
          </div>
          {latest ? (
            <div className="flex shrink-0 gap-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center">
                <p className="text-[11px] font-medium text-amber-700">Predicted Sales</p>
                <p className="text-sm font-semibold text-amber-900">
                  {latest.predictedSales != null ? formatBdt(latest.predictedSales) : "—"}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center">
                <p className="text-[11px] font-medium text-emerald-700">Predicted Margin</p>
                <p className="text-sm font-semibold text-emerald-900">
                  {latest.predictedMargin != null ? formatBdt(latest.predictedMargin) : "—"}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[360px] w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
            No sales data available.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[360px] w-full">
            <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={40}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatBdt}
                width={64}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      formatBdt(Number(value)),
                      chartConfig[name as keyof typeof chartConfig]?.label ?? name,
                    ]}
                  />
                }
              />
              <Bar dataKey="netSales" fill="var(--color-netSales)" radius={[3, 3, 0, 0]} maxBarSize={18} />
              <Line
                dataKey="predictedSales"
                stroke="var(--color-predictedSales)"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                connectNulls
              />
              <Line
                dataKey="predictedMargin"
                stroke="var(--color-predictedMargin)"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                connectNulls
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
