"use client"

import { useEffect, useState } from "react"
import { Maximize2, X } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StorePerformanceTableSkeleton } from "@/components/dashboard/report-skeletons"
import { Button } from "@/components/ui/button"
import { useStorePerformanceSnapshot } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

const formatCurrency = (value?: number) =>
  value === undefined
    ? "N/A"
    : `৳${value.toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`

const formatPercentage = (value?: number) =>
  value === undefined ? "N/A" : `${value.toFixed(2)}%`

const getMetricTone = (value?: number) => {
  if (value === undefined) {
    return "text-slate-500"
  }

  if (value >= 100) {
    return "text-emerald-700"
  }

  if (value >= 75) {
    return "text-amber-700"
  }

  return "text-rose-700"
}

const getForecastAccuracyTone = (value?: number) => {
  if (value === undefined) {
    return "text-slate-500"
  }

  if (value >= 75) {
    return "text-emerald-700"
  }

  if (value >= 40) {
    return "text-amber-700"
  }

  return "text-rose-700"
}

const getMetricBadgeTone = (value?: number) => {
  if (value === null) {
    return "bg-slate-100 text-slate-600"
  }

  if (value === undefined) {
    return "bg-slate-100 text-slate-600"
  }

  if (value >= 100) {
    return "bg-emerald-100 text-emerald-700"
  }

  if (value >= 75) {
    return "bg-amber-100 text-amber-700"
  }

  return "bg-rose-100 text-rose-700"
}

function StorePerformanceSnapshotTable({ rows }: { rows: ReturnType<typeof useStorePerformanceSnapshot>["data"] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <th className="py-3 pr-6 text-left">Shop Name</th>
          <th className="px-4 py-3 text-right">Target Sales</th>
          <th className="px-4 py-3 text-right">MTD Sales</th>
          <th className="px-4 py-3 text-right">Predicted Sales (ROM)</th>
          <th className="px-4 py-3 text-right">MTD Target vs Sales</th>
          <th className="px-4 py-3 text-right">Predicted Gap</th>
          <th className="pl-4 py-3 text-right">Forecast Accuracy</th>
        </tr>
      </thead>
      <tbody>
        {rows?.map((store) => {
          return (
            <tr key={store.shopName} className="border-b border-border/60 last:border-b-0">
              <td className="py-3 pr-6">
                <div className="font-semibold text-foreground">{store.shopName}</div>
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
                {formatCurrency(store.targetSales)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
                {formatCurrency(store.mtdSales)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
                {formatCurrency(store.predictedSalesRom)}
              </td>
              <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                    getMetricBadgeTone(store.mtdTargetVsSales)
                  )}
                >
                  {formatPercentage(store.mtdTargetVsSales)}
                </span>
              </td>
              <td
                className={cn(
                  "px-4 py-3 text-right font-mono text-sm whitespace-nowrap",
                  getMetricTone(store.predictedGap)
                )}
              >
                {formatPercentage(store.predictedGap)}
              </td>
              <td
                className={cn(
                  "pl-4 py-3 text-right font-mono text-sm whitespace-nowrap",
                  getForecastAccuracyTone(store.forecastAccuracy)
                )}
              >
                {formatPercentage(store.forecastAccuracy)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function StorePerformanceTable() {
  const { data, isLoading, isFetching, error } = useStorePerformanceSnapshot()
  const rows = data ?? []
  const [isFullscreen, setIsFullscreen] = useState(false)
  const showLoadingState = isLoading || isFetching

  useEffect(() => {
    if (!isFullscreen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isFullscreen])

  return (
    <>
      <Card className="max-h-[520px] overflow-hidden">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Shop performance snapshot</CardTitle>
            <CardDescription>
              Target, MTD sales, ROM forecast, and forecast quality by shop
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={showLoadingState}
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 size={15} />
            Full Screen
          </Button>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-auto">
          {showLoadingState ? (
            <table className="w-full text-sm">
              <tbody>
                <StorePerformanceTableSkeleton />
              </tbody>
            </table>
          ) : error ? (
            <div className="flex aspect-video items-center justify-center text-sm text-destructive">
              Failed to load shop performance data
            </div>
          ) : (
            <StorePerformanceSnapshotTable rows={rows} />
          )}
        </CardContent>
      </Card>

      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex h-full w-full flex-col rounded-3xl border border-border/70 bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Shop performance snapshot</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Expanded table view for target, MTD sales, ROM forecast, and accuracy.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsFullscreen(false)}
              >
                <X size={15} />
                Close
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
              {error ? (
                <div className="flex h-full items-center justify-center text-sm text-destructive">
                  Failed to load shop performance data
                </div>
              ) : (
                <StorePerformanceSnapshotTable rows={rows} />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
