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
import { useCustomerLTV } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  current_ltv: {
    label: "Current LTV",
    color: "#06b6d4",
  },
  predicted_ltv: {
    label: "Predicted LTV",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

export function CustomerLTVChart() {
  const { data, isLoading, error } = useCustomerLTV()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Lifetime Value</CardTitle>
          <CardDescription>Current vs Predicted LTV by segment ($)</CardDescription>
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
          <CardTitle>Customer Lifetime Value</CardTitle>
          <CardDescription>Current vs Predicted LTV by segment ($)</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load customer LTV data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Lifetime Value</CardTitle>
        <CardDescription>Current vs Predicted LTV by segment ($)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="segment"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="current_ltv" fill="var(--color-current_ltv)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="predicted_ltv" fill="var(--color-predicted_ltv)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
