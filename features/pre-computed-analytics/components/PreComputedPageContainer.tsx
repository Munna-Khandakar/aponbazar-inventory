"use client"

import { Clock, Loader2 } from "lucide-react"

import { usePreComputedDashboard } from "../hooks/usePreComputedDashboard"
import { ActionInsightsPanel } from "./ActionInsightsPanel"
import { BigBlocksTreemap } from "./BigBlocksTreemap"
import { CustomerClusterSection } from "./CustomerClusterSection"
import { FocusProductsTable } from "./FocusProductsTable"
import { SalesGrowthChart } from "./SalesGrowthChart"

export function PreComputedPageContainer() {
  const {
    isLoading,
    isFetching,
    isError,
    salesChartPoints,
    treemapNodes,
    focusProductStock,
    customerCluster,
    computedAt,
    actionInsights,
  } = usePreComputedDashboard()

  return (
    <div className="space-y-6">
      {isFetching ? (
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
          <span>Updating pre-computed analytics...</span>
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
          Failed to load pre-computed analytics. The staging data may be temporarily unavailable.
        </div>
      ) : null}

      {computedAt && !isFetching ? (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 shadow-sm">
          <Clock size={13} className="shrink-0 text-slate-400" />
          <span>
            Showing pre-computed data. Last refreshed:{" "}
            <span className="font-medium text-slate-800">
              {new Date(computedAt).toLocaleString("en-BD", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            . Next refresh at 02:00.
          </span>
        </div>
      ) : null}

      <SalesGrowthChart data={salesChartPoints} isLoading={isLoading} />

      <section className="grid gap-6 lg:grid-cols-2">
        <BigBlocksTreemap data={treemapNodes} isLoading={isLoading} />
        <FocusProductsTable focusProductStock={focusProductStock} isLoading={isLoading} />
      </section>

      <CustomerClusterSection data={customerCluster} isLoading={isLoading} />

      <ActionInsightsPanel insights={actionInsights} computedAt={computedAt} />
    </div>
  )
}
