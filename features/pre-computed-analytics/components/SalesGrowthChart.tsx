"use client"

import { useState } from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useReportFilters } from "@/hooks/use-report-filters"

import type { SalesChartPoint } from "../types/PreComputedDashboard"

const chartConfig = {
  momGrowth: { label: "MoM Growth (%)", color: "#16a34a" },
  yoyGrowth: { label: "YoY Growth (%)", color: "#7c3aed" },
} satisfies ChartConfig

type ViewMode = "mom" | "yoy" | "both"

const views: { value: ViewMode; label: string }[] = [
  { value: "mom", label: "MoM" },
  { value: "yoy", label: "YoY" },
  { value: "both", label: "Both" },
]

function formatPctTick(value: number) {
  return `${value}%`
}

type Props = {
  data: SalesChartPoint[]
  isLoading: boolean
}

export function SalesGrowthChart({ data, isLoading }: Props) {
  const [view, setView] = useState<ViewMode>("both")
  const { shopName } = useReportFilters()

  const showMom = view === "mom" || view === "both"
  const showYoy = view === "yoy" || view === "both"

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Sales Growth (MoM / YoY)</CardTitle>
            <CardDescription className="mt-1">
              {shopName || "All Outlets"} · Since Jan 2022
            </CardDescription>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xs text-muted-foreground">View</span>
            <div className="inline-flex rounded-lg border border-border/70 bg-muted/30 p-0.5">
              {views.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setView(option.value)}
                  className={
                    view === option.value
                      ? "rounded-md bg-background px-3 py-1 text-xs font-medium text-foreground shadow-sm"
                      : "rounded-md px-3 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[340px] w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
            No sales data available.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[340px] w-full">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="monthLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={48}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatPctTick}
                width={48}
                tick={{ fontSize: 11 }}
              />
              <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      value == null ? "—" : `${Number(value).toFixed(1)}%`,
                      chartConfig[name as keyof typeof chartConfig]?.label ?? name,
                    ]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {showMom ? (
                <Line
                  dataKey="momGrowth"
                  stroke="var(--color-momGrowth)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ) : null}
              {showYoy ? (
                <Line
                  dataKey="yoyGrowth"
                  stroke="var(--color-yoyGrowth)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ) : null}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
