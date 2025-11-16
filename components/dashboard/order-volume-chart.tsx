"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useOrderVolume } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

export function OrderVolumeChart() {
  const { data, isLoading, error } = useOrderVolume()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Volume</CardTitle>
          <CardDescription>Monthly order fulfillment trend</CardDescription>
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
          <CardTitle>Order Volume</CardTitle>
          <CardDescription>Monthly order fulfillment trend</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load order volume data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Volume</CardTitle>
        <CardDescription>Monthly order fulfillment trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={data}>
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
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Month: ${value}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="var(--color-orders)"
              fill="var(--color-orders)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
