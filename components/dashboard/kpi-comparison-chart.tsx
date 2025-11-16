"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useKPIComparison } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  current: {
    label: "Current Period",
    color: "#06b6d4",
  },
  previous: {
    label: "Previous Period",
    color: "#f59e0b",
  },
} satisfies ChartConfig

export function KPIComparisonChart() {
  const { data, isLoading, error } = useKPIComparison()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KPI Comparison</CardTitle>
          <CardDescription>Current vs Previous Period</CardDescription>
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
          <CardTitle>KPI Comparison</CardTitle>
          <CardDescription>Current vs Previous Period</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load KPI data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>KPI Comparison</CardTitle>
        <CardDescription>Current vs Previous Period</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `${value}`}
                  formatter={(value) => Number(value).toLocaleString()}
                />
              }
            />
            <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="previous" fill="var(--color-previous)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
