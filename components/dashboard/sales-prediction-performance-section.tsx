"use client"

import type { ReactNode } from "react"

import { ShopPerformanceSummarySkeleton } from "@/components/dashboard/report-skeletons"
import { ShopPerformanceSummaryBarChart } from "@/components/dashboard/shop-performance-summary-bar-chart"
import { ShopPerformanceSummaryDailyForecastChart } from "@/components/dashboard/shop-performance-summary-daily-forecast-chart"
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
  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 6,
  })}`
}

const formatNumericValue = (value: number) =>
  value.toLocaleString("en-BD", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 6,
  })

const formatMetricValue = (key: string, value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "N/A"
  }

  const normalizedKey = key.toLowerCase()

  if (
    normalizedKey.includes("sales") ||
    normalizedKey.includes("target") ||
    normalizedKey.includes("forecast") ||
    normalizedKey.includes("diff")
  ) {
    return formatBdtCompact(value)
  }

  return formatNumericValue(value)
}

const getValueTone = (key: string, value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "text-muted-foreground"
  }

  const normalizedKey = key.toLowerCase()

  if (!normalizedKey.includes("diff")) {
    return "text-foreground"
  }

  if (value > 0) {
    return "text-emerald-700"
  }

  if (value < 0) {
    return "text-rose-600"
  }

  return "text-foreground"
}

const formatFieldLabel = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase())

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

function SummaryMetricsList({
  entries,
}: {
  entries: Array<[string, number | null | undefined]>
}) {
  return (
    <div className="space-y-1">
      {entries.map(([key, value]) => (
        <SummaryMetricRow
          key={key}
          label={formatFieldLabel(key)}
          value={formatMetricValue(key, value)}
          toneClassName={getValueTone(key, value)}
        />
      ))}
    </div>
  )
}

function PreviousMonthPanel({ data }: { data: ShopPerformanceSummaryMonthOverview }) {
  return (
    <SummaryPanel eyebrow="Previous Month" title={data.periodLabel} status="Full month">
      <SummaryMetricsList
        entries={[
          ["actualSales", data.actualSales],
          ["grossSales", data.grossSales],
          ["returnSales", data.returnSales],
          ["target", data.target],
          ["forecast", data.forecast],
          ["targetDiff", data.targetDiff],
          ["forecastDiff", data.forecastDiff],
          ["achievementRatio", data.achievementRatio],
          ["gapRatio", data.gapRatio],
          ["forecastVsActualRatio", data.forecastVsActualRatio],
        ]}
      />
    </SummaryPanel>
  )
}

function CurrentMonthPanel({ data }: { data: ShopPerformanceSummaryCurrentMonth }) {
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
          <SummaryMetricsList
            entries={[
              ["actualSales", data.completed.actualSales],
              ["grossSales", data.completed.grossSales],
              ["returnSales", data.completed.returnSales],
              ["target", data.completed.target],
              ["forecast", data.completed.forecast],
              ["targetDiff", data.completed.targetDiff],
              ["forecastDiff", data.completed.forecastDiff],
              ["achievementRatio", data.completed.achievementRatio],
              ["gapRatio", data.completed.gapRatio],
              ["forecastVsActualRatio", data.completed.forecastVsActualRatio],
            ]}
          />
        </div>

        <div className="rounded-xl border border-border/70 bg-background/80 p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            {data.remaining.label} (remaining)
          </div>
          <SummaryMetricsList
            entries={[
              ["target", data.remaining.target],
              ["forecast", data.remaining.forecast],
              ["targetVsForecastRatio", data.remaining.targetVsForecastRatio],
            ]}
          />
        </div>
      </div>
    </SummaryPanel>
  )
}

function NextMonthPanel({ data }: { data: ShopPerformanceSummaryNextMonth }) {
  return (
    <SummaryPanel eyebrow="Next Month" title={data.periodLabel} status="Forecast only">
      <SummaryMetricsList
        entries={[
          ["target", data.target],
          ["forecast", data.forecast],
          ["targetVsForecastRatio", data.targetVsForecastRatio],
        ]}
      />
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
      <ShopPerformanceSummaryBarChart
        prevMonth={selectedShop.prevMonth}
        currentMonth={selectedShop.currentMonth}
        nextMonth={selectedShop.nextMonth}
      />
      <ShopPerformanceSummaryDailyForecastChart
        currentMonth={selectedShop.currentMonth}
        nextMonth={selectedShop.nextMonth}
      />
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
