"use client"

import { useMemo, useState } from "react"

import { FullscreenTableCard } from "@/components/dashboard/fullscreen-table-card"
import { StorePerformanceTableSkeleton } from "@/components/dashboard/report-skeletons"
import { Checkbox } from "@/components/ui/checkbox"
import { useStorePerformanceSnapshot } from "@/hooks/use-dashboard"
import type { StorePerformanceSnapshotData } from "@/lib/types/dashboard"
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

function StorePerformanceSnapshotTable({ rows }: { rows: StorePerformanceSnapshotData[] }) {
  const [prevRows, setPrevRows] = useState(rows)
  const [selectedShops, setSelectedShops] = useState<Set<string>>(
    () => new Set(rows.map((store) => store.shopName))
  )

  if (rows !== prevRows) {
    setPrevRows(rows)
    setSelectedShops(new Set(rows.map((store) => store.shopName)))
  }

  const allSelected = rows.length > 0 && selectedShops.size === rows.length
  const someSelected = selectedShops.size > 0 && !allSelected

  const toggleShop = (shopName: string) => {
    setSelectedShops((prev) => {
      const next = new Set(prev)
      if (next.has(shopName)) {
        next.delete(shopName)
      } else {
        next.add(shopName)
      }
      return next
    })
  }

  const toggleAll = () => {
    setSelectedShops(allSelected ? new Set() : new Set(rows.map((store) => store.shopName)))
  }

  const totals = useMemo(() => {
    const selectedRows = rows.filter((store) => selectedShops.has(store.shopName))
    return selectedRows.reduce(
      (acc, store) => ({
        targetSales: acc.targetSales + (store.targetSales ?? 0),
        mtdSales: acc.mtdSales + (store.mtdSales ?? 0),
        predictedSalesRom: acc.predictedSalesRom + (store.predictedSalesRom ?? 0),
      }),
      { targetSales: 0, mtdSales: 0, predictedSalesRom: 0 }
    )
  }, [rows, selectedShops])

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <th className="w-10 py-3 pl-1 pr-2">
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={toggleAll}
              aria-label="Select all shops"
            />
          </th>
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
        {rows.map((store) => {
          const isSelected = selectedShops.has(store.shopName)
          return (
            <tr key={store.shopName} className="border-b border-border/60 last:border-b-0">
              <td className="w-10 py-3 pl-1 pr-2">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleShop(store.shopName)}
                  aria-label={`Select ${store.shopName}`}
                />
              </td>
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
      <tfoot>
        <tr className="sticky bottom-0 border-t-2 border-border bg-muted/60 font-semibold backdrop-blur-sm">
          <td className="py-3 pl-1 pr-2" />
          <td className="py-3 pr-6 text-foreground">Total ({selectedShops.size} selected)</td>
          <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
            {formatCurrency(totals.targetSales)}
          </td>
          <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
            {formatCurrency(totals.mtdSales)}
          </td>
          <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
            {formatCurrency(totals.predictedSalesRom)}
          </td>
          <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-muted-foreground">—</td>
          <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-muted-foreground">—</td>
          <td className="pl-4 py-3 text-right text-sm whitespace-nowrap text-muted-foreground">—</td>
        </tr>
      </tfoot>
    </table>
  )
}

export function StorePerformanceTable() {
  const { data, isLoading, isFetching, error } = useStorePerformanceSnapshot()
  const rows = data ?? []
  const showLoadingState = isLoading || isFetching

  return (
    <FullscreenTableCard
      className="max-h-[520px] overflow-hidden"
      title="Shop performance snapshot"
      description="Target, MTD sales, ROM forecast, and forecast quality by shop"
      fullscreenDescription="Expanded table view for target, MTD sales, ROM forecast, and accuracy."
      bodyClassName="min-h-0 flex-1 overflow-auto"
      fullscreenDisabled={showLoadingState}
    >
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
    </FullscreenTableCard>
  )
}
