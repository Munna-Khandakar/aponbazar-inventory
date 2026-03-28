"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { SalesForecastChartSkeleton } from "@/components/dashboard/report-skeletons"
import { useSalesForecast } from "@/hooks/use-dashboard"

const chartConfig = {
  actualSales: {
    label: "Actual Sales",
    color: "#2563eb",
  },
  forecastedSales: {
    label: "Targeted Sales",
    color: "#f97316",
  },
} satisfies ChartConfig

const formatBdtCompact = (value: number) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)}L`
  return `৳${value.toLocaleString("en-BD")}`
}

const formatBdt = (value: number) => `৳${value.toLocaleString("en-BD")}`
const formatPeriodTick = (value: string) => value.split(" ")[0].slice(0, 3)

export function SalesForecastChart() {
  const { data, isLoading, isFetching, error } = useSalesForecast()
  const chartData = data ?? []
  const showLoadingState = isLoading || isFetching

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between align-items-center">
         <CardTitle className='flex items-center gap-2 justify-between w-full'>
             <span className="font-bold">Sales Forecast</span>
             <span className="border px-2 py-1 rounded text-xs">Monthly</span>
         </CardTitle>
          <CardDescription className="text-sm text-gray-500">Actual Sales, Target Sales Comparism in line chart</CardDescription>
      </CardHeader>
      <CardContent>
        {showLoadingState ? (
          <SalesForecastChartSkeleton />
        ) : error ? (
          <div className="flex aspect-video items-center justify-center text-sm text-destructive">
            Failed to load sales forecast data
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="periodLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={formatPeriodTick}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatBdtCompact(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Period: ${value}`}
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
                strokeDasharray="6 4"
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
