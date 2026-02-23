import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InventoryKpiCardProps } from "@/features/inventory-management/types/InventoryKpiCardProps"

export function InventoryKpiCard({ item }: InventoryKpiCardProps) {
  return (
    <Card className="h-full gap-3 border-border/70 bg-card py-5 shadow-sm">
      <CardHeader className="px-5 pb-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</p>
      </CardHeader>
      <CardContent className="mt-auto px-5 pt-0">
        <CardTitle className="font-mono text-lg leading-tight font-semibold tabular-nums text-foreground">
          {item.value}
        </CardTitle>
      </CardContent>
    </Card>
  )
}
