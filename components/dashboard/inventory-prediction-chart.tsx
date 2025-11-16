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
import { useInventoryPrediction } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  electronics: {
    label: "Electronics",
    color: "#8b5cf6",
  },
  clothing: {
    label: "Clothing",
    color: "#ec4899",
  },
  groceries: {
    label: "Groceries",
    color: "#10b981",
  },
  homeGoods: {
    label: "Home Goods",
    color: "#f59e0b",
  },
} satisfies ChartConfig

export function InventoryPredictionChart() {
  const { data, isLoading, error } = useInventoryPrediction()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Prediction</CardTitle>
          <CardDescription>Predicted stock levels by category</CardDescription>
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
          <CardTitle>Inventory Prediction</CardTitle>
          <CardDescription>Predicted stock levels by category</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load inventory prediction data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Prediction</CardTitle>
        <CardDescription>Predicted stock levels by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data}>
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
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="electronics"
              stroke="var(--color-electronics)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="clothing"
              stroke="var(--color-clothing)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="groceries"
              stroke="var(--color-groceries)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="homeGoods"
              stroke="var(--color-homeGoods)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
