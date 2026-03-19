"use client"

import { KpiGaugeCard } from "@/components/dashboard/kpi-gauge-card"
import { useReportFilters } from "@/hooks/use-report-filters"
import { KpiMetricType, type KpiMetricDataset } from "@/lib/types/kpi-metric"

export function ToplineSalesOverview() {
  const { growthTarget, setGrowthTarget } = useReportFilters()
  const growthTargetValue = Number(growthTarget) || 0
  const overviewMetrics: KpiMetricDataset[] = [
    {
      metricType: KpiMetricType.ACTUAL_SALES,
      progressValue: 94,
      valueText: 48.97,
      summary: "BDT 0.1M in additional sales",
    },
    {
      metricType: KpiMetricType.PREDICTED_SALES,
      progressValue: 85,
      valueText: 45.75,
      summary: "85% of growth target achieved",
    },
    {
      metricType: KpiMetricType.GROWTH_TARGET,
      progressValue: growthTargetValue * 5,
      valueText: growthTargetValue,
      summary: "+3% forecast accuracy achieved",
    },
    {
      metricType: KpiMetricType.FORECAST_ACCURACY,
      progressValue: 92,
      valueText: 92,
      summary: "Strong consistency across projected demand cycles",
    },
  ]

  return (
    <section className="overflow-hidden text-slate-900">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Topline Sales Overview</h2>
          <p className="mt-1 text-xs text-slate-500">
            [Date Ranges (MTD, 30D, Custom), Search Bar, Outlet/Category Filters]
          </p>
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <KpiGaugeCard
            key={metric.metricType}
            metric={metric}
            sliderValue={
              metric.metricType === KpiMetricType.GROWTH_TARGET
                ? growthTargetValue
                : undefined
            }
            onSliderChange={
              metric.metricType === KpiMetricType.GROWTH_TARGET
                ? (value) => setGrowthTarget(String(value))
                : undefined
            }
          />
        ))}
      </div>
    </section>
  )
}
