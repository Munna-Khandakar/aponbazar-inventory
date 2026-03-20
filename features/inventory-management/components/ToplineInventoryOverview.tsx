"use client"

import { KpiGaugeCard } from "@/components/dashboard/kpi-gauge-card"
import { useReportFilters } from "@/hooks/use-report-filters"
import { useDemandForecast, useInventoryPrediction } from "@/hooks/use-dashboard"
import { KpiMetricType, type KpiMetricDataset } from "@/lib/types/kpi-metric"

const formatCompactNumber = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toLocaleString("en-BD")
}

const getForecastAccuracy = (confidence: "high" | "medium" | "low") => {
  if (confidence === "high") return 96
  if (confidence === "medium") return 86
  return 72
}

export function ToplineInventoryOverview() {
  const { startDate, endDate } = useReportFilters()
  const { data: inventoryPrediction } = useInventoryPrediction()
  const { data: demandForecast } = useDemandForecast()

  const latestProjection = inventoryPrediction?.[inventoryPrediction.length - 1]
  const totalStock = latestProjection
    ? latestProjection.electronics +
      latestProjection.clothing +
      latestProjection.groceries +
      latestProjection.homeGoods
    : 0

  const forecastRows = demandForecast ?? []
  const predictedStockout = forecastRows.filter(
    (row) => row.currentStock < row.predictedDemand
  ).length
  const overstockItems = forecastRows.filter(
    (row) => row.currentStock > row.predictedDemand * 1.2
  ).length
  const forecastAccuracy = forecastRows.length
    ? Math.round(
        forecastRows.reduce(
          (total, row) => total + getForecastAccuracy(row.confidence),
          0
        ) / forecastRows.length
      )
    : 0

  const metrics: Array<KpiMetricDataset & {
    labelOverride: string
    valuePrefixOverride?: string
    valueFormatterOverride?: (value: number) => string
  }> = [
    {
      metricType: KpiMetricType.ACTUAL_SALES,
      progressValue: 90,
      valueText: totalStock,
      labelOverride: "Total Stock",
      valuePrefixOverride: "Units",
      valueFormatterOverride: formatCompactNumber,
    },
    {
      metricType: KpiMetricType.PREDICTED_SALES,
      progressValue: Math.min(100, predictedStockout * 8),
      valueText: predictedStockout,
      labelOverride: "Predicted Stockout",
      valuePrefixOverride: "Items",
      valueFormatterOverride: (value) => value.toLocaleString("en-BD"),
    },
    {
      metricType: KpiMetricType.GROWTH_TARGET,
      progressValue: Math.min(100, overstockItems * 10),
      valueText: overstockItems,
      labelOverride: "Overstock",
      valuePrefixOverride: "Items",
      valueFormatterOverride: (value) => value.toLocaleString("en-BD"),
    },
    {
      metricType: KpiMetricType.FORECAST_ACCURACY,
      progressValue: forecastAccuracy,
      valueText: forecastAccuracy,
      labelOverride: "Forecast Accuracy",
      valueFormatterOverride: (value) => `${value}%`,
    },
  ]

  return (
    <section className="overflow-hidden text-slate-900">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Topline Inventory Overview</h2>
          <p className="mt-1 text-xs text-slate-500">
            [{startDate} to {endDate}, Search Bar, Outlet/Category Filters]
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <KpiGaugeCard
            key={metric.labelOverride}
            metric={metric}
            labelOverride={metric.labelOverride}
            valuePrefixOverride={metric.valuePrefixOverride}
            valueFormatterOverride={metric.valueFormatterOverride}
          />
        ))}
      </div>
    </section>
  )
}
