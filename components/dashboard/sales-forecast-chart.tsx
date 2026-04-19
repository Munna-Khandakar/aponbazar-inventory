"use client"

import type { SVGProps } from "react"
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
  predictedSalesLine: {
    label: "Predicted Gross Sales",
    color: "#16a34a",
  },
} satisfies ChartConfig

const formatBdt = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`

const getGranularityLabel = (granularity?: string) => {
  switch (granularity?.toUpperCase()) {
    case "WEEK":
      return "Weekly"
    case "DAY":
      return "Daily"
    case "MONTH":
      return "Monthly"
    default:
      return "Period"
  }
}

const getPeriodTickLines = (value: string) => {
  const normalizedValue = value.replace(/\s+/g, " ").trim()
  const weekMatch = normalizedValue.match(/^(\d{4})-W(\d{1,2})$/)

  if (weekMatch) {
    const [, year, week] = weekMatch
    return [year, `W${week}`]
  }

  const parts = normalizedValue.split(" ")

  if (parts.length >= 2) {
    return [parts[0], parts.slice(1).join(" ")]
  }

  return [normalizedValue]
}

type PeriodAxisTickProps = SVGProps<SVGTextElement> & {
  x?: number
  y?: number
  payload?: {
    value: string
  }
}

const PeriodAxisTick = ({ x = 0, y = 0, payload }: PeriodAxisTickProps) => {
  if (!payload?.value) {
    return null
  }

  const [lineOne, lineTwo] = getPeriodTickLines(payload.value)

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="currentColor"
        className="fill-muted-foreground text-[11px]"
      >
        <tspan x={0}>{lineOne}</tspan>
        {lineTwo ? <tspan x={0} dy={12}>{lineTwo}</tspan> : null}
      </text>
    </g>
  )
}

export function SalesForecastChart() {
  const { data, isLoading, isFetching, error } = useSalesForecast()
  const chartData = data?.points ?? []
  const showLoadingState = isLoading || isFetching
  const granularityLabel = getGranularityLabel(data?.granularity)

  return (
    <Card className="max-h-[520px] overflow-hidden">
      <CardHeader className="flex flex-col justify-between align-items-center">
        <CardTitle className="flex items-center justify-between gap-2 w-full">
          <span className="font-bold">Sales Forecast</span>
          <span className="rounded border px-2 py-1 text-xs">{granularityLabel}</span>
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Actual, target, and predicted sales comparison using the report executor periods
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showLoadingState ? (
          <SalesForecastChartSkeleton />
        ) : error ? (
          <div className="flex h-[320px] items-center justify-center text-sm text-destructive sm:h-[360px] xl:h-[380px]">
            Failed to load sales forecast data
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[320px] w-full aspect-auto sm:h-[360px] xl:h-[380px]"
          >
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5} />
              <XAxis
                dataKey="periodLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                interval={0}
                height={52}
                tick={<PeriodAxisTick />}
              />
              <YAxis
                width={110}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={(value) => formatBdt(Number(value))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Period: ${value}`}
                    formatter={(value, name, item) => (
                      <div className="flex min-w-[220px] items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-muted-foreground">
                            {chartConfig[name as keyof typeof chartConfig]?.label ?? name}
                          </span>
                        </div>
                        <span className="font-mono font-medium text-foreground">
                          {formatBdt(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="forecastedSales"
                stroke="var(--color-forecastedSales)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="6 4"
              />
              <Line
                type="monotone"
                dataKey="predictedSalesLine"
                stroke="var(--color-predictedSalesLine)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="actualSales"
                stroke="var(--color-actualSales)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
