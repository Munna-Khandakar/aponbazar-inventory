"use client"

import { ArrowDownUp } from "lucide-react"
import { useState } from "react"

import { SidebarInsightsSkeleton } from "@/components/dashboard/report-skeletons"
import { Button } from "@/components/ui/button"
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

type DashboardRightSidebarProps = {
  showOnlyTitle?: boolean
}

export function DashboardRightSidebar({
  showOnlyTitle = false,
}: DashboardRightSidebarProps) {
  const { data, isLoading, isFetching } = useStorePerformance()
  const { searchTerm, setSearchTerm, shopName, setShopName } = useReportFilters()
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const showLoadingState = isLoading || isFetching

  const filteredInsights = [...(data ?? [])]
    .filter((item) =>
      item.shopName.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .sort((left, right) => {
      if (showOnlyTitle) {
        return 0
      }

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
    <aside className="rounded-xl border border-border/70 bg-card/90 p-4 xl:h-[calc(100dvh-var(--dashboard-topbar-height)-2rem)]">
      <section className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Shop Insights</h3>
          {!showOnlyTitle || shopName ? (
            <div className="flex items-center gap-2">
              {shopName ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-md px-2 text-[11px]"
                  onClick={() => setShopName("")}
                >
                  Reset
                </Button>
              ) : null}
              {!showOnlyTitle ? (
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
              ) : null}
            </div>
          ) : null}
        </div>

        <input
          type="text"
          placeholder="Search shop..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-md border border-border/70 bg-background p-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        />

        <ul className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
          {showLoadingState ? (
            <SidebarInsightsSkeleton />
          ) : null}
          {filteredInsights.map((item) => {
            const salesPerformance = item.salesPerformance ?? null
            const tone = getPerformanceTone(salesPerformance)
            const isSelectedShop = shopName === item.shopName
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
                  "rounded-md border p-2 text-xs transition-colors",
                  isSelectedShop
                    ? "border-sky-500 bg-sky-50 shadow-sm ring-1 ring-sky-200"
                    : "border-border/60",
                  showOnlyTitle ? "bg-background/70" : "space-y-1",
                  !isSelectedShop && !showOnlyTitle && tone.surface
                )}
              >
                <button
                  type="button"
                  className="w-full cursor-pointer text-left"
                  onClick={() => setShopName(isSelectedShop ? "" : item.shopName)}
                >
                  <div
                    className={cn(
                      "truncate text-foreground",
                      isSelectedShop ? "font-semibold text-sky-700" : "font-medium"
                    )}
                  >
                    {item.shopName}
                  </div>
                  {!showOnlyTitle ? (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={cn("h-full rounded-full transition-[width]", tone.fill)}
                          style={{ width: `${Math.max(0, Math.min(100, fillWidth))}%` }}
                        />
                      </div>
                      <span className={cn("min-w-14 text-right font-medium", tone.text)}>
                        {salesPerformance === null ? "N/A" : `${salesPerformance.toFixed(2)}%`}
                      </span>
                    </div>
                  ) : null}
                </button>
              </li>
            )
          })}
          {!showLoadingState && filteredInsights.length === 0 ? (
            <li className="rounded-md border border-dashed border-border/60 px-2 py-3 text-center text-xs text-muted-foreground">
              No shops match the current filters.
            </li>
          ) : null}
        </ul>
      </section>
    </aside>
  )
}
