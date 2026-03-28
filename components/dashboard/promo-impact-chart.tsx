"use client"

import { useEffect, useState } from "react"
import { Columns3, Maximize2, Rows3, X } from "lucide-react"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PromoImpactChartSkeleton } from "@/components/dashboard/report-skeletons"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePromoImpact } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

const chartConfig = {
  baseSales: {
    label: "Base Sales",
    color: "#94a3b8",
  },
  actualSales: {
    label: "Actual Sales",
    color: "#0f766e",
  },
  salesPerformance: {
    label: "Sales Performance",
    color: "#ea580c",
  },
} satisfies ChartConfig

const formatBdtCompact = (value: number) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)}L`
  return `৳${value.toLocaleString("en-BD")}`
}

const formatBdt = (value: number) => `৳${value.toLocaleString("en-BD")}`
const formatPerformance = (value: number) => `${value.toFixed(2)}%`
const formatShopTick = (value: string) =>
  value.length > 12 ? `${value.slice(0, 12)}…` : value

type ChartOrientation = "horizontal" | "vertical"

type PromoImpactChartViewProps = {
  chartData: ReturnType<typeof usePromoImpact>["data"]
  orientation: ChartOrientation
  fullscreen?: boolean
}

function PromoImpactChartView({
  chartData,
  orientation,
  fullscreen = false,
}: PromoImpactChartViewProps) {
  const rows = chartData ?? []

  if (orientation === "vertical") {
    const chartHeight = Math.max(fullscreen ? 720 : 520, rows.length * 36)

    return (
      <div
        className={cn(
          "overflow-y-auto pr-2",
          fullscreen ? "max-h-[calc(100vh-14rem)]" : "max-h-[620px]"
        )}
      >
        <ChartContainer
          config={chartConfig}
          className="aspect-auto w-full"
          style={{ height: chartHeight }}
        >
          <ComposedChart
            data={rows}
            layout="vertical"
            margin={{ top: 12, right: 16, bottom: 12, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              xAxisId="sales"
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatBdtCompact(Number(value))}
            />
            <YAxis
              yAxisId="shops"
              type="category"
              dataKey="shopName"
              width={fullscreen ? 260 : 220}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <XAxis
              xAxisId="performance"
              type="number"
              orientation="top"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${Number(value)}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Shop: ${value}`}
                  formatter={(value, name) =>
                    name === "Sales Performance"
                      ? formatPerformance(Number(value))
                      : formatBdt(Number(value))
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              xAxisId="sales"
              yAxisId="shops"
              dataKey="baseSales"
              fill="var(--color-baseSales)"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
            <Bar
              xAxisId="sales"
              yAxisId="shops"
              dataKey="actualSales"
              fill="var(--color-actualSales)"
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
            <Line
              xAxisId="performance"
              yAxisId="shops"
              type="monotone"
              dataKey="salesPerformance"
              stroke="var(--color-salesPerformance)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    )
  }

  const chartWidth = Math.max(fullscreen ? 1600 : 1100, rows.length * 82)
  const chartHeight = fullscreen ? 520 : 420

  return (
    <div className="overflow-x-auto pb-2">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto"
        style={{ width: chartWidth, height: chartHeight }}
      >
        <ComposedChart data={rows} margin={{ top: 16, right: 16, bottom: 28, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="shopName"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            interval={0}
            height={56}
            tickFormatter={formatShopTick}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            yAxisId="sales"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatBdtCompact(Number(value))}
          />
          <YAxis
            yAxisId="performance"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${Number(value)}%`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Shop: ${value}`}
                formatter={(value, name) =>
                  name === "Sales Performance"
                    ? formatPerformance(Number(value))
                    : formatBdt(Number(value))
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            yAxisId="sales"
            dataKey="baseSales"
            fill="var(--color-baseSales)"
            radius={[4, 4, 0, 0]}
            barSize={14}
          />
          <Bar
            yAxisId="sales"
            dataKey="actualSales"
            fill="var(--color-actualSales)"
            radius={[4, 4, 0, 0]}
            barSize={14}
          />
          <Line
            yAxisId="performance"
            type="monotone"
            dataKey="salesPerformance"
            stroke="var(--color-salesPerformance)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}

export function PromoImpactChart() {
  const { data, isLoading, isFetching, error } = usePromoImpact()
  const chartData = data ?? []
  const [orientation, setOrientation] = useState<ChartOrientation>("horizontal")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const showLoadingState = isLoading || isFetching

  useEffect(() => {
    if (!isFullscreen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isFullscreen])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Shop Wise Sales</CardTitle>
            <CardDescription>
              Base sales, actual sales, and sales performance by shop
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={showLoadingState}
              onClick={() =>
                setOrientation((current) =>
                  current === "horizontal" ? "vertical" : "horizontal"
                )
              }
            >
              {orientation === "horizontal" ? <Rows3 size={15} /> : <Columns3 size={15} />}
              {orientation === "horizontal" ? "Vertical View" : "Horizontal View"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={showLoadingState}
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 size={15} />
              Full Screen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showLoadingState ? (
            <PromoImpactChartSkeleton />
          ) : error ? (
            <div className="flex aspect-video items-center justify-center text-sm text-destructive">
              Failed to load shop wise sales data
            </div>
          ) : (
            <PromoImpactChartView chartData={chartData} orientation={orientation} />
          )}
        </CardContent>
      </Card>

      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex h-full w-full flex-col rounded-3xl border border-border/70 bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Shop Wise Sales</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Expanded chart view with orientation controls.
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    setOrientation((current) =>
                      current === "horizontal" ? "vertical" : "horizontal"
                    )
                  }
                >
                  {orientation === "horizontal" ? <Rows3 size={15} /> : <Columns3 size={15} />}
                  {orientation === "horizontal" ? "Vertical View" : "Horizontal View"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X size={15} />
                  Close
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 px-5 py-4">
              <PromoImpactChartView
                chartData={chartData}
                orientation={orientation}
                fullscreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
