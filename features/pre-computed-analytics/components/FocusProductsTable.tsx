"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type { FocusProductOutletRow } from "../types/PreComputedDashboard"
import { FocusProductDialog } from "./FocusProductDialog"

type Props = {
  focusProductStock: Record<string, FocusProductOutletRow[]>
  isLoading: boolean
}

export function FocusProductsTable({ focusProductStock, isLoading }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const entries = Object.entries(focusProductStock)
  const selectedRows = selected ? (focusProductStock[selected] ?? []) : []

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Focus Products</CardTitle>
          <CardDescription>Click a product to view outlet-level stock details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No focus product data available.</p>
          ) : (
            <div className="space-y-1">
              {entries.map(([product, rows]) => {
                const atRisk = rows.filter((r) => r.inventoryHealth === "Stockout Risk").length
                return (
                  <button
                    key={product}
                    type="button"
                    onClick={() => setSelected(product)}
                    className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-left transition hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{product}</span>
                      <span className="rounded-full border border-border/50 bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                        {rows.length} outlet{rows.length !== 1 ? "s" : ""}
                      </span>
                      {atRisk > 0 ? (
                        <span
                          className={cn(
                            "rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                          )}
                        >
                          {atRisk} stockout risk
                        </span>
                      ) : null}
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selected ? (
        <FocusProductDialog
          open={selected !== null}
          onOpenChange={(open) => { if (!open) setSelected(null) }}
          productName={selected}
          rows={selectedRows}
        />
      ) : null}
    </>
  )
}
