"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStorePerformance } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

const formatCurrency = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatCount = (value: number) => value.toLocaleString("en-BD")

const getPerformance = (actual: number, base: number, provided?: number) => {
  if (provided !== undefined) return provided
  if (base <= 0) return null
  return (actual / base) * 100
}

const getPerformanceTone = (value: number | null) => {
  if (value === null) {
    return "bg-slate-100 text-slate-600"
  }

  if (value >= 100) {
    return "bg-emerald-100 text-emerald-700"
  }

  if (value >= 75) {
    return "bg-amber-100 text-amber-700"
  }

  return "bg-rose-100 text-rose-700"
}

export function StorePerformanceTable() {
  const { data, isLoading } = useStorePerformance()
  const rows = data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop performance snapshot</CardTitle>
        <CardDescription>Actual vs base sales and deliveries by shop</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-3 text-left">Shop</th>
              <th className="py-3 text-right">Actual sales</th>
              <th className="py-3 text-right">Base sales</th>
              <th className="py-3 text-right">Actual deliveries</th>
              <th className="py-3 text-right">Base deliveries</th>
              <th className="py-3 text-center">Sales perf.</th>
              <th className="py-3 text-center">Delivery perf.</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  Loading shop performance...
                </td>
              </tr>
            ) : null}
            {rows.map((store) => {
              const salesPerformance = getPerformance(
                store.actualSales,
                store.baseSales,
                store.salesPerformance
              )
              const deliveryPerformance = getPerformance(
                store.actualDeliveries,
                store.baseDeliveries,
                store.deliveryPerformance
              )

              return (
                <tr key={store.shopName} className="border-b border-border/60 last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="font-semibold text-foreground">{store.shopName}</div>
                  </td>
                  <td className="py-3 text-right font-mono text-sm">{formatCurrency(store.actualSales)}</td>
                  <td className="py-3 text-right font-mono text-sm">{formatCurrency(store.baseSales)}</td>
                  <td className="py-3 text-right text-xs text-muted-foreground">
                    {formatCount(store.actualDeliveries)}
                  </td>
                  <td className="py-3 text-right text-xs text-muted-foreground">
                    {formatCount(store.baseDeliveries)}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        getPerformanceTone(salesPerformance)
                      )}
                    >
                      {salesPerformance === null ? "N/A" : `${salesPerformance.toFixed(2)}%`}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                        getPerformanceTone(deliveryPerformance)
                      )}
                    >
                      {deliveryPerformance === null ? "N/A" : `${deliveryPerformance.toFixed(2)}%`}
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
