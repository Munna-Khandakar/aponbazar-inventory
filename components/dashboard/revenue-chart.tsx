"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useMonthlyRevenue } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#3b82f6",
  },
  target: {
    label: "Target",
    color: "#10b981",
  },
} satisfies ChartConfig

export function RevenueChart() {
  const { data, isLoading, error } = useMonthlyRevenue()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue vs Target (Last 6 Months)</CardDescription>
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
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Revenue vs Target (Last 6 Months)</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load revenue data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Revenue vs Target (Last 6 Months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Month: ${value}`}
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
