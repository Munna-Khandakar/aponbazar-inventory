"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ChevronDown, LogOut, Store, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useReportFilters } from "@/hooks/use-report-filters"
import { cn } from "@/lib/utils"

type DashboardTopbarProps = {
  onSignOut: () => void
}

const parseDateInputValue = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

const getInclusiveDayCount = (startDate: string, endDate: string) => {
  const start = parseDateInputValue(startDate)
  const end = parseDateInputValue(endDate)

  if (!start || !end) {
    return null
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1
}

const dashboardPages = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Track headline metrics, operational health, and current commercial signals.",
  },
  {
    href: "/dashboard/sales-prediction",
    label: "Sales Prediction",
    description: "Review forecast performance, shop-level sales, and commercial momentum.",
  },
  {
    href: "/dashboard/inventory-management",
    label: "Inventory Management",
    description: "Monitor inventory movement, stock mix, and planning coverage across shops.",
  },
  {
    href: "/dashboard/customer-behavior",
    label: "Customer Behavior",
    description: "Analyze customer segments, churn risk, and retention performance patterns.",
  },
]

export function DashboardTopbar({ onSignOut }: DashboardTopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { dateMode, startDate, endDate, shopName, setShopName, setPresetRange, setCustomRange } =
    useReportFilters()
  const showDateFilters = pathname !== "/dashboard/inventory-management"
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false)
  const [draftStartDate, setDraftStartDate] = useState(startDate)
  const [draftEndDate, setDraftEndDate] = useState(endDate)

  useEffect(() => {
    if (!isCustomRangeOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCustomRangeOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isCustomRangeOpen])

  const customRangeLength = getInclusiveDayCount(draftStartDate, draftEndDate)
  const isCustomRangeInvalid =
    !draftStartDate ||
    !draftEndDate ||
    draftStartDate > draftEndDate ||
    customRangeLength === null ||
    customRangeLength > 30

  const openCustomRangeModal = () => {
    setDraftStartDate(startDate)
    setDraftEndDate(endDate)
    setIsCustomRangeOpen(true)
  }
  const currentPage =
    dashboardPages.find((page) => page.href === pathname) ?? dashboardPages[0]

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-border/70 bg-background/95 px-4 py-3 shadow-sm backdrop-blur sm:px-5">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <p className="text-xl font-semibold tracking-tight text-foreground">
                {currentPage.label}
              </p>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {currentPage.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:gap-2">
            <div className="relative min-w-[220px] sm:w-auto">
              <label htmlFor="dashboard-page-select" className="sr-only">
                Navigate between dashboard pages
              </label>
              <select
                id="dashboard-page-select"
                value={pathname}
                onChange={(event) => router.push(event.target.value)}
                className="h-9 w-full appearance-none rounded-xl border border-border/70 bg-card px-4 pr-10 text-sm font-medium text-foreground shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                {dashboardPages.map((page) => (
                  <option key={page.href} value={page.href}>
                    {page.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {showDateFilters ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={dateMode === "previousMonth" ? "default" : "outline"}
                  className={cn(
                    "h-9 rounded-xl px-4",
                    dateMode !== "previousMonth" && "bg-background"
                  )}
                  onClick={() => setPresetRange("previousMonth")}
                >
                  Previous Month
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={dateMode === "currentMonth" ? "default" : "outline"}
                  className={cn(
                    "h-9 rounded-xl px-4",
                    dateMode !== "currentMonth" && "bg-background"
                  )}
                  onClick={() => setPresetRange("currentMonth")}
                >
                  Current Month
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={dateMode === "nextMonth" ? "default" : "outline"}
                  className={cn(
                    "h-9 rounded-xl px-4",
                    dateMode !== "nextMonth" && "bg-background"
                  )}
                  onClick={() => setPresetRange("nextMonth")}
                >
                  Next Month
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={dateMode === "custom" ? "default" : "outline"}
                  className={cn("h-9 rounded-xl px-4", dateMode !== "custom" && "bg-background")}
                  onClick={openCustomRangeModal}
                >
                  Custom
                </Button>
              </div>
            ) : null}
          </div>

          <Button
            variant="outline"
            className="h-9 rounded-xl justify-center gap-2 self-start lg:self-auto"
            onClick={onSignOut}
          >
            <LogOut size={16} />
            Sign out
          </Button>
          </div>
        </div>
      </div>

      {shopName ? (
        <div className="pointer-events-none fixed inset-x-0 top-1 z-40 flex justify-center px-4">
          <div className="pointer-events-auto inline-flex max-w-[min(92vw,40rem)] items-center gap-2 rounded-full border border-sky-200 bg-background/95 px-3 py-2 text-sm font-medium text-sky-700 shadow-lg ring-1 ring-sky-100 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-2 rounded-full border-sky-200 bg-sky-50 px-3 text-sky-700 hover:bg-sky-100 hover:text-sky-800"
              onClick={() => setShopName("")}
            >
              <ArrowLeft size={14} />
              Back
            </Button>
            <div className="flex min-w-0 items-center gap-2">
              <Store size={14} className="shrink-0" />
              <span className="truncate">Showing results for {shopName}</span>
            </div>
          </div>
        </div>
      ) : null}

      {showDateFilters && isCustomRangeOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4"
          onClick={() => setIsCustomRangeOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border/70 bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Custom date range</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select the start and end dates for the dashboard data window.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomRangeOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:text-foreground"
                aria-label="Close custom date range modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-start-date">Start date</Label>
                <Input
                  id="custom-start-date"
                  type="date"
                  value={draftStartDate}
                  onChange={(event) => setDraftStartDate(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-end-date">End date</Label>
                <Input
                  id="custom-end-date"
                  type="date"
                  value={draftEndDate}
                  onChange={(event) => setDraftEndDate(event.target.value)}
                />
              </div>

              {isCustomRangeInvalid ? (
                <p className="text-sm text-destructive">
                  Enter a valid range where the start date is before the end date and the
                  range does not exceed 30 days.
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsCustomRangeOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-xl"
                disabled={isCustomRangeInvalid}
                onClick={() => {
                  setCustomRange(draftStartDate, draftEndDate)
                  setIsCustomRangeOpen(false)
                }}
              >
                Apply range
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
