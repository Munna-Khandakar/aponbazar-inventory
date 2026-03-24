"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  inventoryBlockTableMock,
  type InventoryBlockTableBlock,
  type InventoryBlockTableCategory,
  type InventoryBlockTableItem,
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

const getUrgencyScore = (tone: StockHealth, days: number, lead: number) => {
  if (tone === "crit") return Math.min(99, 86 + Math.max(0, lead - days) * 4)
  if (tone === "warn") return Math.min(79, 48 + Math.max(0, lead - days) * 3)
  return Math.min(42, 18 + lead)
}

const ItemDetailPanel = ({
  item,
  leadTime,
}: {
  item: InventoryBlockTableItem
  leadTime: number
}) => {
  const tone = getStockHealth(item.days, leadTime)
  const toneStyle = toneStyles[tone]
  const reorder = getReorderMetrics(item.stockOut, item.pct, leadTime)
  const throughput = Math.min(100, Math.round((item.lifting5d / Math.max(item.stockIn, 1)) * 100))
  const stockoutMarker = Math.max(2, Math.min(100, Math.round((item.days / 30) * 100)))
  const reorderMarker = Math.max(2, Math.min(100, Math.round((item.lead / 30) * 100)))
  const deliveryDay = item.days + item.lead
  const urgency = getUrgencyScore(tone, item.days, item.lead)
  const currentStockOffset = Math.round(item.stockIn * (item.pct / 100))

  return (
    <div className="border-t border-slate-200 bg-white px-8 py-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">{item.name}</div>
            <div className="mt-1 font-mono text-[11px] text-slate-500">{item.code}</div>
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

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Current Stock
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {formatCompactNumber(item.stockIn)}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">units on hand</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Predicted Lift
            </div>
            <div className="mt-2 text-2xl font-semibold text-sky-700">
              {formatCompactNumber(item.lifting5d)}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">next 5 days</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Days Left
            </div>
            <div className={cn("mt-2 text-2xl font-semibold", toneStyle.textClass)}>
              {item.days === 0 ? "<1" : item.days}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">days until stockout</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Reorder Qty
            </div>
            <div className="mt-2 text-2xl font-semibold text-emerald-700">
              {formatCompactNumber(reorder.quantity)}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">recommended units</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
              Supplier
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{item.supplier}</div>
            <div className="mt-1 text-[11px] text-slate-500">{item.lead}d lead time</div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Stock Runway
              </div>
              <div className="mt-3 rounded-full bg-slate-200">
                <div className="relative h-3 overflow-visible rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full opacity-80"
                    style={{
                      width: `${stockoutMarker}%`,
                      backgroundColor: toneStyle.accent,
                    }}
                  />
                  <span
                    className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                    style={{ left: `${stockoutMarker}%`, backgroundColor: toneStyle.accent }}
                  />
                  <span
                    className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-amber-500"
                    style={{ left: `${reorderMarker}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className={toneStyle.textClass}>
                  Stockout day {item.days === 0 ? "<1" : item.days}
                </span>
                <span className="text-amber-700">Reorder by day {item.lead}</span>
                <span className="text-slate-500">30-day horizon</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Key Events
              </div>
              <div className="space-y-0">
                <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: toneStyle.accent }}
                  />
                  <span className="flex-1 text-slate-500">Stockout</span>
                  <span className={cn("font-semibold", toneStyle.textClass)}>
                    Day {item.days === 0 ? "<1" : item.days}
                  </span>
                </div>
                <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="flex-1 text-slate-500">Reorder deadline</span>
                  <span className="font-semibold text-amber-700">
                    Day {item.lead}
                    {item.days <= item.lead ? " now" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="flex-1 text-slate-500">Expected delivery if ordered today</span>
                  <span className="font-semibold text-emerald-700">Day {deliveryDay}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                Utilisation
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Stock level</span>
                    <span className="font-medium text-slate-700">{item.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.pct}%`, backgroundColor: toneStyle.accent }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">5-day throughput</span>
                    <span className="font-medium text-slate-700">{throughput}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${throughput}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Reorder Recommendation
                </div>
                <div className={cn("mt-2 text-3xl font-semibold", toneStyle.textClass)}>
                  {formatCompactNumber(reorder.quantity)}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  units from {item.supplier}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Urgency
                </div>
                <div className={cn("mt-2 text-2xl font-semibold", toneStyle.textClass)}>
                  {urgency}%
                </div>
              </div>
            </div>

            <div className="space-y-3 px-4 py-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">{leadTime * 2}-day demand</span>
                <span className="font-medium text-slate-900">
                  {formatCompactNumber(reorder.demandWindow)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Safety buffer ({leadTime}d)</span>
                <span className="font-medium text-slate-900">
                  {formatCompactNumber(reorder.safetyBuffer)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Current stock offset</span>
                <span className="font-medium text-slate-900">
                  - {formatCompactNumber(currentStockOffset)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-900">Net reorder qty</span>
                  <span className={cn("font-semibold", toneStyle.textClass)}>
                    {formatCompactNumber(reorder.quantity)}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${urgency}%`, backgroundColor: toneStyle.accent }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlockInventoryTable() {
  const [sortKey, setSortKey] = useState<SortKey>("days")
  const leadTime = 7
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null)

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
              <span className="font-semibold text-slate-900">{selectedBlock.name}</span>
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
                          setExpandedItemId(null)
                          return
                        }

                        if ("products" in row) {
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
                          const isExpandedItem = expandedItemId === product.id

                          return (
                            <div key={product.id} className="border-t border-slate-200">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedItemId((current) =>
                                    current === product.id ? null : product.id
                                  )
                                }
                                className={cn(
                                  "grid w-full text-[11px] text-slate-700 transition hover:bg-slate-100/80",
                                  isExpandedItem && "bg-slate-100/70"
                                )}
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
                                  <ChevronRight
                                    className={cn(
                                      "ml-auto h-3.5 w-3.5 shrink-0 text-slate-400 transition",
                                      isExpandedItem && "rotate-90 text-sky-600"
                                    )}
                                  />
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
                              </button>

                              {isExpandedItem ? (
                                <ItemDetailPanel item={product} leadTime={leadTime} />
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
