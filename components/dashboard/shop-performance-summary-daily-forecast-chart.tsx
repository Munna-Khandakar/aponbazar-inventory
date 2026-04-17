"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type {
  ShopPerformanceSummaryCurrentMonth,
  ShopPerformanceSummaryNextMonth,
} from "@/lib/types/dashboard"

const dailyForecastChartConfig = {
  predictedGrossSales: {
    label: "Daily Forecast",
    color: "#d97706",
  },
} satisfies ChartConfig

const formatBdtValue = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 6,
  })}`

const formatTickDate = (value: string) => {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-BD", {
    month: "short",
    day: "numeric",
  }).format(parsedDate)
}

type ShopPerformanceSummaryDailyForecastChartProps = {
  currentMonth: ShopPerformanceSummaryCurrentMonth
  nextMonth: ShopPerformanceSummaryNextMonth
}

export function ShopPerformanceSummaryDailyForecastChart({
  currentMonth,
  nextMonth,
}: ShopPerformanceSummaryDailyForecastChartProps) {
  const chartData = [
    ...currentMonth.remaining.forecastDayWise,
    ...nextMonth.forecastDayWise,
  ].map((point) => ({
    date: point.date,
    predictedGrossSales: point.predictedGrossSales,
  }))

  const firstDate = chartData[0]?.date
  const lastDate = chartData[chartData.length - 1]?.date
  const dateRangeLabel =
    firstDate && lastDate
      ? `${formatTickDate(firstDate)} to ${formatTickDate(lastDate)}`
      : currentMonth.remaining.label

  if (!chartData.length) {
    return (
      <div className="rounded-2xl border border-border/70 bg-background p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Daily Forecast
          </h3>
          <p className="text-sm text-muted-foreground">{dateRangeLabel}</p>
        </div>
        <div className="flex min-h-[260px] items-center justify-center text-sm text-muted-foreground">
          No daily forecast data is available.
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Daily Forecast</h3>
        <p className="text-sm text-muted-foreground">{dateRangeLabel}</p>
      </div>
      <ChartContainer
        config={dailyForecastChartConfig}
        className="h-[300px] w-full aspect-auto xl:h-[340px]"
      >
        <AreaChart data={chartData} margin={{ top: 8, right: 12, bottom: 8, left: 8 }}>
          <defs>
            <linearGradient id="dailyForecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-predictedGrossSales)" stopOpacity={0.32} />
              <stop offset="95%" stopColor="var(--color-predictedGrossSales)" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={24}
            tickFormatter={formatTickDate}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={96}
            tickFormatter={(value) => formatBdtValue(Number(value))}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => formatTickDate(String(value))}
                formatter={(value) => formatBdtValue(Number(value))}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            dataKey="predictedGrossSales"
            stroke="var(--color-predictedGrossSales)"
            strokeWidth={2.5}
            fill="url(#dailyForecastFill)"
            dot={{ r: 2.5 }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
