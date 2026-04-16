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
import { useInventoryBigBlockSeries } from "@/features/inventory-management/hooks/useInventoryBigBlockSeries"
import { formatDate } from "@/features/inventory-management/utils/formatDate"

type ChartDataPoint = {
  date: string
  [seriesKey: string]: number | string | undefined
}

type BlockLineConfig = {
  blockName: string
  actualKey: string
  predictedKey: string
  color: string
}

const xAxisDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
})

const blockPalette = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#dc2626",
  "#ca8a04",
  "#0f766e",
  "#c026d3",
  "#4f46e5",
  "#65a30d",
  "#db2777",
  "#0284c7",
  "#9333ea",
  "#059669",
  "#b45309",
]

const sanitizeKeyPart = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const getActualSeriesKey = (blockName: string) => `actual__${sanitizeKeyPart(blockName)}`
const getPredictedSeriesKey = (blockName: string) => `predicted__${sanitizeKeyPart(blockName)}`

const formatCompactNumber = (value: number) => {
  const absoluteValue = Math.abs(value)

  if (absoluteValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }

  if (absoluteValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }

  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })
}

const addValueToBlockDateMap = (
  map: Map<string, Map<string, number>>,
  blockName: string,
  date: string,
  value: number
) => {
  const valuesByDate = map.get(blockName)

  if (valuesByDate) {
    valuesByDate.set(date, (valuesByDate.get(date) ?? 0) + value)
    return
  }

  map.set(blockName, new Map([[date, value]]))
}

const buildPredictiveChartModel = (
  actualRows: {
    date: string
    strBigBlock: string
    currentStockQty: number
  }[],
  predictedRows: {
    date: string
    bigBlock: string
    predictedQty: number
  }[]
) => {
  const actualValuesByBlock = new Map<string, Map<string, number>>()
  const predictedValuesByBlock = new Map<string, Map<string, number>>()

  actualRows.forEach((row) => {
    addValueToBlockDateMap(actualValuesByBlock, row.strBigBlock, row.date, row.currentStockQty)
  })

  predictedRows.forEach((row) => {
    addValueToBlockDateMap(predictedValuesByBlock, row.bigBlock, row.date, row.predictedQty)
  })

  const blockNames = Array.from(
    new Set([...actualValuesByBlock.keys(), ...predictedValuesByBlock.keys()])
  ).sort((left, right) => left.localeCompare(right))

  const allDates = Array.from(
    new Set([
      ...actualRows.map((row) => row.date),
      ...predictedRows.map((row) => row.date),
    ])
  ).sort((left, right) => left.localeCompare(right))

  const dataByDate = new Map<string, ChartDataPoint>(
    allDates.map((date) => [
      date,
      {
        date,
      },
    ])
  )

  const chartConfig: ChartConfig = {}
  const lineConfigs: BlockLineConfig[] = []

  blockNames.forEach((blockName, index) => {
    const color = blockPalette[index % blockPalette.length]
    const actualKey = getActualSeriesKey(blockName)
    const predictedKey = getPredictedSeriesKey(blockName)
    const actualValues = actualValuesByBlock.get(blockName)
    const predictedValues = predictedValuesByBlock.get(blockName)
    const lastActualDate = actualValues ? Array.from(actualValues.keys()).sort().at(-1) : undefined

    chartConfig[actualKey] = {
      label: blockName,
      color,
    }
    chartConfig[predictedKey] = {
      label: `${blockName} (Predicted)`,
      color,
    }

    actualValues?.forEach((value, date) => {
      const dataPoint = dataByDate.get(date)

      if (dataPoint) {
        dataPoint[actualKey] = value
      }
    })

    if (predictedValues) {
      if (lastActualDate) {
        const lastActualValue = actualValues?.get(lastActualDate)
        const boundaryPoint = dataByDate.get(lastActualDate)

        if (boundaryPoint && lastActualValue !== undefined) {
          boundaryPoint[predictedKey] = lastActualValue
        }

        predictedValues.forEach((value, date) => {
          if (date <= lastActualDate) {
            return
          }

          const dataPoint = dataByDate.get(date)

          if (dataPoint) {
            dataPoint[predictedKey] = value
          }
        })
      } else {
        predictedValues.forEach((value, date) => {
          const dataPoint = dataByDate.get(date)

          if (dataPoint) {
            dataPoint[predictedKey] = value
          }
        })
      }
    }

    lineConfigs.push({
      blockName,
      actualKey,
      predictedKey,
      color,
    })
  })

  return {
    chartData: Array.from(dataByDate.values()),
    chartConfig,
    lineConfigs,
  }
}

const formatXAxisDate = (value: string) => {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return xAxisDateFormatter.format(parsedDate)
}

const getTooltipSeriesMeta = (seriesName: string) => {
  if (seriesName.endsWith(" (Predicted)")) {
    return {
      blockName: seriesName.replace(/ \(Predicted\)$/, ""),
      seriesLabel: "Predicted",
    }
  }

  return {
    blockName: seriesName,
    seriesLabel: "Actual",
  }
}

export function PredictiveInventoryStatusChart() {
  const { data, isLoading, isError } = useInventoryBigBlockSeries()

  if (isLoading) {
    return (
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              2
            </span>
            <div>
              <CardTitle>Big Block Inventory Trend &amp; Predicted</CardTitle>
              <CardDescription>
                Solid lines show actual stock and dotted lines show predicted stock by big block.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[460px] animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="border-destructive/40 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              2
            </span>
            <div>
              <CardTitle>Big Block Inventory Trend &amp; Predicted</CardTitle>
              <CardDescription>
                Solid lines show actual stock and dotted lines show predicted stock by big block.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-10 text-sm text-destructive">
          Unable to load predictive inventory status data.
        </CardContent>
      </Card>
    )
  }

  const { chartData, chartConfig, lineConfigs } = buildPredictiveChartModel(
    data.data.series.actual,
    data.data.series.predicted
  )

  if (!chartData.length || !lineConfigs.length) {
    return (
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              2
            </span>
            <div>
              <CardTitle>Big Block Inventory Trend &amp; Predicted</CardTitle>
              <CardDescription>
                Solid lines show actual stock and dotted lines show predicted stock by big block.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-10 text-sm text-muted-foreground">
          No predictive inventory status data is available for the selected date range.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
              2
            </span>
            <div>
              <CardTitle>Big Block Inventory Trend &amp; Predicted</CardTitle>
              <CardDescription>
                Daily stock quantity by big block, with actual values shown as solid lines and predicted values shown as dotted lines.
              </CardDescription>
            </div>
          </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[460px] w-full">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: -12 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={formatXAxisDate}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={80}
              tickFormatter={(value) => formatCompactNumber(Number(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(String(value))}
                  formatter={(value, name, item) => {
                    const { blockName, seriesLabel } = getTooltipSeriesMeta(String(name))

                    return (
                      <div className="flex min-w-[15rem] items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="grid gap-0.5">
                            <span className="text-muted-foreground">{seriesLabel}</span>
                            <span className="font-medium text-foreground">{blockName}</span>
                          </div>
                        </div>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatCompactNumber(Number(value))}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />
            <ChartLegend
              content={<ChartLegendContent className="flex-wrap justify-start gap-x-4 gap-y-2 pt-4" />}
            />
            {lineConfigs.map((lineConfig) => (
              <Line
                key={lineConfig.actualKey}
                type="monotone"
                dataKey={lineConfig.actualKey}
                name={lineConfig.blockName}
                stroke={lineConfig.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls={false}
              />
            ))}
            {lineConfigs.map((lineConfig) => (
              <Line
                key={lineConfig.predictedKey}
                type="monotone"
                dataKey={lineConfig.predictedKey}
                name={`${lineConfig.blockName} (Predicted)`}
                stroke={lineConfig.color}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 3 }}
                connectNulls={false}
                legendType="none"
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
