"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  inventoryBlockTableMock,
  type InventoryBlockTableBlock,
  type InventoryBlockTableCategory,
} from "@/features/inventory-management/mocks/blockInventoryTable.mock"
import { cn } from "@/lib/utils"

type SortKey = "days" | "stock" | "lifting" | "reorder" | "name"
type StockHealth = "ok" | "warn" | "crit"

const TABLE_COLUMNS = [
  { key: "name", label: "Block / Category", width: "2.2fr" },
  { key: "stock", label: "Current Stock", width: "1fr" },
  { key: "lifting", label: "Predicted Lift (5D)", width: "1.1fr" },
  { key: "days", label: "Days Until Stockout", width: "0.9fr" },
  { key: "reorder", label: "Recom. Reorder Qty", width: "1.1fr" },
  { key: "supplier", label: "Supplier", width: "1fr" },
] as const

const COLUMN_TEMPLATE = TABLE_COLUMNS.map((column) => column.width).join(" ")

const toneStyles: Record<
  StockHealth,
  {
    accent: string
    rowBorderClass: string
    chipClass: string
    textClass: string
  }
> = {
  ok: {
    accent: "#10b981",
    rowBorderClass: "border-l-[#10b981]",
    chipClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    textClass: "text-emerald-700",
  },
  warn: {
    accent: "#f59e0b",
    rowBorderClass: "border-l-amber-400",
    chipClass: "border-amber-200 bg-amber-50 text-amber-700",
    textClass: "text-amber-700",
  },
  crit: {
    accent: "#ef4444",
    rowBorderClass: "border-l-red-500",
    chipClass: "border-red-200 bg-red-50 text-red-700",
    textClass: "text-red-700",
  },
}

const formatCompactNumber = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return Math.round(value).toLocaleString("en-BD")
}

const getStockHealth = (days: number, leadTime: number): StockHealth => {
  if (days > leadTime) return "ok"
  if (days > Math.max(1, Math.round(leadTime * 0.4))) return "warn"
  return "crit"
}

const getReorderMetrics = (stockOut: number, pct: number, leadTime: number) => {
  const dailyDemand = Math.round(stockOut / 30)
  const demandWindow = dailyDemand * leadTime * 2
  const safetyBuffer = dailyDemand * leadTime
  const quantity = Math.max(0, Math.round(demandWindow + safetyBuffer - stockOut * (pct / 100)))

  return {
    dailyDemand,
    quantity,
    demandWindow,
    safetyBuffer,
  }
}

const sortRows = <
  T extends Pick<InventoryBlockTableBlock, "name" | "stockIn" | "lifting5d" | "stockOut" | "pct" | "days">,
>(
  rows: T[],
  sortKey: SortKey,
  leadTime: number
) =>
  [...rows].sort((left, right) => {
    if (sortKey === "days") return left.days - right.days
    if (sortKey === "name") return left.name.localeCompare(right.name)
    if (sortKey === "stock") return right.stockIn - left.stockIn
    if (sortKey === "lifting") return right.lifting5d - left.lifting5d

    return (
      getReorderMetrics(right.stockOut, right.pct, leadTime).quantity -
      getReorderMetrics(left.stockOut, left.pct, leadTime).quantity
    )
  })

export function BlockInventoryTable() {
  const [sortKey, setSortKey] = useState<SortKey>("days")
  const [leadTime, setLeadTime] = useState(7)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)

  const selectedBlock = useMemo(
    () => inventoryBlockTableMock.find((block) => block.id === selectedBlockId) ?? null,
    [selectedBlockId]
  )

  const visibleRows = useMemo(
    () =>
      sortRows<InventoryBlockTableBlock | InventoryBlockTableCategory>(
        selectedBlock ? selectedBlock.categories : inventoryBlockTableMock,
        sortKey,
        leadTime
      ),
    [leadTime, selectedBlock, sortKey]
  )

  const summary = useMemo(() => {
    return visibleRows.reduce(
      (accumulator, row) => {
        const tone = getStockHealth(row.days, leadTime)
        accumulator[tone] += 1
        return accumulator
      },
      { ok: 0, warn: 0, crit: 0 }
    )
  }, [leadTime, visibleRows])

  return (
    <Card className="overflow-hidden border-border/70 bg-card py-0 text-card-foreground shadow-sm">
      <CardHeader className="gap-0 px-0 pt-0">

        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3 text-[11px] text-slate-500">
          <button
            type="button"
            onClick={() => {
              setSelectedBlockId(null)
              setExpandedCategoryId(null)
            }}
            className={cn(
              "transition hover:text-slate-900",
              !selectedBlock && "font-semibold text-slate-900"
            )}
          >
            All Blocks
          </button>
          {selectedBlock ? (
            <>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-900">{selectedBlock.name}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedBlockId(null)
                  setExpandedCategoryId(null)
                }}
                className="ml-auto inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600 transition hover:bg-slate-100"
              >
                <ChevronLeft className="h-3 w-3" />
                Back
              </button>
            </>
          ) : (
            <span className="ml-auto text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Click a block to drill down
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="flex flex-wrap items-center gap-2 border-y border-slate-200 bg-slate-50 px-6 py-2 text-[10px] uppercase tracking-[0.16em]">
          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-red-700">
            {summary.crit} Critical
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">
            {summary.warn} Warning
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
            {summary.ok} Healthy
          </span>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-700">
            Horizon {leadTime} Days
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[940px]">
            <div
              className="grid border-b border-slate-200 bg-slate-50"
              style={{ gridTemplateColumns: COLUMN_TEMPLATE }}
            >
              {TABLE_COLUMNS.map((column) => (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => {
                    if (column.key === "supplier") return
                    setSortKey(column.key)
                  }}
                  className={cn(
                    "flex items-center gap-2 border-r border-slate-200 px-4 py-3 text-left text-[10px] uppercase tracking-[0.16em] text-slate-500 transition last:border-r-0",
                    column.key !== "supplier" && "hover:text-slate-900",
                    sortKey === column.key && "text-sky-700"
                  )}
                >
                  <span>{column.label}</span>
                  {column.key !== "supplier" ? <ArrowUpDown className="h-3 w-3" /> : null}
                </button>
              ))}
            </div>

            <div className="bg-white">
              {visibleRows.map((row) => {
                const tone = getStockHealth(row.days, leadTime)
                const reorder = getReorderMetrics(row.stockOut, row.pct, leadTime)
                const isExpandedCategory =
                  selectedBlock && expandedCategoryId === row.id && "products" in row

                return (
                  <div key={row.id} className="border-b border-slate-200 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedBlock) {
                          setSelectedBlockId(row.id)
                          setExpandedCategoryId(null)
                          return
                        }

                        if ("products" in row) {
                          setExpandedCategoryId((current) => (current === row.id ? null : row.id))
                        }
                      }}
                      className={cn(
                        "grid w-full border-l-2 text-left transition hover:bg-sky-50",
                        toneStyles[tone].rowBorderClass,
                        isExpandedCategory && "bg-sky-50"
                      )}
                      style={{ gridTemplateColumns: COLUMN_TEMPLATE }}
                    >
                      <div className="flex min-w-0 items-center gap-3 border-r border-slate-200 px-4 py-4">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: toneStyles[tone].accent }}
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-slate-900">
                            {row.name}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {"categories" in row
                              ? `${row.cats} categories · ${row.items} SKUs`
                              : `${row.items} items · lead ${row.lead}d`}
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            "ml-auto h-4 w-4 shrink-0 text-slate-400 transition",
                            (!selectedBlock || isExpandedCategory) && "rotate-90 text-sky-600"
                          )}
                        />
                      </div>

                      <div className="flex items-center border-r border-slate-200 px-4 py-4">
                        <div className="flex w-full items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${row.pct}%`,
                                backgroundColor: toneStyles[tone].accent,
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-slate-500">
                            {formatCompactNumber(row.stockIn)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center border-r border-slate-200 px-4 py-4 text-xs text-slate-700">
                        {formatCompactNumber(row.lifting5d)}
                      </div>

                      <div
                        className={cn(
                          "flex items-center border-r border-slate-200 px-4 py-4 text-sm font-semibold tabular-nums",
                          toneStyles[tone].textClass
                        )}
                      >
                        {row.days === 0 ? "<1d" : `${row.days}d`}
                      </div>

                      <div className="flex items-center border-r border-slate-200 px-4 py-4">
                        <span
                          className={cn(
                            "rounded-md border px-2.5 py-1 text-[11px] font-semibold tabular-nums",
                            toneStyles[tone].chipClass
                          )}
                        >
                          {tone === "crit" ? "Urgent " : ""}
                          {formatCompactNumber(reorder.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center px-4 py-4 text-xs text-slate-500">
                        {"supplier" in row ? row.supplier : "-"}
                      </div>
                    </button>

                    {isExpandedCategory ? (
                      <div className="bg-slate-50/70">
                        {row.products.map((product) => {
                          const productTone = getStockHealth(product.days, leadTime)
                          const productReorder = getReorderMetrics(
                            product.stockOut,
                            product.pct,
                            leadTime
                          )

                          return (
                            <div
                              key={product.id}
                              className="grid border-t border-slate-200 text-[11px] text-slate-700"
                              style={{ gridTemplateColumns: COLUMN_TEMPLATE }}
                            >
                              <div className="flex min-w-0 items-center gap-3 border-r border-slate-200 px-4 py-3 pl-8">
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{ backgroundColor: toneStyles[productTone].accent }}
                                />
                                <div className="min-w-0">
                                  <div className="truncate font-medium text-slate-900">
                                    {product.name}
                                  </div>
                                  <div className="mt-1 font-mono text-[10px] text-slate-500">
                                    {product.code}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center border-r border-slate-200 px-4 py-3 text-slate-500">
                                {formatCompactNumber(product.stockIn)}
                              </div>
                              <div className="flex items-center border-r border-slate-200 px-4 py-3 text-slate-500">
                                {formatCompactNumber(product.lifting5d)}
                              </div>
                              <div
                                className={cn(
                                  "flex items-center border-r border-slate-200 px-4 py-3 font-semibold",
                                  toneStyles[productTone].textClass
                                )}
                              >
                                {product.days === 0 ? "<1d" : `${product.days}d`}
                              </div>
                              <div className="flex items-center border-r border-slate-200 px-4 py-3">
                                <span
                                  className={cn(
                                    "rounded-md border px-2 py-1 text-[10px] font-semibold",
                                    toneStyles[productTone].chipClass
                                  )}
                                >
                                  {formatCompactNumber(productReorder.quantity)}
                                </span>
                              </div>
                              <div className="flex items-center px-4 py-3 text-[10px] text-slate-500">
                                {product.supplier} · {product.lead}d
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
