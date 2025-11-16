"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStorePerformance } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

const riskStyles: Record<
  "low" | "medium" | "high",
  { label: string; className: string }
> = {
  low: { label: "Low", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  medium: { label: "Watch", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  high: { label: "Critical", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
}

export function StorePerformanceTable() {
  const { data } = useStorePerformance()
  const rows = data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store performance snapshot</CardTitle>
        <CardDescription>Sales vs target plus forecast accuracy by location</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-3 text-left">Store</th>
              <th className="py-3 text-right">Sales</th>
              <th className="py-3 text-right">Target</th>
              <th className="py-3 text-right">Variance</th>
              <th className="py-3 text-right">Footfall</th>
              <th className="py-3 text-right">Forecast accuracy</th>
              <th className="py-3 text-center">Inventory risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((store) => {
              const variance = store.sales - store.target
              const risk = riskStyles[store.inventoryRisk]
              return (
                <tr key={store.store} className="border-b border-border/60 last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="font-semibold text-foreground">{store.store}</div>
                    <div className="text-xs text-muted-foreground">{store.region}</div>
                  </td>
                  <td className="py-3 text-right font-mono text-sm">${store.sales.toLocaleString()}</td>
                  <td className="py-3 text-right font-mono text-sm">${store.target.toLocaleString()}</td>
                  <td
                    className={cn(
                      "py-3 text-right font-mono text-sm",
                      variance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {variance >= 0 ? "+" : "-"}${Math.abs(variance).toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-xs text-muted-foreground">
                    {store.footfall.toLocaleString()} visits
                  </td>
                  <td className="py-3 text-right font-medium">{store.forecastAccuracy}%</td>
                  <td className="py-3 text-center">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", risk.className)}>
                      {risk.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
