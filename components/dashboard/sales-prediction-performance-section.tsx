"use client"

import type { ReactNode } from "react"

import { ShopPerformanceSummarySkeleton } from "@/components/dashboard/report-skeletons"
import { StorePerformanceTable } from "@/components/dashboard/store-performance-table"
import { useShopPerformanceSummary } from "@/hooks/use-dashboard"
import { useReportFilters } from "@/hooks/use-report-filters"
import type {
  ShopPerformanceSummaryCurrentMonth,
  ShopPerformanceSummaryMonthOverview,
  ShopPerformanceSummaryNextMonth,
} from "@/lib/types/dashboard"
import { cn } from "@/lib/utils"

const formatBdtCompact = (value: number) => {
  const absoluteValue = Math.abs(value)

  if (absoluteValue >= 10000000) {
    return `৳${(absoluteValue / 10000000).toFixed(2).replace(/\.?0+$/, "")}Cr`
  }

  if (absoluteValue >= 100000) {
    return `৳${(absoluteValue / 100000).toFixed(2).replace(/\.?0+$/, "")}L`
  }

  if (absoluteValue >= 1000) {
    return `৳${(absoluteValue / 1000).toFixed(0)}K`
  }

  return `৳${absoluteValue.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

const formatSignedBdtCompact = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "N/A"
  }

  if (value === 0) {
    return "৳0"
  }

  return `${value > 0 ? "+" : "-"}${formatBdtCompact(value)}`
}

const formatRatio = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "N/A"
  }

  return `${value.toFixed(2)}x`
}

const formatPercentage = (value: number | null | undefined) => {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "N/A"
  }

  return `${value.toFixed(1)}%`
}

const getAchievementPercentage = (actual: number, target: number, provided?: number) => {
  if (provided !== undefined) {
    return provided * 100
  }

  if (target <= 0) {
    return null
  }

  return (actual / target) * 100
}

const getForecastCoverage = (target: number, forecast: number) => {
  if (target <= 0) {
    return null
  }

  return (forecast / target) * 100
}

const getDeltaTone = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "text-muted-foreground"
  }

  if (value > 0) {
    return "text-emerald-700"
  }

  if (value < 0) {
    return "text-rose-600"
  }

  return "text-foreground"
}

const formatAsOfDate = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat("en-BD", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate)
}

type SummaryMetricRowProps = {
  label: string
  value: string
  toneClassName?: string
}

function SummaryMetricRow({
  label,
  value,
  toneClassName = "text-foreground",
}: SummaryMetricRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2 text-sm last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-medium", toneClassName)}>{value}</span>
    </div>
  )
}

type SummaryPanelProps = {
  eyebrow: string
  title: string
  status: string
  emphasized?: boolean
  children: ReactNode
}

function SummaryPanel({
  eyebrow,
  title,
  status,
  emphasized = false,
  children,
}: SummaryPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-background p-4",
        emphasized && "border-amber-200 bg-amber-50/60"
      )}
    >
      <div className="mb-4 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium",
              emphasized
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {status}
          </span>
        </div>
      </div>
      {children}
    </div>
  )
}

function PreviousMonthPanel({ data }: { data: ShopPerformanceSummaryMonthOverview }) {
  const achievement = getAchievementPercentage(
    data.actualSales,
    data.target,
    data.achievementRatio
  )

  return (
    <SummaryPanel eyebrow="Previous Month" title={data.periodLabel} status="Full month">
      <div className="space-y-1">
        <SummaryMetricRow label="Actual sales" value={formatBdtCompact(data.actualSales)} />
        <SummaryMetricRow label="Target" value={formatBdtCompact(data.target)} />
        <SummaryMetricRow label="Forecast" value={formatBdtCompact(data.forecast)} />
        <SummaryMetricRow
          label="vs target"
          value={formatSignedBdtCompact(data.targetDiff)}
          toneClassName={getDeltaTone(data.targetDiff)}
        />
        <SummaryMetricRow
          label="vs forecast"
          value={formatSignedBdtCompact(data.forecastDiff)}
          toneClassName={getDeltaTone(data.forecastDiff)}
        />
        <SummaryMetricRow label="Achievement" value={formatPercentage(achievement)} />
        <SummaryMetricRow
          label="Achievement ratio"
          value={formatRatio(data.achievementRatio)}
        />
        <SummaryMetricRow label="Gap ratio" value={formatRatio(data.gapRatio)} />
        <SummaryMetricRow
          label="Forecast vs actual"
          value={formatRatio(data.forecastVsActualRatio)}
        />
      </div>
    </SummaryPanel>
  )
}

function CurrentMonthPanel({ data }: { data: ShopPerformanceSummaryCurrentMonth }) {
  const achievement = getAchievementPercentage(
    data.completed.actualSales,
    data.completed.target,
    data.completed.achievementRatio
  )

  return (
    <SummaryPanel
      eyebrow="Current Month"
      title={data.periodLabel}
      status="In progress"
      emphasized
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-border/70 bg-background/80 p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            {data.completed.label} (completed)
          </div>
          <div className="space-y-1">
            <SummaryMetricRow
              label="Actual sales"
              value={formatBdtCompact(data.completed.actualSales)}
            />
            <SummaryMetricRow
              label="Target (prorated)"
              value={formatBdtCompact(data.completed.target)}
            />
            <SummaryMetricRow
              label="Forecast (prorated)"
              value={formatBdtCompact(data.completed.forecast)}
            />
            <SummaryMetricRow
              label="vs target"
              value={formatSignedBdtCompact(data.completed.targetDiff)}
              toneClassName={getDeltaTone(data.completed.targetDiff)}
            />
            <SummaryMetricRow
              label="vs forecast"
              value={formatSignedBdtCompact(data.completed.forecastDiff)}
              toneClassName={getDeltaTone(data.completed.forecastDiff)}
            />
            <SummaryMetricRow label="Achievement" value={formatPercentage(achievement)} />
            <SummaryMetricRow
              label="Achievement ratio"
              value={formatRatio(data.completed.achievementRatio)}
            />
            <SummaryMetricRow label="Gap ratio" value={formatRatio(data.completed.gapRatio)} />
            <SummaryMetricRow
              label="Forecast vs actual"
              value={formatRatio(data.completed.forecastVsActualRatio)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-background/80 p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            {data.remaining.label} (remaining)
          </div>
          <div className="space-y-1">
            <SummaryMetricRow
              label="Target remaining"
              value={formatBdtCompact(data.remaining.target)}
            />
            <SummaryMetricRow
              label="Forecast remaining"
              value={formatBdtCompact(data.remaining.forecast)}
            />
            <SummaryMetricRow
              label="Target vs forecast"
              value={formatRatio(data.remaining.targetVsForecastRatio)}
            />
          </div>
        </div>
      </div>
    </SummaryPanel>
  )
}

function NextMonthPanel({ data }: { data: ShopPerformanceSummaryNextMonth }) {
  const coverage = getForecastCoverage(data.target, data.forecast)
  const difference = data.forecast - data.target

  return (
    <SummaryPanel eyebrow="Next Month" title={data.periodLabel} status="Forecast only">
      <div className="space-y-1">
        <SummaryMetricRow label="Target" value={formatBdtCompact(data.target)} />
        <SummaryMetricRow label="Forecast" value={formatBdtCompact(data.forecast)} />
        <SummaryMetricRow
          label="vs target"
          value={formatSignedBdtCompact(difference)}
          toneClassName={getDeltaTone(difference)}
        />
        <SummaryMetricRow label="Forecast coverage" value={formatPercentage(coverage)} />
        <SummaryMetricRow
          label="Target vs forecast ratio"
          value={formatRatio(data.targetVsForecastRatio)}
        />
      </div>
    </SummaryPanel>
  )
}

export function ShopPerformanceSummary() {
  const { shopName } = useReportFilters()
  const { data, isLoading, isFetching, error } = useShopPerformanceSummary()
  const showLoadingState = isLoading || isFetching
  const selectedShop = data?.items.find(
    (item) => item.shopName.trim().toLowerCase() === shopName.trim().toLowerCase()
  )

  if (showLoadingState) {
    return <ShopPerformanceSummarySkeleton />
  }

  if (error) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border/70 bg-background text-sm text-destructive">
        Failed to load shop performance summary
      </div>
    )
  }

  if (!selectedShop) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background text-sm text-muted-foreground">
        No summary data is available for the selected shop.
      </div>
    )
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Sales Performance Overview
          </h2>
          <p className="text-sm text-muted-foreground">{selectedShop.shopName}</p>
        </div>
        {data?.asOf ? (
          <div className="text-xs text-muted-foreground">
            As of {formatAsOfDate(data.asOf) ?? data.asOf}
          </div>
        ) : null}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <PreviousMonthPanel data={selectedShop.prevMonth} />
        <CurrentMonthPanel data={selectedShop.currentMonth} />
        <NextMonthPanel data={selectedShop.nextMonth} />
      </div>
    </section>
  )
}

export function SalesPredictionPerformanceSection() {
  const { shopName } = useReportFilters()

  if (!shopName) {
    return <StorePerformanceTable />
  }

  return <ShopPerformanceSummary />
}
