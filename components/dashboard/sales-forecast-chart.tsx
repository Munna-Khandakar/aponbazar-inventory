"use client"

import { Area, ComposedChart, CartesianGrid, Line, ReferenceLine, XAxis, YAxis } from "recharts"
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
  actual: {
    label: "Actual Sales",
    color: "#2563eb",
  },
  predicted: {
    label: "Predicted Sales",
    color: "#f97316",
  },
  confidenceRange: {
    label: "90% Confidence",
    color: "#93c5fd",
  },
} satisfies ChartConfig

export function SalesForecastChart() {
  const { data } = useSalesForecast()
  const chartData =
    data?.map((point) => {
      const low = point.confidence_low ?? Math.round(point.predicted * 0.96)
      const high = point.confidence_high ?? Math.round(point.predicted * 1.04)
      return {
        ...point,
        confidenceBase: low,
        confidenceRange: Math.max(high - low, 0),
      }
    }) ?? []
  const projectionStart = chartData.find((point) => typeof point.actual !== "number")?.month

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Sales Forecast</CardTitle>
          <CardDescription>Actuals vs projections with 90% confidence band</CardDescription>
        </div>
        <p className="text-xs text-muted-foreground">
          Scenario assumes base merchandising calendar without weather disruption.
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart data={chartData}>
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
                  formatter={(value, name, item) => {
                    if (name === "confidenceRange") {
                      const low = item?.payload?.confidenceBase ?? 0
                      const high = low + Number(value)
                      return (
                        <div className="flex flex-col">
                          <span>Low: ${low.toLocaleString()}</span>
                          <span>High: ${high.toLocaleString()}</span>
                        </div>
                      )
                    }
                    return `$${Number(value).toLocaleString()}`
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {projectionStart ? (
              <ReferenceLine
                x={projectionStart}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                label={{
                  value: "Projection window",
                  position: "insideTopRight",
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
            ) : null}
            <Area
              type="monotone"
              dataKey="confidenceBase"
              stackId="confidence"
              stroke="transparent"
              fill="transparent"
              activeDot={false}
              isAnimationActive={false}
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="confidenceRange"
              stackId="confidence"
              stroke="none"
              fill="var(--color-confidenceRange)"
              fillOpacity={0.25}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--color-actual)"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="var(--color-predicted)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
