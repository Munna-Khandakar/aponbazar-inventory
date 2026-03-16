"use client"

import { ArrowDownUp } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useReportFilters } from "@/hooks/use-report-filters"
import { useStorePerformance } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

type SortDirection = "desc" | "asc"

const getPerformance = (actual: number, base: number, provided?: number) => {
  if (provided !== undefined) return provided
  if (base <= 0) return null
  return (actual / base) * 100
}

export function DashboardRightSidebar() {
  const { data, isLoading } = useStorePerformance()
  const {
    dateMode,
    startDate,
    endDate,
    searchTerm,
    setStartDate,
    setEndDate,
    setSearchTerm,
    setPresetRange,
    setCustomRange,
  } = useReportFilters()
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const filteredInsights = [...(data ?? [])]
    .filter((item) =>
      item.shopName.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .sort((left, right) => {
      const leftPerformance = getPerformance(
        left.actualSales,
        left.baseSales,
        left.salesPerformance
      )
      const rightPerformance = getPerformance(
        right.actualSales,
        right.baseSales,
        right.salesPerformance
      )
      const leftValue = leftPerformance ?? Number.NEGATIVE_INFINITY
      const rightValue = rightPerformance ?? Number.NEGATIVE_INFINITY

      return sortDirection === "desc"
        ? rightValue - leftValue
        : leftValue - rightValue
    })

  return (
    <aside className="space-y-4 rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm">
      <section className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Filters</h3>
          <p className="text-xs text-muted-foreground">Refine the dashboard view by date.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={dateMode === "30d" ? "default" : "outline"}
            className={cn("h-7 px-2 text-[11px]", dateMode !== "30d" && "bg-background")}
            onClick={() => setPresetRange("30d")}
          >
            30 days
          </Button>
          <Button
            type="button"
            size="sm"
            variant={dateMode === "90d" ? "default" : "outline"}
            className={cn("h-7 px-2 text-[11px]", dateMode !== "90d" && "bg-background")}
            onClick={() => setPresetRange("90d")}
          >
            90 days
          </Button>
          <Button
            type="button"
            size="sm"
            variant={dateMode === "custom" ? "default" : "outline"}
            className={cn("h-7 px-2 text-[11px]", dateMode !== "custom" && "bg-background")}
            onClick={setCustomRange}
          >
            Custom
          </Button>
        </div>

        {dateMode === "custom" ? (
          <div className="space-y-3">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              Start Date
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              End Date
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              />
            </label>
          </div>
        ) : null}

      </section>

      <section className="space-y-2 rounded-lg border border-border/70 bg-background/80 p-3">
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

        <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {isLoading ? (
            <li className="rounded-md border border-dashed border-border/60 px-2 py-3 text-center text-xs text-muted-foreground">
              Loading shops...
            </li>
          ) : null}
          {filteredInsights.map((item) => {
            const salesPerformance = getPerformance(
              item.actualSales,
              item.baseSales,
              item.salesPerformance
            )

            return (
              <li
                key={item.shopName}
                className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-xs"
              >
                <span className="truncate text-foreground">{item.shopName}</span>
                <span className="shrink-0 font-medium text-muted-foreground">
                  {salesPerformance === null ? "N/A" : `${salesPerformance.toFixed(2)}%`}
                </span>
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
