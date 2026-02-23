"use client"

import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { StackedBarChartProps } from "@/features/inventory-management/types/StackedBarChartProps"
import { formatNumber } from "@/features/inventory-management/utils/formatNumber"

const DEFAULT_HEIGHT = 320
const DEFAULT_STACK_ID = "stack"
const DEFAULT_LINE_STROKE_WIDTH = 3

const buildChartConfig = <TData extends object>(
  series: StackedBarChartProps<TData>["series"],
  lineSeries?: StackedBarChartProps<TData>["lineSeries"]
): ChartConfig => {
  const chartConfig: ChartConfig = {}

  series.forEach((seriesItem) => {
    chartConfig[seriesItem.key] = {
      label: seriesItem.label,
      color: seriesItem.color,
    }
  })

  if (lineSeries) {
    chartConfig[lineSeries.key] = {
      label: lineSeries.label,
      color: lineSeries.color,
    }
  }

  return chartConfig
}

const normalizeChartData = <TData extends object>(
  rawData: TData[],
  positiveSeriesKeys: (keyof TData & string)[],
  negativeSeriesKeys: (keyof TData & string)[]
): TData[] => {
  if (!positiveSeriesKeys.length && !negativeSeriesKeys.length) {
    return rawData
  }

  return rawData.map((dataPoint) => {
    const normalizedPoint = { ...dataPoint } as Record<string, unknown>

    positiveSeriesKeys.forEach((seriesKey) => {
      const seriesValue = normalizedPoint[seriesKey]

      if (typeof seriesValue === "number") {
        normalizedPoint[seriesKey] = Math.abs(seriesValue)
      }
    })

    negativeSeriesKeys.forEach((seriesKey) => {
      const seriesValue = normalizedPoint[seriesKey]

      if (typeof seriesValue === "number") {
        normalizedPoint[seriesKey] = -Math.abs(seriesValue)
      }
    })

    return normalizedPoint as TData
  })
}

export function StackedBarChart<TData extends object>({
  data,
  xKey,
  series,
  lineSeries,
  positiveSeriesKeys = [],
  negativeSeriesKeys = [],
  height = DEFAULT_HEIGHT,
  showLegend = true,
  showGrid = true,
  valueFormatter = formatNumber,
}: StackedBarChartProps<TData>) {
  const chartConfig = buildChartConfig(series, lineSeries)
  const normalizedData = normalizeChartData(data, positiveSeriesKeys, negativeSeriesKeys)

  return (
    <ChartContainer config={chartConfig} className="aspect-auto w-full" style={{ height }}>
      <ComposedChart data={normalizedData} barGap={6} barCategoryGap="16%">
        {showGrid ? <CartesianGrid vertical={false} strokeDasharray="3 3" /> : null}
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => valueFormatter(Number(value))}
        />
        <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="4 4" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => {
                const dataKey = String(item.dataKey ?? "")
                const numericValue = Number(value)
                const isNegativeSeries = negativeSeriesKeys.includes(dataKey as keyof TData & string)

                return valueFormatter(isNegativeSeries ? Math.abs(numericValue) : numericValue)
              }}
            />
          }
        />
        {showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null}
        {series.map((seriesItem) => (
          <Bar
            key={seriesItem.key}
            dataKey={seriesItem.key}
            stackId={seriesItem.stackId ?? DEFAULT_STACK_ID}
            fill={`var(--color-${seriesItem.key})`}
            radius={
              negativeSeriesKeys.includes(seriesItem.key)
                ? [0, 0, 4, 4]
                : [4, 4, 0, 0]
            }
            barSize={20}
          />
        ))}
        {lineSeries ? (
          <Line
            type="monotone"
            dataKey={lineSeries.key}
            stroke={`var(--color-${lineSeries.key})`}
            strokeWidth={DEFAULT_LINE_STROKE_WIDTH}
            dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
            activeDot={{ r: 6 }}
          />
        ) : null}
      </ComposedChart>
    </ChartContainer>
  )
}
