"use client"

import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useCustomerSegments } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  VIP: {
    label: "VIP",
    color: "#8b5cf6",
  },
  Regular: {
    label: "Regular",
    color: "#3b82f6",
  },
  New: {
    label: "New",
    color: "#10b981",
  },
  "At Risk": {
    label: "At Risk",
    color: "#ef4444",
  },
} satisfies ChartConfig

const COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#ef4444",
]

export function CustomerSegmentsChart() {
  const { data, isLoading, error } = useCustomerSegments()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>Distribution by customer type</CardDescription>
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
          <CardTitle>Customer Segments</CardTitle>
          <CardDescription>Distribution by customer type</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load customer segments data
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segments</CardTitle>
        <CardDescription>Distribution by customer type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => (
                    <>
                      <div className="flex items-center gap-2">
                        <span>{name}</span>
                        <span className="font-medium">
                          {value} ({item.payload.percentage}%)
                        </span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="segment"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ percentage }) => `${percentage}%`}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="segment" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
