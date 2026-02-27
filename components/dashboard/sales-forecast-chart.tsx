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
import { useSalesForecast } from "@/hooks/use-dashboard"

const chartConfig = {
  actualSales: {
    label: "Actual Sales",
    color: "#2563eb",
  },
  forecastedSales: {
    label: "Forecasted Sales",
    color: "#f97316",
  },
  targetedSales: {
    label: "Targeted Sales",
    color: "#10b981",
  },
} satisfies ChartConfig

const formatBdtCompact = (value: number) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)}L`
  return `৳${value.toLocaleString("en-BD")}`
}

const formatBdt = (value: number) => `৳${value.toLocaleString("en-BD")}`

export function SalesForecastChart() {
  const { data } = useSalesForecast()

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Sales Forecast</CardTitle>
          <CardDescription>Actuals vs predicted trend and target baseline</CardDescription>
        </div>
        <p className="text-xs text-muted-foreground">
          Scenario assumes base merchandising calendar without weather disruption.
        </p>
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
              tickFormatter={(value) => formatBdtCompact(Number(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Month: ${value}`}
                  formatter={(value) => formatBdt(Number(value))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="actualSales"
              stroke="var(--color-actualSales)"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="forecastedSales"
              stroke="var(--color-forecastedSales)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="targetedSales"
              stroke="var(--color-targetedSales)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
