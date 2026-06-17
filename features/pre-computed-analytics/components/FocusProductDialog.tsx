"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import type { FocusProductOutletRow } from "../types/PreComputedDashboard"

function formatQty(value: number | null) {
  if (value == null) return "—"
  return value.toLocaleString("en-BD", { maximumFractionDigits: 0 })
}

function formatBdt(value: number | null) {
  if (value == null) return "—"
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `৳${(value / 1_000).toFixed(1)}k`
  return `৳${value.toLocaleString("en-BD")}`
}

const healthStyles: Record<string, string> = {
  Healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overstocked: "bg-amber-50 text-amber-700 border-amber-200",
  "Stockout Risk": "bg-red-50 text-red-700 border-red-200",
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  rows: FocusProductOutletRow[]
}

export function FocusProductDialog({ open, onOpenChange, productName, rows }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{productName}</DialogTitle>
          <DialogDescription>
            Stock snapshot across all outlets — refreshed daily at 02:00
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto border-t border-border/60" style={{ maxHeight: "60vh" }}>
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">
                  Outlet
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground">
                  Current Stock Qty
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground">
                  Current Stock Value
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground">
                  5-Day Lifting
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground">
                  Optimum Inventory Value
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center font-medium text-muted-foreground">
                  Inventory Health
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.shopName}
                  className={cn(
                    "border-t border-border/40 transition-colors hover:bg-muted/30",
                    i % 2 === 1 && "bg-muted/10"
                  )}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                    {row.shopName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-foreground">
                    {formatQty(row.currentStockQty)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-foreground">
                    {formatBdt(row.currentStockValue)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-foreground">
                    {formatQty(row.fiveDayLifting)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-foreground">
                    {formatBdt(row.optimumInventoryValue)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.inventoryHealth ? (
                      <span
                        className={cn(
                          "inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          healthStyles[row.inventoryHealth] ?? "bg-muted text-muted-foreground"
                        )}
                      >
                        {row.inventoryHealth}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border/60 px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {rows.length} outlet{rows.length !== 1 ? "s" : ""}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
