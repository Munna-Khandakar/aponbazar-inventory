"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useInventoryBigBlockReport } from "@/features/inventory-management/hooks/useInventoryBigBlockReport"
import { useInventoryCategoryDetailReport } from "@/features/inventory-management/hooks/useInventoryCategoryDetailReport"
import { useInventoryItemDetailReport } from "@/features/inventory-management/hooks/useInventoryItemDetailReport"
import type {
  InventoryBigBlockReportRow,
  InventoryCategoryDetailReportRow,
  InventoryItemDetailReportRow,
} from "@/features/inventory-management/types/InventoryBlockReports"
import { cn } from "@/lib/utils"

type SortKey = "name" | "currentStockQty" | "stockOutQty" | "stockInValue" | "stockOutValue"
type StockHealth = "ok" | "warn" | "crit"

type SortableRow =
  | InventoryBigBlockReportRow
  | InventoryCategoryDetailReportRow
  | InventoryItemDetailReportRow

const TABLE_COLUMNS = [
  { key: "name", label: "Block / Subcategory", width: "2.4fr" },
  { key: "currentStockQty", label: "Current Stock", width: "1fr" },
  { key: "stockOutQty", label: "Stock Out Qty", width: "1fr" },
  { key: "stockInValue", label: "Stock In Value", width: "1.1fr" },
  { key: "stockOutValue", label: "Stock Out Value", width: "1.1fr" },
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

const normalizeMatchKey = (value: string | null | undefined) =>
  (value ?? "").trim().toLocaleLowerCase()

const createBlockId = (value: string) => normalizeMatchKey(value).replace(/[^a-z0-9]+/g, "-")

const createCategoryId = (bigBlock: string, subCategory: string) =>
  `${createBlockId(bigBlock)}:${createBlockId(subCategory)}`

const createItemId = (subCategory: string, itemId: number) =>
  `${createBlockId(subCategory)}:${itemId}`

const formatCompactNumber = (value: number) => {
  const absoluteValue = Math.abs(value)
  const prefix = value < 0 ? "-" : ""

  if (absoluteValue >= 1_000_000) return `${prefix}${(absoluteValue / 1_000_000).toFixed(1)}M`
  if (absoluteValue >= 1_000) return `${prefix}${(absoluteValue / 1_000).toFixed(1)}K`

  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(value)
}

const formatCurrency = (value: number) => `৳${formatCompactNumber(value)}`

const getStockHealth = (currentStockQty: number, stockOutQty: number): StockHealth => {
  if (currentStockQty <= 0) return "crit"

  const stockCoverageRatio =
    stockOutQty <= 0 ? Number.POSITIVE_INFINITY : currentStockQty / stockOutQty
  if (stockCoverageRatio < 0.02) return "warn"

  return "ok"
}

const getCurrentStockPercent = (currentStockQty: number, stockInQty: number) => {
  if (stockInQty <= 0) return 0
  return Math.min(100, Math.max(0, (currentStockQty / stockInQty) * 100))
}

const getRowName = (row: SortableRow) => {
  if ("itemName" in row) return row.itemName
  if ("subCategoryName" in row) return row.subCategoryName
  return row.strBigBlock
}

const sortRows = <TRow extends SortableRow>(rows: TRow[], sortKey: SortKey) =>
  [...rows].sort((left, right) => {
    if (sortKey === "name") {
      return getRowName(left).localeCompare(getRowName(right))
    }

    return right[sortKey] - left[sortKey]
  })

const RowSummary = ({
  row,
}: {
  row: InventoryBigBlockReportRow | InventoryCategoryDetailReportRow
}) => {
  if ("totalSubCategories" in row) {
    return (
      <div className="mt-1 text-[11px] text-slate-500">
        {row.totalCategories} categories · {row.totalSubCategories} subcategories · {row.totalItems} items
      </div>
    )
  }

  return <div className="mt-1 text-[11px] text-slate-500">{row.totalItems} items</div>
}

const ItemDetailPanel = ({
  item,
  bigBlockName,
}: {
  item: InventoryItemDetailReportRow
  bigBlockName: string
}) => {
  const tone = getStockHealth(item.currentStockQty, item.stockOutQty)
  const toneStyle = toneStyles[tone]
  const quantityVisuals = [
    { label: "Stock In Qty", value: item.stockInQty, color: "bg-sky-500" },
    { label: "Stock Out Qty", value: item.stockOutQty, color: "bg-violet-500" },
    {
      label: "Current Stock Qty",
      value: item.currentStockQty,
      color: tone === "crit" ? "bg-red-500" : "bg-emerald-500",
    },
  ]
  const maxQuantityValue = Math.max(
    ...quantityVisuals.map((metric) => Math.abs(metric.value)),
    1
  )

  return (
    <div className="border-t border-slate-200 bg-white px-8 py-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">{item.itemName}</div>
            <div className="mt-1 text-[11px] text-slate-500">
              {bigBlockName} / {item.categoryName} / {item.subCategoryName}
            </div>
          </div>

          <span
            className={cn(
              "inline-flex items-center rounded-md border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
              toneStyle.chipClass
            )}
          >
            {tone === "crit" ? "Negative Stock" : tone === "warn" ? "Low Coverage" : "Healthy"}
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Item ID</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{item.itemId}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Item Type</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{item.itemTypeName}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Appears In Shops
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {item.appearsInShopCount}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Current Stock Qty
            </div>
            <div className={cn("mt-2 text-xl font-semibold", toneStyle.textClass)}>
              {formatCompactNumber(item.currentStockQty)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Current Stock Value
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatCurrency(item.currentStockValue)}
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
              Stock Out Value
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatCurrency(item.stockOutValue)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Broad Category
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{item.categoryName}</div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Quantity Visuals
            </div>
            <div className="mt-4 space-y-4">
              {quantityVisuals.map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-slate-500">{metric.label}</span>
                    <span className="font-medium text-slate-900">
                      {formatCompactNumber(metric.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={cn("h-full rounded-full", metric.color)}
                      style={{ width: `${(Math.abs(metric.value) / maxQuantityValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Footprint Snapshot
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between gap-3 text-[11px]">
                  <span className="text-slate-500">Current Stock vs Stock In</span>
                  <span className="font-medium text-slate-900">
                    {getCurrentStockPercent(item.currentStockQty, item.stockInQty).toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${getCurrentStockPercent(item.currentStockQty, item.stockInQty)}%`,
                      backgroundColor: toneStyle.accent,
                    }}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                Current stock value is {formatCurrency(item.currentStockValue)} across{" "}
                {item.appearsInShopCount} shops.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlockInventoryTable() {
  const [sortKey, setSortKey] = useState<SortKey>("currentStockQty")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

  const bigBlocksQuery = useInventoryBigBlockReport()
  const bigBlockRows = useMemo(
    () => bigBlocksQuery.data?.data.data ?? [],
    [bigBlocksQuery.data]
  )

  const selectedBlock = useMemo(
    () =>
      bigBlockRows.find((row) => createBlockId(row.strBigBlock) === selectedBlockId) ?? null,
    [bigBlockRows, selectedBlockId]
  )

  const categoriesQuery = useInventoryCategoryDetailReport(selectedBlock?.strBigBlock ?? null)
  const categoryRows = useMemo(
    () => categoriesQuery.data?.data.data ?? [],
    [categoriesQuery.data]
  )

  const selectedCategory = useMemo(
    () =>
      categoryRows.find(
        (row) => createCategoryId(row.strBigBlock, row.subCategoryName) === expandedCategoryId
      ) ?? null,
    [categoryRows, expandedCategoryId]
  )

  const itemsQuery = useInventoryItemDetailReport(selectedCategory?.subCategoryName ?? null)
  const itemRows = useMemo(() => itemsQuery.data?.data.data ?? [], [itemsQuery.data])

  const visibleBigBlockRows = useMemo(
    () => sortRows<InventoryBigBlockReportRow>(bigBlockRows, sortKey),
    [bigBlockRows, sortKey]
  )

  const visibleCategoryRows = useMemo(
    () => sortRows<InventoryCategoryDetailReportRow>(categoryRows, sortKey),
    [categoryRows, sortKey]
  )

  const visibleItemRows = useMemo(
    () => sortRows<InventoryItemDetailReportRow>(itemRows, sortKey),
    [itemRows, sortKey]
  )

  const summary = useMemo(() => {
    const rows = selectedBlock ? visibleCategoryRows : visibleBigBlockRows

    return rows.reduce(
      (accumulator, row) => {
        const tone = getStockHealth(row.currentStockQty, row.stockOutQty)
        accumulator[tone] += 1
        return accumulator
      },
      { ok: 0, warn: 0, crit: 0 }
    )
  }, [selectedBlock, visibleBigBlockRows, visibleCategoryRows])

  const columnTemplate = useMemo(
    () => TABLE_COLUMNS.map((column) => column.width).join(" "),
    []
  )

  const topLevelError =
    bigBlocksQuery.error ?? (selectedBlock ? categoriesQuery.error : null) ?? null

  if (bigBlocksQuery.isLoading) {
    return (
      <Card className="border-border/70 bg-card shadow-sm">
        <CardContent className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
          Loading inventory block data...
        </CardContent>
      </Card>
    )
  }

  if (bigBlocksQuery.isError) {
    return (
      <Card className="border-border/70 bg-card shadow-sm">
        <CardContent className="flex h-[360px] items-center justify-center text-sm text-destructive">
          {bigBlocksQuery.error instanceof Error
            ? bigBlocksQuery.error.message
            : "Failed to load inventory block data."}
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
              <span className="font-semibold text-slate-900">{selectedBlock.strBigBlock}</span>
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
            {summary.crit} Negative Stock
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700">
            {summary.warn} Low Coverage
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
            {summary.ok} Healthy
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div
              className="grid border-b border-slate-200 bg-slate-50"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              {TABLE_COLUMNS.map((column) => (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => setSortKey(column.key)}
                  className={cn(
                    "flex items-center gap-2 border-r border-slate-200 px-4 py-3 text-left text-[10px] uppercase tracking-[0.16em] text-slate-500 transition last:border-r-0 hover:text-slate-900",
                    sortKey === column.key && "text-sky-700"
                  )}
                >
                  <span>{column.label}</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              ))}
            </div>

            <div className="bg-white">
              {selectedBlock && categoriesQuery.isLoading ? (
                <div className="px-6 py-8 text-sm text-slate-500">
                  Loading subcategories for {selectedBlock.strBigBlock}...
                </div>
              ) : null}

              {topLevelError ? (
                <div className="px-6 py-8 text-sm text-destructive">
                  {topLevelError instanceof Error
                    ? topLevelError.message
                    : "Failed to load inventory detail data."}
                </div>
              ) : null}

              {!topLevelError &&
                !selectedBlock &&
                visibleBigBlockRows.map((row) => {
                  const tone = getStockHealth(row.currentStockQty, row.stockOutQty)

                  return (
                    <div key={createBlockId(row.strBigBlock)} className="border-b border-slate-200 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBlockId(createBlockId(row.strBigBlock))
                          setExpandedCategoryId(null)
                          setExpandedItemId(null)
                        }}
                        className={cn(
                          "grid w-full border-l-2 text-left transition hover:bg-sky-50",
                          toneStyles[tone].rowBorderClass
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
                              {row.strBigBlock}
                            </div>
                            <RowSummary row={row} />
                          </div>
                          <ChevronRight className="ml-auto h-4 w-4 shrink-0 rotate-90 text-sky-600" />
                        </div>

                        <div className="flex items-center border-r border-slate-200 px-4 py-4">
                          <div className="flex w-full items-center gap-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${getCurrentStockPercent(row.currentStockQty, row.stockInQty)}%`,
                                  backgroundColor: toneStyles[tone].accent,
                                }}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-xs tabular-nums",
                                tone === "crit" ? "text-red-700" : "text-slate-500"
                              )}
                            >
                              {formatCompactNumber(row.currentStockQty)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center border-r border-slate-200 px-4 py-4 text-xs text-slate-700">
                          {formatCompactNumber(row.stockOutQty)}
                        </div>

                        <div className="flex items-center border-r border-slate-200 px-4 py-4 text-xs text-slate-700">
                          {formatCurrency(row.stockInValue)}
                        </div>

                        <div className="flex items-center px-4 py-4 text-xs text-slate-700">
                          {formatCurrency(row.stockOutValue)}
                        </div>
                      </button>
                    </div>
                  )
                })}

              {!topLevelError &&
                selectedBlock &&
                !categoriesQuery.isLoading &&
                visibleCategoryRows.map((row) => {
                  const tone = getStockHealth(row.currentStockQty, row.stockOutQty)
                  const categoryId = createCategoryId(row.strBigBlock, row.subCategoryName)
                  const isExpandedCategory = expandedCategoryId === categoryId

                  return (
                    <div key={categoryId} className="border-b border-slate-200 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedCategoryId((current) =>
                            current === categoryId ? null : categoryId
                          )
                          setExpandedItemId(null)
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
                              {row.subCategoryName}
                            </div>
                            <RowSummary row={row} />
                          </div>
                          <ChevronRight
                            className={cn(
                              "ml-auto h-4 w-4 shrink-0 text-slate-400 transition",
                              isExpandedCategory && "rotate-90 text-sky-600"
                            )}
                          />
                        </div>

                        <div className="flex items-center border-r border-slate-200 px-4 py-4">
                          <div className="flex w-full items-center gap-3">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${getCurrentStockPercent(row.currentStockQty, row.stockInQty)}%`,
                                  backgroundColor: toneStyles[tone].accent,
                                }}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-xs tabular-nums",
                                tone === "crit" ? "text-red-700" : "text-slate-500"
                              )}
                            >
                              {formatCompactNumber(row.currentStockQty)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center border-r border-slate-200 px-4 py-4 text-xs text-slate-700">
                          {formatCompactNumber(row.stockOutQty)}
                        </div>

                        <div className="flex items-center border-r border-slate-200 px-4 py-4 text-xs text-slate-700">
                          {formatCurrency(row.stockInValue)}
                        </div>

                        <div className="flex items-center px-4 py-4 text-xs text-slate-700">
                          {formatCurrency(row.stockOutValue)}
                        </div>
                      </button>

                      {isExpandedCategory ? (
                        <div className="bg-slate-50/70">
                          {itemsQuery.isLoading ? (
                            <div className="px-8 py-6 text-sm text-slate-500">
                              Loading item rows for {row.subCategoryName}...
                            </div>
                          ) : null}

                          {itemsQuery.isError ? (
                            <div className="px-8 py-6 text-sm text-destructive">
                              {itemsQuery.error instanceof Error
                                ? itemsQuery.error.message
                                : "Failed to load item rows."}
                            </div>
                          ) : null}

                          {!itemsQuery.isLoading &&
                          !itemsQuery.isError &&
                          visibleItemRows.length === 0 ? (
                            <div className="px-8 py-6 text-sm text-slate-500">
                              No item rows available for this subcategory.
                            </div>
                          ) : null}

                          {!itemsQuery.isLoading &&
                            !itemsQuery.isError &&
                            visibleItemRows.map((item) => {
                              const itemTone = getStockHealth(
                                item.currentStockQty,
                                item.stockOutQty
                              )
                              const itemId = createItemId(item.subCategoryName, item.itemId)
                              const isExpandedItem = expandedItemId === itemId

                              return (
                                <div key={itemId} className="border-t border-slate-200">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedItemId((current) =>
                                        current === itemId ? null : itemId
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
                                          {item.categoryName} · {item.subCategoryName} ·{" "}
                                          {item.appearsInShopCount} shops
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
                                      {formatCompactNumber(item.currentStockQty)}
                                    </div>
                                    <div className="flex items-center border-r border-slate-200 px-4 py-3 text-slate-500">
                                      {formatCompactNumber(item.stockOutQty)}
                                    </div>
                                    <div className="flex items-center border-r border-slate-200 px-4 py-3 text-slate-500">
                                      {formatCurrency(item.stockInValue)}
                                    </div>
                                    <div className="flex items-center px-4 py-3 text-slate-500">
                                      {formatCurrency(item.stockOutValue)}
                                    </div>
                                  </button>

                                  {isExpandedItem ? (
                                    <ItemDetailPanel
                                      item={item}
                                      bigBlockName={selectedBlock.strBigBlock}
                                    />
                                  ) : null}
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
