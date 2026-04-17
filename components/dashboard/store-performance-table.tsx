"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StorePerformanceTableSkeleton } from "@/components/dashboard/report-skeletons"
import { useStorePerformanceSnapshot } from "@/hooks/use-dashboard"
import { cn } from "@/lib/utils"

const formatCurrency = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const getPerformance = (actual: number, targetted: number, provided?: number) => {
  if (provided !== undefined) return provided
  if (targetted <= 0) return null
  return (actual / targetted) * 100
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
  const { data, isLoading, isFetching, error } = useStorePerformanceSnapshot()
  const rows = data ?? []
  const showLoadingState = isLoading || isFetching

  return (
    <Card className="max-h-[520px] overflow-hidden">
      <CardHeader>
        <CardTitle>Shop performance snapshot</CardTitle>
        <CardDescription>Actual vs targetted sales by shop</CardDescription>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-3 text-left">Shop</th>
              <th className="py-3 text-center">Sales perf.</th>
              <th className="py-3 text-right">Actual sales</th>
              <th className="py-3 text-right">Targetted sales</th>
            </tr>
          </thead>
          <tbody>
            {showLoadingState ? (
              <StorePerformanceTableSkeleton />
            ) : error ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-sm text-destructive"
                >
                  Failed to load shop performance data
                </td>
              </tr>
            ) : null}
            {rows.map((store) => {
              const salesPerformance = getPerformance(
                store.actualSales,
                store.targettedSales,
                store.salesPerformance
              )

              return (
                <tr key={store.shopName} className="border-b border-border/60 last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="font-semibold text-foreground">{store.shopName}</div>
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
                  <td className="py-3 text-right font-mono text-sm">{formatCurrency(store.actualSales)}</td>
                  <td className="py-3 text-right font-mono text-sm">
                    {formatCurrency(store.targettedSales)}
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
