"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { InventoryKpiCard } from "@/features/inventory-management/components/InventoryKpiCard"
import { useInventoryKpiSummary } from "@/features/inventory-management/hooks/useInventoryKpiSummary"
import type { KpiCardItem } from "@/features/inventory-management/types/KpiCardItem"
import { formatCurrency } from "@/features/inventory-management/utils/formatCurrency"
import { formatDate } from "@/features/inventory-management/utils/formatDate"
import { formatNumber } from "@/features/inventory-management/utils/formatNumber"

const loadingCardIndexes = [1, 2, 3, 4, 5]

export function InventoryKpiSummaryRow() {
  const { data, isLoading, isError } = useInventoryKpiSummary()

  if (isLoading) {
    return (
      <section className="space-y-3">
        <div className="h-5 w-36 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {loadingCardIndexes.map((cardIndex) => (
            <Card key={cardIndex} className="border-border/70">
              <CardHeader>
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-28 animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section>
        <Card className="border-destructive/40">
          <CardContent className="py-6 text-sm text-destructive">
            Unable to load KPI summary right now.
          </CardContent>
        </Card>
      </section>
    )
  }

  const kpiItems: KpiCardItem[] = [
    {
      id: "totalQtyMoved",
      label: "Total Qty Moved",
      value: formatNumber(data.data.totalQtyMoved),
    },
    {
      id: "totalTransactionValue",
      label: "Total Transaction Value",
      value: formatCurrency(data.data.totalTransactionValue),
    },
    {
      id: "totalVAT",
      label: "Total VAT",
      value: formatCurrency(data.data.totalVAT),
    },
    {
      id: "totalTransactions",
      label: "Total Transactions",
      value: formatNumber(data.data.totalTransactions),
    },
    {
      id: "avgTransactionValue",
      label: "Avg Transaction Value",
      value: formatCurrency(data.data.avgTransactionValue),
    },
  ]

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">KPI Summary</h2>
        <p className="text-xs text-muted-foreground">
          {formatDate(data.dateRange.from)} - {formatDate(data.dateRange.to)}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpiItems.map((kpiItem) => (
          <InventoryKpiCard key={kpiItem.id} item={kpiItem} />
        ))}
      </div>
    </section>
  )
}
