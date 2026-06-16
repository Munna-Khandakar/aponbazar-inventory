"use client"

import { useEffect, useMemo, useState } from "react"
import { GitCompareArrows } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FullscreenTableCard } from "@/components/dashboard/fullscreen-table-card"
import { ShopComparisonDialog } from "@/features/inventory-management/components/ShopComparisonDialog"
import { useShopInventorySnapshot } from "@/features/inventory-management/hooks/useShopInventorySnapshot"
import type { ShopInventorySnapshotTableRow } from "@/features/inventory-management/types/ShopInventorySnapshotReport"
import {
  formatCurrency,
  formatPercentage,
  formatQuantity,
  getHealthTone,
} from "@/features/inventory-management/utils/shopSnapshotFormatters"
import { cn } from "@/lib/utils"

const MAX_COMPARE = 3

const InventorySnapshotSkeleton = () => {
  return Array.from({ length: 7 }, (_, index) => (
    <tr key={index} className="border-b border-border/60 last:border-b-0">
      {Array.from({ length: 8 }, (_, columnIndex) => (
        <td
          key={columnIndex}
          className={cn(
            "py-3",
            columnIndex === 0 ? "w-10 px-3" : "",
            columnIndex === 1 ? "pr-6" : columnIndex > 1 ? "px-4 text-right" : "",
            columnIndex === 7 ? "pl-4 pr-0" : ""
          )}
        >
          <div className="h-4 animate-pulse rounded bg-slate-200" />
        </td>
      ))}
    </tr>
  ))
}

function InventorySnapshotTableBody({
  rows,
  selectedShops,
  onToggleShop,
}: {
  rows: ShopInventorySnapshotTableRow[]
  selectedShops: Set<string>
  onToggleShop: (shopName: string) => void
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <th className="w-10 px-3 py-3" />
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
          <InventorySnapshotTableRow
            key={row.shopName}
            row={row}
            isSelected={selectedShops.has(row.shopName)}
            isDisabled={!selectedShops.has(row.shopName) && selectedShops.size >= MAX_COMPARE}
            onToggle={() => onToggleShop(row.shopName)}
          />
        ))}
      </tbody>
    </table>
  )
}

function InventorySnapshotTableRow({
  row,
  isSelected,
  isDisabled,
  onToggle,
}: {
  row: ShopInventorySnapshotTableRow
  isSelected: boolean
  isDisabled: boolean
  onToggle: () => void
}) {
  return (
    <tr className={cn("border-b border-border/60 last:border-b-0", isSelected && "bg-primary/5")}>
      <td className="w-10 px-3 py-3">
        <Checkbox
          checked={isSelected}
          disabled={isDisabled}
          onCheckedChange={onToggle}
          aria-label={`Select ${row.shopName}`}
        />
      </td>
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

  const [selectedShops, setSelectedShops] = useState<Set<string>>(new Set())
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  // Clear selection when the underlying rows change (e.g. filter change)
  useEffect(() => {
    setSelectedShops(new Set())
  }, [rows])

  const handleToggleShop = (shopName: string) => {
    setSelectedShops((prev) => {
      const next = new Set(prev)
      if (next.has(shopName)) {
        next.delete(shopName)
      } else if (next.size < MAX_COMPARE) {
        next.add(shopName)
      }
      return next
    })
  }

  const selectedShopRows = useMemo(
    () => rows.filter((r) => selectedShops.has(r.shopName)),
    [rows, selectedShops]
  )

  const compareButton =
    selectedShops.size >= 2 ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsCompareOpen(true)}
      >
        <GitCompareArrows size={15} />
        Compare ({selectedShops.size})
      </Button>
    ) : null

  return (
    <>
      <FullscreenTableCard
        className="max-h-[520px] overflow-hidden"
        title="Shop inventory snapshot"
        description="Current stock, next 5-day lifting, and inventory health signals by shop"
        fullscreenDescription="Expanded view of shop-level stock quantity, stock value, 5-day lifting, and health signals."
        bodyClassName="min-h-0 flex-1 overflow-auto"
        fullscreenDisabled={showLoadingState}
        headerActions={compareButton}
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
          <InventorySnapshotTableBody
            rows={rows}
            selectedShops={selectedShops}
            onToggleShop={handleToggleShop}
          />
        )}
      </FullscreenTableCard>

      <ShopComparisonDialog
        open={isCompareOpen}
        onOpenChange={setIsCompareOpen}
        shops={selectedShopRows}
      />
    </>
  )
}
