"use client"

import { ArrowDownUp } from "lucide-react"
import { useState } from "react"

import { useReportFilters } from "@/hooks/use-report-filters"
import { useStorePerformance } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

type SortDirection = "desc" | "asc"
type PerformanceTone = {
  text: string
  fill: string
  surface: string
}

const getPerformanceTone = (value: number | null): PerformanceTone => {
  if (value === null) {
    return {
      text: "text-slate-400",
      fill: "bg-slate-300/70",
      surface: "bg-slate-50",
    }
  }

  if (value > 140) {
    return {
      text: "text-emerald-700",
      fill: "bg-emerald-700",
      surface: "bg-emerald-50",
    }
  }

  if (value > 120) {
    return {
      text: "text-emerald-600",
      fill: "bg-emerald-600",
      surface: "bg-emerald-50/80",
    }
  }

  if (value > 100) {
    return {
      text: "text-emerald-500",
      fill: "bg-emerald-500",
      surface: "bg-emerald-50/60",
    }
  }

  if (value === 100) {
    return {
      text: "text-slate-500",
      fill: "bg-slate-400",
      surface: "bg-slate-50",
    }
  }

  if (value >= 90) {
    return {
      text: "text-rose-400",
      fill: "bg-rose-400",
      surface: "bg-rose-50/60",
    }
  }

  if (value >= 75) {
    return {
      text: "text-rose-500",
      fill: "bg-rose-500",
      surface: "bg-rose-50/80",
    }
  }

  if (value >= 50) {
    return {
      text: "text-rose-600",
      fill: "bg-rose-600",
      surface: "bg-rose-50",
    }
  }

  return {
    text: "text-rose-700",
    fill: "bg-rose-700",
    surface: "bg-rose-100/70",
  }
}

export function DashboardRightSidebar() {
  const { data, isLoading } = useStorePerformance()
  const { searchTerm, setSearchTerm } = useReportFilters()
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const filteredInsights = [...(data ?? [])]
    .filter((item) =>
      item.shopName.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .sort((left, right) => {
      const leftPerformance = left.salesPerformance ?? Number.NEGATIVE_INFINITY
      const rightPerformance = right.salesPerformance ?? Number.NEGATIVE_INFINITY
      const leftValue = leftPerformance ?? Number.NEGATIVE_INFINITY
      const rightValue = rightPerformance ?? Number.NEGATIVE_INFINITY

      return sortDirection === "desc"
        ? rightValue - leftValue
        : leftValue - rightValue
    })
  const performanceValues = filteredInsights
    .map((item) => item.salesPerformance)
    .filter((value): value is number => value !== undefined)
  const maxPerformance = performanceValues.length ? Math.max(...performanceValues) : null
  const minPerformance = performanceValues.length ? Math.min(...performanceValues) : null

  return (
    <aside className="rounded-xl border border-border/70 bg-card/90 p-4 xl:h-[calc(100vh-6rem)]">
      <section className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Shop Insights</h3>
          <button
            type="button"
            onClick={() =>
              setSortDirection((current) => (current === "desc" ? "asc" : "desc"))
            }
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground transition hover:text-foreground"
            aria-label={
              sortDirection === "desc"
                ? "Sort shop insights low to high"
                : "Sort shop insights high to low"
            }
            title={
              sortDirection === "desc"
                ? "Currently high to low"
                : "Currently low to high"
            }
          >
            <ArrowDownUp size={14} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search shop..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-md border border-border/70 bg-background p-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        />

        <ul className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <li className="rounded-md border border-dashed border-border/60 px-2 py-3 text-center text-xs text-muted-foreground">
              Loading shops...
            </li>
          ) : null}
          {filteredInsights.map((item) => {
            const salesPerformance = item.salesPerformance ?? null
            const tone = getPerformanceTone(salesPerformance)
            const fillWidth =
              salesPerformance === null || maxPerformance === null || minPerformance === null
                ? 0
                : maxPerformance === minPerformance
                  ? 100
                  : ((salesPerformance - minPerformance) / (maxPerformance - minPerformance)) * 100

            return (
              <li
                key={item.shopName}
                className={cn(
                  "space-y-1 rounded-md border border-border/60 p-2 text-xs",
                  tone.surface
                )}
              >
                <div className="truncate bold text-foreground">{item.shopName}</div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={cn("h-full rounded-full bold transition-[width]", tone.fill)}
                      style={{ width: `${Math.max(0, Math.min(100, fillWidth))}%` }}
                    />
                  </div>
                  <span className={cn("min-w-14 text-right font-medium", tone.text)}>
                    {salesPerformance === null ? "N/A" : `${salesPerformance.toFixed(2)}%`}
                  </span>
                </div>
              </li>
            )
          })}
          {!isLoading && filteredInsights.length === 0 ? (
            <li className="rounded-md border border-dashed border-border/60 px-2 py-3 text-center text-xs text-muted-foreground">
              No shops match the current filters.
            </li>
          ) : null}
        </ul>
      </section>
    </aside>
  )
}
