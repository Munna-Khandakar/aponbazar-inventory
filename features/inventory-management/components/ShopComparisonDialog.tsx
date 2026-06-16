"use client"

import {
  Box,
  GaugeCircle,
  Package,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react"

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

const SHOP_TONES = [
  {
    header: "bg-sky-50 text-sky-800",
    border: "border-sky-200",
    accent: "text-sky-700",
    dot: "bg-sky-500",
  },
  {
    header: "bg-violet-50 text-violet-800",
    border: "border-violet-200",
    accent: "text-violet-700",
    dot: "bg-violet-500",
  },
  {
    header: "bg-amber-50 text-amber-800",
    border: "border-amber-200",
    accent: "text-amber-700",
    dot: "bg-amber-500",
  },
] as const

type ComparisonMetric = {
  label: string
  icon: React.ElementType
  render: (row: ShopInventorySnapshotTableRow) => React.ReactNode
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    label: "Current Stock Qty",
    icon: Package,
    render: (row) => (
      <span className="font-mono text-foreground">
        {formatQuantity(row.currentStockQty)}
      </span>
    ),
  },
  {
    label: "Current Stock Value",
    icon: Wallet,
    render: (row) => (
      <span className="font-mono text-foreground">
        {formatCurrency(row.currentStockValue)}
      </span>
    ),
  },
  {
    label: "5-day Lifting",
    icon: TrendingUp,
    render: (row) => (
      <span className="font-mono text-foreground">
        {formatQuantity(row.fiveDayLifting)}
      </span>
    ),
  },
  {
    label: "Optimum Inventory Value",
    icon: Target,
    render: (row) => (
      <span className="font-mono text-muted-foreground">
        {formatCurrency(row.optimumInventoryValue)}
      </span>
    ),
  },
  {
    label: "Inventory Health",
    icon: GaugeCircle,
    render: (row) => (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
          getHealthTone(row.inventoryHealth)
        )}
      >
        {row.inventoryHealth ?? "N/A"}
      </span>
    ),
  },
  {
    label: "Forecast Accuracy",
    icon: Box,
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
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">Shop comparison</DialogTitle>
          <DialogDescription>
            Side-by-side view of {shops.length} selected shops across all inventory metrics.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto border-t border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-muted/50 py-3 pl-6 pr-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Metric
                </th>
                {shops.map((shop, i) => {
                  const tone = SHOP_TONES[i % SHOP_TONES.length]
                  return (
                    <th
                      key={shop.shopName}
                      className={cn(
                        "px-4 py-3 text-right text-xs font-semibold",
                        tone.header
                      )}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={cn("inline-block h-2 w-2 rounded-full", tone.dot)}
                        />
                        {shop.shopName}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_METRICS.map((metric, idx) => {
                const Icon = metric.icon
                return (
                  <tr
                    key={metric.label}
                    className={cn(
                      "border-b border-border/40 last:border-b-0 transition-colors",
                      idx % 2 === 0 ? "bg-background" : "bg-muted/30"
                    )}
                  >
                    <td className="sticky left-0 py-3.5 pl-6 pr-4 text-sm font-medium text-foreground bg-inherit">
                      <div className="flex items-center gap-2.5">
                        <Icon size={15} className="shrink-0 text-muted-foreground" />
                        {metric.label}
                      </div>
                    </td>
                    {shops.map((shop) => (
                      <td
                        key={shop.shopName}
                        className="px-4 py-3.5 text-right text-sm whitespace-nowrap"
                      >
                        {metric.render(shop)}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
