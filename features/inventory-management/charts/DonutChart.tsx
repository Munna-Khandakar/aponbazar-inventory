"use client"

import { Pie, PieChart, Cell } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { DonutChartProps } from "@/features/inventory-management/types/DonutChartProps"
import { formatNumber } from "@/features/inventory-management/utils/formatNumber"

const DEFAULT_HEIGHT = 320
const DEFAULT_INNER_RADIUS = 70
const DEFAULT_OUTER_RADIUS = 105
const DEFAULT_COLORS = ["#14b8a6", "#06b6d4", "#f97316", "#8b5cf6", "#84cc16", "#ef4444"]

const emptyChartConfig: ChartConfig = {}

const getSliceColor = <TData extends object>(
  item: TData,
  index: number,
  colorKey: DonutChartProps<TData>["colorKey"],
  colors: string[]
) => {
  if (!colorKey) {
    return colors[index % colors.length]
  }

  const colorValue = item[colorKey]

  if (typeof colorValue === "string" && colorValue.length > 0) {
    return colorValue
  }

  return colors[index % colors.length]
}

const totalValue = <TData extends object>(
  data: TData[],
  valueKey: DonutChartProps<TData>["valueKey"]
) => {
  return data.reduce((total, item) => {
    return total + Number(item[valueKey])
  }, 0)
}

export function DonutChart<TData extends object>({
  data,
  nameKey,
  valueKey,
  colorKey,
  colors = DEFAULT_COLORS,
  height = DEFAULT_HEIGHT,
  innerRadius = DEFAULT_INNER_RADIUS,
  outerRadius = DEFAULT_OUTER_RADIUS,
  centerLabel,
  showLegend = true,
  valueFormatter = formatNumber,
}: DonutChartProps<TData>) {
  const total = totalValue(data, valueKey)

  return (
    <div>
      <div className="relative">
        <ChartContainer config={emptyChartConfig} className="aspect-auto w-full" style={{ height }}>
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => String(label)}
                  formatter={(value) => {
                    return valueFormatter(Number(value))
                  }}
                />
              }
            />
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`slice-${index}`} fill={getSliceColor(entry, index, colorKey, colors)} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {centerLabel ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-border/60 bg-background/95 px-4 py-2 text-center shadow-sm backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{centerLabel.label}</p>
              <p className="font-mono text-xl font-semibold tabular-nums text-foreground">{centerLabel.value}</p>
            </div>
          </div>
        ) : null}
      </div>

      {showLegend ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {data.map((entry, index) => {
            const label = String(entry[nameKey])
            const value = Number(entry[valueKey])
            const sliceColor = getSliceColor(entry, index, colorKey, colors)
            const percentage = total > 0 ? (value / total) * 100 : 0

            return (
              <div
                key={`${label}-${index}`}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sliceColor }} />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
                <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground">
                  {valueFormatter(value)} ({percentage.toFixed(1)}%)
                </span>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
