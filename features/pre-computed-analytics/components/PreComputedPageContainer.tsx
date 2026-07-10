"use client"

import { Calendar, Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

import { usePreComputedDashboard } from "../hooks/usePreComputedDashboard"
import { CustomerClusterSection } from "./CustomerClusterSection"
import { DashboardKpiRow } from "./DashboardKpiRow"
import { FocusProductsTable } from "./FocusProductsTable"
import { ImmediateActionCards } from "./ImmediateActionCards"
import { InventoryOverviewTreemap } from "./InventoryOverviewTreemap"
import { ProductBundlingPanel } from "./ProductBundlingPanel"
import { SalesGrowthChart } from "./SalesGrowthChart"

export function PreComputedPageContainer() {
  const {
    isLoading,
    isFetching,
    isError,
    refetch,
    salesChartPoints,
    treemapCategories,
    focusTop20,
    focusProductStock,
    dashboardKpi,
    actionInsights,
    computedAt,
  } = usePreComputedDashboard()

  const dataAsOf = computedAt
    ? new Date(computedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <div className="space-y-6">
      {/* D0 action row */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {dataAsOf ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
            <Calendar size={13} className="text-muted-foreground" />
            Data as of <span className="font-medium text-foreground">{dataAsOf}</span>
          </span>
        ) : null}
        <Button
          variant="outline"
          className="h-9 gap-2 rounded-xl"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh Data
        </Button>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
          Failed to load dashboard data. The pre-computed staging data may be temporarily unavailable.
        </div>
      ) : null}

      <DashboardKpiRow kpi={dashboardKpi} computedAt={computedAt} isLoading={isLoading} />

      <section className="grid gap-6 xl:grid-cols-2">
        <SalesGrowthChart data={salesChartPoints} isLoading={isLoading} />
        <InventoryOverviewTreemap data={treemapCategories} isLoading={isLoading} />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr_1fr]">
        <FocusProductsTable
          rows={focusTop20}
          focusProductStock={focusProductStock}
          isLoading={isLoading}
        />
        <div className="self-start">
          <CustomerClusterSection />
        </div>
        <div className="self-start">
          <ProductBundlingPanel />
        </div>
      </section>

      <ImmediateActionCards counts={actionInsights} isLoading={isLoading} />

      <p className="pt-2 text-center text-xs text-muted-foreground">
        Note: All data is pre-computed and updated daily. For real-time insights, please visit individual dashboards.
      </p>
    </div>
  )
}
