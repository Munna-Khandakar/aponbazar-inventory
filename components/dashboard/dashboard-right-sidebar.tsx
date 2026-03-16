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
}

const getPerformanceTone = (value: number | null): PerformanceTone => {
  if (value === null) {
    return {
      text: "text-slate-400",
      fill: "bg-slate-300/70",
    }
  }

  if (value > 140) {
    return {
      text: "text-emerald-700",
      fill: "bg-emerald-700",
    }
  }

  if (value > 120) {
    return {
      text: "text-emerald-600",
      fill: "bg-emerald-600",
    }
  }

  if (value > 100) {
    return {
      text: "text-emerald-500",
      fill: "bg-emerald-500",
    }
  }

  if (value === 100) {
    return {
      text: "text-slate-500",
      fill: "bg-slate-400",
    }
  }

  if (value >= 90) {
    return {
      text: "text-rose-400",
      fill: "bg-rose-400",
    }
  }

  if (value >= 75) {
    return {
      text: "text-rose-500",
      fill: "bg-rose-500",
    }
  }

  if (value >= 50) {
    return {
      text: "text-rose-600",
      fill: "bg-rose-600",
    }
  }

  return {
    text: "text-rose-700",
    fill: "bg-rose-700",
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

  return (
    <aside className="rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm xl:h-[calc(100vh-6rem)]">
      <section className="flex h-full flex-col gap-2 rounded-lg border border-border/70 bg-background/80 p-3">
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
          className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        />

        <ul className="flex-1 min-h-0 space-y-1.5 overflow-y-auto pr-1">
          {isLoading ? (
            <li className="rounded-md border border-dashed border-border/60 px-2 py-3 text-center text-xs text-muted-foreground">
              Loading shops...
            </li>
          ) : null}
          {filteredInsights.map((item) => {
            const salesPerformance = item.salesPerformance ?? null
            const tone = getPerformanceTone(salesPerformance)
            const filledSegments =
              salesPerformance === null
                ? 0
                : Math.max(0, Math.min(10, Math.round(salesPerformance / 10)))

            return (
              <li
                key={item.shopName}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-xs"
              >
                <span className="truncate text-foreground">{item.shopName}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }, (_, index) => (
                      <span
                        key={`${item.shopName}-${index}`}
                        className={cn(
                          "h-4 w-1 rounded-full bg-slate-200 transition-colors",
                          index < filledSegments && tone.fill
                        )}
                      />
                    ))}
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
