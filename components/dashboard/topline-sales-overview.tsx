import { KpiGaugeCard } from "@/components/dashboard/kpi-gauge-card"
import { KpiMetricType, type KpiMetricDataset } from "@/lib/types/kpi-metric"

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
    progressValue: 8,
    valueText: 8,
    summary: "+3% forecast accuracy achieved",
  },
  {
    metricType: KpiMetricType.FORECAST_ACCURACY,
    progressValue: 92,
    valueText: 92,
  },
]

export function ToplineSalesOverview() {
  return (
    <section className="overflow-hidden rounded-xl border bg-white border-slate-200 p-5 text-slate-900 shadow-sm sm:p-6">
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
          <KpiGaugeCard key={metric.metricType} metric={metric} />
        ))}
      </div>
    </section>
  )
}
