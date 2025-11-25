"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useProductPerformance } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  score: {
    label: "Performance Score",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function ProductPerformanceRadarChart() {
  const { data, isLoading, error } = useProductPerformance()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Performance Metrics</CardTitle>
          <CardDescription>Multi-dimensional performance analysis</CardDescription>
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
          <CardTitle>Product Performance Metrics</CardTitle>
          <CardDescription>Multi-dimensional performance analysis</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load product performance data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance Metrics</CardTitle>
        <CardDescription>Multi-dimensional performance analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <RadarChart data={data}>
            <PolarGrid gridType="circle" className="stroke-border" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Radar
              dataKey="score"
              stroke="var(--color-score)"
              fill="var(--color-score)"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value) => `${value}/100`}
                />
              }
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
