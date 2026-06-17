"use client"

import { KpiGaugeCard } from "@/components/dashboard/kpi-gauge-card"
import { useReportFilters } from "@/hooks/use-report-filters"
import { useInventoryOverview } from "@/hooks/use-dashboard"
import { KpiMetricType, type KpiMetricDataset } from "@/lib/types/kpi-metric"

const formatCompactNumber = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toLocaleString("en-BD")
}

export function ToplineInventoryOverview() {
  const { startDate, endDate } = useReportFilters()
  const { data, isLoading } = useInventoryOverview()

  const totalStockQty = data?.totalStockQty ?? 0
  const stockoutQty = data?.stockoutQty ?? 0
  const overstockQty = data?.overstockQty ?? 0

  const metrics: Array<KpiMetricDataset & {
    labelOverride: string
    valuePrefixOverride?: string
    valueFormatterOverride?: (value: number) => string
  }> = [
    {
      metricType: KpiMetricType.ACTUAL_SALES,
      progressValue: 90,
      valueText: totalStockQty,
      labelOverride: "Total Stock",
      valuePrefixOverride: "Units",
      valueFormatterOverride: formatCompactNumber,
    },
    {
      metricType: KpiMetricType.PREDICTED_SALES,
      progressValue: totalStockQty > 0 ? Math.min(100, (stockoutQty / totalStockQty) * 100) : 0,
      valueText: stockoutQty,
      labelOverride: "Predicted Stockout",
      valuePrefixOverride: "Units",
      valueFormatterOverride: formatCompactNumber,
    },
    {
      metricType: KpiMetricType.GROWTH_TARGET,
      progressValue: totalStockQty > 0 ? Math.min(100, (overstockQty / totalStockQty) * 100) : 0,
      valueText: overstockQty,
      labelOverride: "Overstock",
      valuePrefixOverride: "Units",
      valueFormatterOverride: formatCompactNumber,
    },
    {
      metricType: KpiMetricType.FORECAST_ACCURACY,
      progressValue: 0,
      valueText: 0,
      labelOverride: "Forecast Accuracy",
      valueFormatterOverride: () => "—",
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
            valuePrefixOverride={isLoading ? undefined : metric.valuePrefixOverride}
            valueFormatterOverride={metric.valueFormatterOverride}
          />
        ))}
      </div>
    </section>
  )
}
