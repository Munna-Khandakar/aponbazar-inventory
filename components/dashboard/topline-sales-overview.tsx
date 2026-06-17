"use client"

import { useState } from "react"
import { KpiGaugeCard } from "@/components/dashboard/kpi-gauge-card"
import { useReportFilters } from "@/hooks/use-report-filters"
import { useSalesOverview } from "@/hooks/use-dashboard"
import { KpiMetricType, type KpiMetricDataset } from "@/lib/types/kpi-metric"

const getLast12Months = (): { value: string; label: string }[] => {
  const months = []
  const now = new Date()
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" })
    months.push({ value, label })
  }
  return months
}

const getOneYearAgoMonth = (): string => {
  const now = new Date()
  const d = new Date(now.getFullYear() - 1, now.getMonth(), 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

const MONTH_OPTIONS = getLast12Months()

export function ToplineSalesOverview() {
  const { growthTarget, setGrowthTarget } = useReportFilters()
  const growthTargetValue = Number(growthTarget) || 0
  const [baseMonth, setBaseMonth] = useState(getOneYearAgoMonth)
  const { data } = useSalesOverview(baseMonth)

  const mtdSalesM = data ? data.mtdSales / 1_000_000 : 0
  const predictedMonthTotalM = data ? data.mtdTarget / 1_000_000 : 0
  const achievementPct = data?.achievementPct ?? 0

  const overviewMetrics: KpiMetricDataset[] = [
    {
      metricType: KpiMetricType.ACTUAL_SALES,
      progressValue: Math.min(100, achievementPct),
      valueText: mtdSalesM,
      summary: `${achievementPct.toFixed(1)}% of MTD target achieved`,
    },
    {
      metricType: KpiMetricType.PREDICTED_SALES,
      progressValue: 85,
      valueText: predictedMonthTotalM,
      summary: "Forecast-driven month-end projection",
    },
    {
      metricType: KpiMetricType.GROWTH_TARGET,
      progressValue: growthTargetValue * 5,
      valueText: growthTargetValue,
      summary: "+3% forecast accuracy achieved",
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

        <article className="flex h-full flex-col rounded-xl border border-sky-200 bg-sky-50/80 p-4 sm:p-5">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700">Base Month</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">Baseline comparison</p>
            <select
              value={baseMonth}
              onChange={(e) => setBaseMonth(e.target.value)}
              className="w-full rounded-md border border-sky-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </article>
      </div>
    </section>
  )
}
