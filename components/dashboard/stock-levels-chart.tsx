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
import { useStockLevels } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  inStock: {
    label: "In Stock",
    color: "#10b981",
  },
  lowStock: {
    label: "Low Stock",
    color: "#f59e0b",
  },
  outOfStock: {
    label: "Out of Stock",
    color: "#ef4444",
  },
} satisfies ChartConfig

export function StockLevelsChart() {
  const { data, isLoading, error } = useStockLevels()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>Current inventory status by category</CardDescription>
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
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>Current inventory status by category</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load stock levels data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Levels</CardTitle>
        <CardDescription>Current inventory status by category</CardDescription>
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
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="inStock" fill="var(--color-inStock)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lowStock" fill="var(--color-lowStock)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outOfStock" fill="var(--color-outOfStock)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
