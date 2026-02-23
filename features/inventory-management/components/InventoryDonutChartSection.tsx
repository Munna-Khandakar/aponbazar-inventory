"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DonutChart } from "@/features/inventory-management/charts/DonutChart"
import { useInventoryDonutChart } from "@/features/inventory-management/hooks/useInventoryDonutChart"
import type { DonutCenterLabel } from "@/features/inventory-management/types/DonutCenterLabel"
import { formatDate } from "@/features/inventory-management/utils/formatDate"
import { formatNumber } from "@/features/inventory-management/utils/formatNumber"

const donutColorPalette = ["#14b8a6", "#06b6d4", "#f97316", "#8b5cf6", "#84cc16", "#ef4444"]

export function InventoryDonutChartSection() {
  const { data, isLoading, isError } = useInventoryDonutChart()

  if (isLoading) {
    return (
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Mix</CardTitle>
            <CardDescription>Category-wise movement share</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] animate-pulse rounded-xl bg-muted" />
          </CardContent>
        </Card>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section>
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Inventory Mix</CardTitle>
            <CardDescription>Category-wise movement share</CardDescription>
          </CardHeader>
          <CardContent className="py-10 text-sm text-destructive">
            Unable to load donut chart data.
          </CardContent>
        </Card>
      </section>
    )
  }

  const totalMovement = data.data.reduce((sum, slice) => sum + slice.value, 0)
  const centerLabel: DonutCenterLabel = {
    label: "Total Movement",
    value: formatNumber(totalMovement),
  }

  return (
    <section>
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle>Inventory Mix</CardTitle>
          <CardDescription>
            Distribution by category from {formatDate(data.dateRange.from)} to {formatDate(data.dateRange.to)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={data.data}
            nameKey="label"
            valueKey="value"
            colorKey="color"
            colors={donutColorPalette}
            centerLabel={centerLabel}
            valueFormatter={formatNumber}
          />
        </CardContent>
      </Card>
    </section>
  )
}
