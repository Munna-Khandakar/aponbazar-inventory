"use client"

import { FullscreenTableCard } from "@/components/dashboard/fullscreen-table-card"
import { useShopInventorySnapshot } from "@/features/inventory-management/hooks/useShopInventorySnapshot"
import type {
  InventoryHealthStatus,
  ShopInventorySnapshotTableRow,
} from "@/features/inventory-management/types/ShopInventorySnapshotReport"
import { cn } from "@/lib/utils"

const quantityFormatter = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentageFormatter = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const formatQuantity = (value: number | null) => {
  if (value === null) {
    return "N/A"
  }

  return quantityFormatter.format(value)
}

const formatCurrency = (value: number | null) => {
  if (value === null) {
    return "N/A"
  }

  return `৳${currencyFormatter.format(value)}`
}

const formatPercentage = (value: number | null) => {
  if (value === null) {
    return "N/A"
  }

  return `${percentageFormatter.format(value)}%`
}

const getHealthTone = (value: InventoryHealthStatus | null) => {
  switch (value) {
    case "Healthy":
      return "bg-emerald-100 text-emerald-700"
    case "Overstocked":
      return "bg-amber-100 text-amber-700"
    case "Stockout Risk":
      return "bg-rose-100 text-rose-700"
    default:
      return "bg-slate-100 text-slate-600"
  }
}

const InventorySnapshotSkeleton = () => {
  return Array.from({ length: 7 }, (_, index) => (
    <tr key={index} className="border-b border-border/60 last:border-b-0">
      {Array.from({ length: 7 }, (_, columnIndex) => (
        <td
          key={columnIndex}
          className={cn(
            "py-3",
            columnIndex === 0 ? "pr-6" : "px-4 text-right",
            columnIndex === 6 ? "pl-4 pr-0" : ""
          )}
        >
          <div className="h-4 animate-pulse rounded bg-slate-200" />
        </td>
      ))}
    </tr>
  ))
}

function InventorySnapshotTableBody({ rows }: { rows: ShopInventorySnapshotTableRow[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <th className="py-3 pr-6 text-left">Shop Name</th>
          <th className="px-4 py-3 text-right">Current Stock (Qty)</th>
          <th className="px-4 py-3 text-right">Current Stock (Value)</th>
          <th className="px-4 py-3 text-right">5-day Lifting</th>
          <th className="px-4 py-3 text-right">Optimum Inventory Value</th>
          <th className="px-4 py-3 text-right">Inventory Health</th>
          <th className="pl-4 py-3 text-right">Forecast Accuracy</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <InventorySnapshotTableRow key={row.shopName} row={row} />
        ))}
      </tbody>
    </table>
  )
}

function InventorySnapshotTableRow({ row }: { row: ShopInventorySnapshotTableRow }) {
  return (
    <tr className="border-b border-border/60 last:border-b-0">
      <td className="py-3 pr-6">
        <div className="font-semibold text-foreground">{row.shopName}</div>
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
        {formatQuantity(row.currentStockQty)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
        {formatCurrency(row.currentStockValue)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap">
        {formatQuantity(row.fiveDayLifting)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm whitespace-nowrap text-muted-foreground">
        {formatCurrency(row.optimumInventoryValue)}
      </td>
      <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
            getHealthTone(row.inventoryHealth)
          )}
        >
          {row.inventoryHealth ?? "N/A"}
        </span>
      </td>
      <td className="pl-4 py-3 text-right font-mono text-sm whitespace-nowrap text-muted-foreground">
        {formatPercentage(row.forecastAccuracy)}
      </td>
    </tr>
  )
}

export function ShopInventorySnapshotTable() {
  const { rows, isLoading, isFetching, error } = useShopInventorySnapshot()
  const showLoadingState = isLoading || isFetching

  return (
    <FullscreenTableCard
      className="max-h-[520px] overflow-hidden"
      title="Shop inventory snapshot"
      description="Current stock, next 5-day lifting, and inventory health signals by shop"
      fullscreenDescription="Expanded view of shop-level stock quantity, stock value, 5-day lifting, and health signals."
      bodyClassName="min-h-0 flex-1 overflow-auto"
      fullscreenDisabled={showLoadingState}
    >
      {showLoadingState ? (
        <table className="w-full text-sm">
          <tbody>
            <InventorySnapshotSkeleton />
          </tbody>
        </table>
      ) : error ? (
        <div className="flex aspect-video items-center justify-center text-sm text-destructive">
          Failed to load shop inventory snapshot
        </div>
      ) : rows.length === 0 ? (
        <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
          No inventory snapshot rows available for the current filter.
        </div>
      ) : (
        <InventorySnapshotTableBody rows={rows} />
      )}
    </FullscreenTableCard>
  )
}
