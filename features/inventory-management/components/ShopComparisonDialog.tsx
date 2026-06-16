"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ShopInventorySnapshotTableRow } from "@/features/inventory-management/types/ShopInventorySnapshotReport"
import {
  formatCurrency,
  formatPercentage,
  formatQuantity,
  getHealthTone,
} from "@/features/inventory-management/utils/shopSnapshotFormatters"
import { cn } from "@/lib/utils"

type ComparisonMetric = {
  label: string
  render: (row: ShopInventorySnapshotTableRow) => React.ReactNode
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    label: "Current Stock Qty",
    render: (row) => (
      <span className="font-mono">{formatQuantity(row.currentStockQty)}</span>
    ),
  },
  {
    label: "Current Stock Value",
    render: (row) => (
      <span className="font-mono">{formatCurrency(row.currentStockValue)}</span>
    ),
  },
  {
    label: "5-day Lifting",
    render: (row) => (
      <span className="font-mono">{formatQuantity(row.fiveDayLifting)}</span>
    ),
  },
  {
    label: "Optimum Inventory Value",
    render: (row) => (
      <span className="font-mono text-muted-foreground">
        {formatCurrency(row.optimumInventoryValue)}
      </span>
    ),
  },
  {
    label: "Inventory Health",
    render: (row) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
          getHealthTone(row.inventoryHealth)
        )}
      >
        {row.inventoryHealth ?? "N/A"}
      </span>
    ),
  },
  {
    label: "Forecast Accuracy",
    render: (row) => (
      <span className="font-mono text-muted-foreground">
        {formatPercentage(row.forecastAccuracy)}
      </span>
    ),
  },
]

type ShopComparisonDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  shops: ShopInventorySnapshotTableRow[]
}

export function ShopComparisonDialog({
  open,
  onOpenChange,
  shops,
}: ShopComparisonDialogProps) {
  if (shops.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Shop comparison</DialogTitle>
          <DialogDescription>
            Side-by-side comparison of {shops.length} selected shops.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4 text-left">Metric</th>
                {shops.map((shop) => (
                  <th key={shop.shopName} className="px-4 py-3 text-right">
                    {shop.shopName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_METRICS.map((metric) => (
                <tr
                  key={metric.label}
                  className="border-b border-border/60 last:border-b-0"
                >
                  <td className="py-3 pr-4 text-sm font-medium text-foreground">
                    {metric.label}
                  </td>
                  {shops.map((shop) => (
                    <td
                      key={shop.shopName}
                      className="px-4 py-3 text-right text-sm whitespace-nowrap"
                    >
                      {metric.render(shop)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
