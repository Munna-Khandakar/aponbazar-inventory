"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  ShopPerformanceSummaryMonthOverview,
  ShopPerformanceSummaryNextMonth,
} from "@/lib/types/dashboard"

const performanceChartConfig = {
  actualSales: {
    label: "Actual Sales",
    color: "#2563eb",
  },
  target: {
    label: "Target",
    color: "#65a30d",
  },
  forecast: {
    label: "Forecast",
    color: "#d97706",
  },
} satisfies ChartConfig

const formatBdtValue = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 6,
  })}`

type ShopPerformanceSummaryBarChartProps = {
  prevMonth: ShopPerformanceSummaryMonthOverview
  currentMonth: ShopPerformanceSummaryCurrentMonth
  nextMonth: ShopPerformanceSummaryNextMonth
}

export function ShopPerformanceSummaryBarChart({
  prevMonth,
  currentMonth,
  nextMonth,
}: ShopPerformanceSummaryBarChartProps) {
  const chartData = [
    {
      label: prevMonth.periodLabel,
      actualSales: prevMonth.actualSales,
      target: prevMonth.target,
      forecast: prevMonth.forecast,
    },
    {
      label: `${currentMonth.periodLabel} Completed`,
      actualSales: currentMonth.completed.actualSales,
      target: currentMonth.completed.target,
      forecast: currentMonth.completed.forecast,
    },
    {
      label: `${currentMonth.periodLabel} Remaining`,
      actualSales: null,
      target: currentMonth.remaining.target,
      forecast: currentMonth.remaining.forecast,
    },
    {
      label: nextMonth.periodLabel,
      actualSales: null,
      target: nextMonth.target,
      forecast: nextMonth.forecast,
    },
  ]

  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Monthly Sales vs Target vs Forecast</h3>
      </div>
      <ChartContainer
        config={performanceChartConfig}
        className="h-[320px] w-full aspect-auto xl:h-[360px]"
      >
        <BarChart data={chartData} barGap={10} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval={0}
            height={56}
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
                labelFormatter={(value) => String(value)}
                formatter={(value, name) =>
                  value === null || value === undefined
                    ? "N/A"
                    : `${String(name)}: ${formatBdtValue(Number(value))}`
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="actualSales" fill="var(--color-actualSales)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="forecast" fill="var(--color-forecast)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
