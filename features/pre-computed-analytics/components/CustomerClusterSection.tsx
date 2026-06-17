"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { CustomerClusterRow } from "../types/PreComputedDashboard"

const CLUSTER_COLORS = [
  { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", dot: "#2563eb" },
  { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800", dot: "#7c3aed" },
  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", dot: "#16a34a" },
  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", dot: "#d97706" },
  { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", dot: "#dc2626" },
  { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800", dot: "#0891b2" },
]

function formatBdt(value: number) {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `৳${(value / 1_000).toFixed(1)}k`
  return `৳${value.toLocaleString("en-BD")}`
}

type Props = {
  data: CustomerClusterRow[]
  isLoading: boolean
}

export function CustomerClusterSection({ data, isLoading }: Props) {
  const clusterMap = new Map<string, { count: number; totalSpend: number }>()
  for (const row of data) {
    const existing = clusterMap.get(row.clusterLabel) ?? { count: 0, totalSpend: 0 }
    clusterMap.set(row.clusterLabel, {
      count: existing.count + 1,
      totalSpend: existing.totalSpend + row.totalSpend,
    })
  }
  const clusters = Array.from(clusterMap.entries()).map(([label, stats]) => ({
    label,
    count: stats.count,
    avgSpend: stats.totalSpend / stats.count,
    totalSpend: stats.totalSpend,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumer Cluster Definition</CardTitle>
        <CardDescription>Customer segments by spend behaviour</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : clusters.length === 0 ? (
          <p className="text-sm text-muted-foreground">No customer cluster data available.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster, i) => {
              const style = CLUSTER_COLORS[i % CLUSTER_COLORS.length]
              return (
                <div
                  key={cluster.label}
                  className={`rounded-xl border px-4 py-3 ${style.bg} ${style.border}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: style.dot }}
                    />
                    <p className={`text-sm font-semibold ${style.text}`}>{cluster.label}</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{cluster.count.toLocaleString("en-BD")}</span>{" "}
                      customer{cluster.count !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Avg spend:{" "}
                      <span className="font-medium text-foreground">{formatBdt(cluster.avgSpend)}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total spend:{" "}
                      <span className="font-medium text-foreground">{formatBdt(cluster.totalSpend)}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
