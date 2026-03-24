"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useInventoryBlockTableData } from "@/features/inventory-management/hooks/useInventoryBlockTableData"
import type {
  InventoryBlockTableBigBlockData,
  InventoryBlockTableCategoryData,
  InventoryBlockTableItemData,
} from "@/features/inventory-management/types/InventoryBlockReports"
import { cn } from "@/lib/utils"

type SortKey = "days" | "currentStock" | "stockOut" | "stockInValue" | "name"
type StockHealth = "ok" | "warn" | "crit"

const TABLE_COLUMNS = [
  { key: "name", label: "Big Block / Category", width: "2.2fr" },
  { key: "currentStock", label: "Current Stock", width: "1fr" },
  { key: "stockOut", label: "Stock Out Qty", width: "1fr" },
  { key: "stockInValue", label: "Stock In Value", width: "1.1fr" },
  { key: "days", label: "Days Until Stockout", width: "0.95fr" },
  { key: "supplier", label: "Supplier", width: "1fr" },
] as const

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

const formatCurrency = (value: number) => `৳${formatCompactNumber(value)}`

const formatDays = (value: number | null) => {
  if (value == null) return "—"
  if (value < 1) return "<1d"
  if (Number.isInteger(value)) return `${value}d`
  return `${value.toFixed(1)}d`
}

const getStockHealth = (daysUntilStockout: number | null): StockHealth => {
  if (daysUntilStockout == null || daysUntilStockout > 10) return "ok"
  if (daysUntilStockout > 3) return "warn"
  return "crit"
}

const sortRows = (
  rows: Array<InventoryBlockTableBigBlockData | InventoryBlockTableCategoryData>,
  sortKey: SortKey
) =>
  [...rows].sort((left, right) => {
    const leftName = "categoryName" in left ? left.categoryName : left.bigBlockName
    const rightName = "categoryName" in right ? right.categoryName : right.bigBlockName

    if (sortKey === "name") return leftName.localeCompare(rightName)
    if (sortKey === "currentStock") return right.currentStock - left.currentStock
    if (sortKey === "stockOut") return right.stockOutQty - left.stockOutQty
    if (sortKey === "stockInValue") return right.stockInValue - left.stockInValue

    const leftDays = left.daysUntilStockout ?? Number.POSITIVE_INFINITY
    const rightDays = right.daysUntilStockout ?? Number.POSITIVE_INFINITY
    return leftDays - rightDays
  })

const ItemDetailPanel = ({ item }: { item: InventoryBlockTableItemData }) => {
  const tone = getStockHealth(item.daysUntilStockout)
  const toneStyle = toneStyles[tone]

  return (
    <div className="border-t border-slate-200 bg-white px-8 py-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">{item.itemName}</div>
            <div className="mt-1 text-[11px] text-slate-500">
              {item.bigBlockName} / {item.categoryName} / {item.subCategoryName}
            </div>
          </div>

          <span
            className={cn(
              "inline-flex items-center rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
              toneStyle.chipClass
            )}
          >
            {tone === "crit" ? "Critical" : tone === "warn" ? "Low Stock" : "Healthy"}
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Item ID</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{item.itemId}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">UOM</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{item.unitOfMeasure}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Current Stock
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatCompactNumber(item.currentStock)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Stock In Qty
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatCompactNumber(item.stockInQty)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Stock Out Qty
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatCompactNumber(item.stockOutQty)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Stock In Value
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatCurrency(item.stockInValue)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Days Until Stockout
            </div>
            <div className={cn("mt-2 text-xl font-semibold", toneStyle.textClass)}>
              {formatDays(item.daysUntilStockout)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 md:col-span-2 xl:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Supplier
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {item.supplier ?? "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlockInventoryTable() {
  const [sortKey, setSortKey] = useState<SortKey>("days")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useInventoryBlockTableData()

  const selectedBlock = useMemo(
    () => data.find((block) => block.id === selectedBlockId) ?? null,
    [data, selectedBlockId]
  )

  const visibleRows = useMemo(
    () =>
      sortRows(selectedBlock ? selectedBlock.categories : data, sortKey),
    [data, selectedBlock, sortKey]
  )

  const summary = useMemo(() => {
    return visibleRows.reduce(
      (accumulator, row) => {
        const tone = getStockHealth(row.daysUntilStockout)
        accumulator[tone] += 1
        return accumulator
      },
      { ok: 0, warn: 0, crit: 0 }
    )
  }, [visibleRows])

  const visibleColumns = useMemo(
    () =>
      selectedBlock
        ? TABLE_COLUMNS
        : TABLE_COLUMNS.filter((column) => column.key !== "supplier"),
    [selectedBlock]
  )

  const columnTemplate = useMemo(
    () => visibleColumns.map((column) => column.width).join(" "),
    [visibleColumns]
  )

  if (isLoading) {
    return (
      <Card className="border-border/70 bg-card shadow-sm">
        <CardContent className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
          Loading inventory block data...
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-border/70 bg-card shadow-sm">
        <CardContent className="flex h-[360px] items-center justify-center text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load inventory block data."}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-border/70 bg-card py-0 text-card-foreground shadow-sm">
      <CardHeader className="gap-0 px-0 pt-0">
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3 text-[11px] text-slate-500">
          <button
            type="button"
            onClick={() => {
              setSelectedBlockId(null)
              setExpandedCategoryId(null)
              setExpandedItemId(null)
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
              <span className="font-semibold text-slate-900">{selectedBlock.bigBlockName}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedBlockId(null)
                  setExpandedCategoryId(null)
                  setExpandedItemId(null)
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
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[940px]">
            <div
              className="grid border-b border-slate-200 bg-slate-50"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              {visibleColumns.map((column) => (
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
                const tone = getStockHealth(row.daysUntilStockout)
                const isExpandedCategory =
                  selectedBlock && expandedCategoryId === row.id && "items" in row

                return (
                  <div key={row.id} className="border-b border-slate-200 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedBlock) {
                          setSelectedBlockId(row.id)
                          setExpandedCategoryId(null)
                          setExpandedItemId(null)
                          return
                        }

                        if ("items" in row) {
                          setExpandedCategoryId((current) => {
                            const nextCategoryId = current === row.id ? null : row.id
                            setExpandedItemId(null)
                            return nextCategoryId
                          })
                        }
                      }}
                      className={cn(
                        "grid w-full border-l-2 text-left transition hover:bg-sky-50",
                        toneStyles[tone].rowBorderClass,
                        isExpandedCategory && "bg-sky-50"
                      )}
                      style={{ gridTemplateColumns: columnTemplate }}
                    >
                      <div className="flex min-w-0 items-center gap-3 border-r border-slate-200 px-4 py-4">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: toneStyles[tone].accent }}
                        />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-slate-900">
                            {"bigBlockName" in row && "totalCategories" in row
                              ? row.bigBlockName
                              : row.categoryName}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {"totalCategories" in row
                              ? `${row.totalCategories} categories · ${row.totalItems} items`
                              : `${row.totalItems} items`}
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
                                width: `${row.stockPct}%`,
                                backgroundColor: toneStyles[tone].accent,
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-slate-500">
                            {formatCompactNumber(row.currentStock)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center border-r border-slate-200 px-4 py-4 text-xs text-slate-700">
                        {formatCompactNumber(row.stockOutQty)}
                      </div>

                      <div className="flex items-center border-r border-slate-200 px-4 py-4 text-xs text-slate-700">
                        {formatCurrency(row.stockInValue)}
                      </div>

                      <div
                        className={cn(
                          "flex items-center border-r border-slate-200 px-4 py-4 text-sm font-semibold tabular-nums",
                          toneStyles[tone].textClass
                        )}
                      >
                        {formatDays(row.daysUntilStockout)}
                      </div>

                      {selectedBlock ? (
                        <div className="flex items-center px-4 py-4 text-xs text-slate-500">
                          {"supplier" in row ? row.supplier ?? "—" : "—"}
                        </div>
                      ) : null}
                    </button>

                    {isExpandedCategory ? (
                      <div className="bg-slate-50/70">
                        {row.items.map((item) => {
                          const itemTone = getStockHealth(item.daysUntilStockout)
                          const isExpandedItem = expandedItemId === item.id

                          return (
                            <div key={item.id} className="border-t border-slate-200">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedItemId((current) =>
                                    current === item.id ? null : item.id
                                  )
                                }
                                className={cn(
                                  "grid w-full text-[11px] text-slate-700 transition hover:bg-slate-100/80",
                                  isExpandedItem && "bg-slate-100/70"
                                )}
                                style={{ gridTemplateColumns: columnTemplate }}
                              >
                                <div className="flex min-w-0 items-center gap-3 border-r border-slate-200 px-4 py-3 pl-8">
                                  <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: toneStyles[itemTone].accent }}
                                  />
                                  <div className="min-w-0">
                                    <div className="truncate font-medium text-slate-900">
                                      {item.itemName}
                                    </div>
                                    <div className="mt-1 text-[10px] text-slate-500">
                                      {item.subCategoryName} · ID {item.itemId} · {item.unitOfMeasure}
                                    </div>
                                  </div>
                                  <ChevronRight
                                    className={cn(
                                      "ml-auto h-3.5 w-3.5 shrink-0 text-slate-400 transition",
                                      isExpandedItem && "rotate-90 text-sky-600"
                                    )}
                                  />
                                </div>

                                <div className="flex items-center border-r border-slate-200 px-4 py-3 text-slate-500">
                                  {formatCompactNumber(item.currentStock)}
                                </div>
                                <div className="flex items-center border-r border-slate-200 px-4 py-3 text-slate-500">
                                  {formatCompactNumber(item.stockOutQty)}
                                </div>
                                <div className="flex items-center border-r border-slate-200 px-4 py-3 text-slate-500">
                                  {formatCurrency(item.stockInValue)}
                                </div>
                                <div
                                  className={cn(
                                    "flex items-center border-r border-slate-200 px-4 py-3 font-semibold",
                                    toneStyles[itemTone].textClass
                                  )}
                                >
                                  {formatDays(item.daysUntilStockout)}
                                </div>
                                {selectedBlock ? (
                                  <div className="flex items-center px-4 py-3 text-[10px] text-slate-500">
                                    {item.supplier ?? "—"}
                                  </div>
                                ) : null}
                              </button>

                              {isExpandedItem ? <ItemDetailPanel item={item} /> : null}
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
