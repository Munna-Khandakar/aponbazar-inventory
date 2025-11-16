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
import { useChurnPrediction } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  actual_churn: {
    label: "Actual Churn",
    color: "#ef4444",
  },
  predicted_churn: {
    label: "Predicted Churn",
    color: "#f59e0b",
  },
} satisfies ChartConfig

export function ChurnPredictionChart() {
  const { data, isLoading, error } = useChurnPrediction()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Churn Rate Prediction</CardTitle>
          <CardDescription>Predicted vs Actual customer churn rate (%)</CardDescription>
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
          <CardTitle>Churn Rate Prediction</CardTitle>
          <CardDescription>Predicted vs Actual customer churn rate (%)</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load churn prediction data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Rate Prediction</CardTitle>
        <CardDescription>Predicted vs Actual customer churn rate (%)</CardDescription>
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
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Month: ${value}`}
                  formatter={(value) => `${value}%`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="actual_churn"
              stroke="var(--color-actual_churn)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="predicted_churn"
              stroke="var(--color-predicted_churn)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
