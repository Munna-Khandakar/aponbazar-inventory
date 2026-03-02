"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const insightItems = Array.from({ length: 64 }, (_, index) => {
  if (index === 0) {
    return { shopName: "Mirpur Branch", performance: "77.67%" }
  }

  const score = 70 + ((index * 37) % 30) + ((index * 11) % 100) / 100
  return {
    shopName: `Shop ${String(index + 1).padStart(2, "0")}`,
    performance: `${score.toFixed(2)}%`,
  }
})

type DateMode = "30d" | "90d" | "custom"

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

export function DashboardRightSidebar() {
  const [dateMode, setDateMode] = useState<DateMode>("custom")
  const [startDate, setStartDate] = useState(() => getStartOfCurrentYearValue())
  const [endDate, setEndDate] = useState(() => getTodayValue())

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
          <select className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
            <option>High</option>
            <option>Mid</option>
            <option>Low</option>
          </select>
        </label>
      </section>

      <section className="space-y-2 rounded-lg border border-border/70 bg-background/80 p-3">
        <h3 className="text-sm font-semibold">Shop Insights</h3>

        <input
          type="text"
          placeholder="Search shop..."
          className="w-full rounded-md border border-border/70 bg-background px-2 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
        />

        <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {insightItems.map((item) => (
            <li
              key={item.shopName}
              className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-xs"
            >
              <span className="truncate text-foreground">{item.shopName}</span>
              <span className="shrink-0 font-medium text-muted-foreground">{item.performance}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
