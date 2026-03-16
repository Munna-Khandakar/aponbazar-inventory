"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useStorePerformance } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

type DateMode = "30d" | "90d" | "custom"
type PerformanceFilter = "all" | "high" | "mid" | "low"

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getToday = () => new Date()

const getTodayValue = () => formatDateInputValue(getToday())

const getStartOfCurrentYearValue = () => {
  const today = getToday()
  return formatDateInputValue(new Date(today.getFullYear(), 0, 1))
}

const getDateBeforeValue = (days: number) => {
  const base = getToday()
  base.setDate(base.getDate() - days)
  return formatDateInputValue(base)
}

const getPerformance = (actual: number, base: number, provided?: number) => {
  if (provided !== undefined) return provided
  if (base <= 0) return null
  return (actual / base) * 100
}

const matchesPerformanceFilter = (
  value: number | null,
  filter: PerformanceFilter
) => {
  if (filter === "all") return true
  if (value === null) return false
  if (filter === "high") return value >= 100
  if (filter === "mid") return value >= 75 && value < 100
  return value < 75
}

export function DashboardRightSidebar() {
  const { data } = useStorePerformance()
  const [dateMode, setDateMode] = useState<DateMode>("custom")
  const [performanceFilter, setPerformanceFilter] = useState<PerformanceFilter>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState(() => getStartOfCurrentYearValue())
  const [endDate, setEndDate] = useState(() => getTodayValue())

  const filteredInsights = (data ?? []).filter((item) => {
    const salesPerformance = getPerformance(
      item.actualSales,
      item.baseSales,
      item.salesPerformance
    )

    return (
      item.shopName.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
      matchesPerformanceFilter(salesPerformance, performanceFilter)
    )
  })

  const setPresetRange = (mode: Exclude<DateMode, "custom">) => {
    setDateMode(mode)
    setEndDate(getTodayValue())
    setStartDate(mode === "30d" ? getDateBeforeValue(29) : getDateBeforeValue(89))
  }

  const setCustomRange = () => {
    setDateMode("custom")
    setStartDate(getStartOfCurrentYearValue())
    setEndDate(getTodayValue())
  }

  return (
    <aside className="space-y-4 rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm">
      <section className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Filters</h3>
          <p className="text-xs text-muted-foreground">Refine the dashboard view by date and performance.</p>
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

        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Performance
          <select
            value={performanceFilter}
            onChange={(event) => setPerformanceFilter(event.target.value as PerformanceFilter)}
            className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="mid">Mid</option>
            <option value="low">Low</option>
          </select>
        </label>
      </section>

      <section className="space-y-2 rounded-lg border border-border/70 bg-background/80 p-3">
        <h3 className="text-sm font-semibold">Shop Insights</h3>

        <input
          type="text"
          placeholder="Search shop..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        />

        <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
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
          {filteredInsights.length === 0 ? (
            <li className="rounded-md border border-dashed border-border/60 px-2 py-3 text-center text-xs text-muted-foreground">
              No shops match the current filters.
            </li>
          ) : null}
        </ul>
      </section>
    </aside>
  )
}
