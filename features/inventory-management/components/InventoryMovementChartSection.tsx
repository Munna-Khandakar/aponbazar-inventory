"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StackedBarChart } from "@/features/inventory-management/charts/StackedBarChart"
import { useInventoryMovementChart } from "@/features/inventory-management/hooks/useInventoryMovementChart"
import type { ChartSeriesConfig } from "@/features/inventory-management/types/ChartSeriesConfig"
import type { InventoryMovementPoint } from "@/features/inventory-management/types/InventoryMovementPoint"
import { formatDate } from "@/features/inventory-management/utils/formatDate"
import { formatNumber } from "@/features/inventory-management/utils/formatNumber"

const movementSeries: ChartSeriesConfig<keyof InventoryMovementPoint & string>[] = [
  { key: "inbound", label: "Inbound", color: "#14b8a6" },
  { key: "outbound", label: "Outbound", color: "#f97316" },
]
const movementLineSeries: ChartSeriesConfig<keyof InventoryMovementPoint & string> = {
  key: "netMovement",
  label: "Net Movement",
  color: "#2563eb",
}

export function InventoryMovementChartSection() {
  const { data, isLoading, isError } = useInventoryMovementChart()

  if (isLoading) {
    return (
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Movement</CardTitle>
            <CardDescription>Inbound and outbound movement over time</CardDescription>
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
            <CardTitle>Inventory Movement</CardTitle>
            <CardDescription>Inbound and outbound movement over time</CardDescription>
          </CardHeader>
          <CardContent className="py-10 text-sm text-destructive">
            Unable to load movement chart data.
          </CardContent>
        </Card>
      </section>
    )
  }

  const totalInbound = data.data.reduce((sum, point) => sum + point.inbound, 0)
  const totalOutbound = data.data.reduce((sum, point) => sum + point.outbound, 0)
  const totalNet = data.data.reduce((sum, point) => sum + point.netMovement, 0)

  return (
    <section>
      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle>Inventory Movement</CardTitle>
          <CardDescription>
            Inbound vs outbound from {formatDate(data.dateRange.from)} to {formatDate(data.dateRange.to)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StackedBarChart
            data={data.data}
            xKey="label"
            series={movementSeries}
            lineSeries={movementLineSeries}
            positiveSeriesKeys={["inbound"]}
            negativeSeriesKeys={["outbound"]}
            valueFormatter={formatNumber}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Total Inbound</p>
              <p className="font-mono font-semibold tabular-nums text-foreground">{formatNumber(totalInbound)}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Total Outbound</p>
              <p className="font-mono font-semibold tabular-nums text-foreground">{formatNumber(totalOutbound)}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">Net Movement</p>
              <p className="font-mono font-semibold tabular-nums text-foreground">{formatNumber(totalNet)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
