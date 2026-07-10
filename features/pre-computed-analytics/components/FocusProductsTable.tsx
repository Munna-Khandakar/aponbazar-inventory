"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type {
  FocusProductOutletRow,
  FocusTop20Row,
  InventoryHealth,
} from "../types/PreComputedDashboard"
import { formatBdtFull } from "../utils/formatters"
import { FocusProductDialog } from "./FocusProductDialog"

const healthDot: Record<InventoryHealth, string> = {
  Healthy: "bg-emerald-500",
  Caution: "bg-amber-500",
  Low: "bg-red-500",
}

type Props = {
  rows: FocusTop20Row[]
  focusProductStock: Record<string, FocusProductOutletRow[]>
  isLoading: boolean
}

const COLLAPSE_THRESHOLD = 8

export function FocusProductsTable({ rows, focusProductStock, isLoading }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const selectedRows = selected ? (focusProductStock[selected] ?? []) : []
  const collapsible = rows.length > COLLAPSE_THRESHOLD

  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>
            Focus Products / Subcategories{" "}
            <span className="text-sm font-normal text-muted-foreground">(Top 20)</span>
          </CardTitle>
          <CardDescription>
            Click any row to view outlet-wise inventory details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-md" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No focus product data available.</p>
          ) : (
            <>
            <div
              className={cn(
                "relative overflow-x-auto",
                collapsible && !expanded && "max-h-[440px] overflow-y-hidden"
              )}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs text-muted-foreground">
                    <th className="py-2 pr-3 text-left font-medium">#</th>
                    <th className="py-2 pr-3 text-left font-medium">Subcategory</th>
                    <th className="py-2 pr-3 text-right font-medium">Sales Value (BDT)</th>
                    <th className="py-2 pr-3 text-right font-medium">Sales %</th>
                    <th className="py-2 pr-3 text-right font-medium">Current Stock Value (BDT)</th>
                    <th className="py-2 pr-3 text-right font-medium">5-Day Lifting (BDT)</th>
                    <th className="py-2 text-left font-medium">Inventory Health</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    const clickable = Boolean(focusProductStock[row.subCategory])
                    return (
                      <tr
                        key={row.subCategory}
                        onClick={() => clickable && setSelected(row.subCategory)}
                        className={cn(
                          "border-b border-border/40 transition-colors",
                          clickable ? "cursor-pointer hover:bg-muted/40" : "opacity-90"
                        )}
                      >
                        <td className="py-2.5 pr-3 text-muted-foreground tabular-nums">{index + 1}</td>
                        <td className="py-2.5 pr-3 font-medium text-foreground">{row.subCategory}</td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-foreground">
                          {formatBdtFull(row.netSales)}
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-muted-foreground">
                          {row.salesPct.toFixed(1)}%
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-foreground">
                          {formatBdtFull(row.currentStockValue)}
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums text-foreground">
                          {formatBdtFull(row.lifting5d)}
                        </td>
                        <td className="py-2.5">
                          {row.inventoryHealth ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  healthDot[row.inventoryHealth]
                                )}
                              />
                              {row.inventoryHealth}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {collapsible && !expanded ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card to-transparent" />
              ) : null}
            </div>
            {collapsible ? (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted/40"
                >
                  {expanded ? "Show less" : `Show all ${rows.length}`}
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform", expanded && "rotate-180")}
                  />
                </button>
              </div>
            ) : null}
            </>
          )}
        </CardContent>
      </Card>

      {selected ? (
        <FocusProductDialog
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
          productName={selected}
          rows={selectedRows}
        />
      ) : null}
    </>
  )
}
