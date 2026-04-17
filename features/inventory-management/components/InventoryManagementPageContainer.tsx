"use client"

import { useIsFetching } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { AiRecommendationSection } from "@/components/dashboard/ai-recommendation-section"
import { BlockInventoryTable } from "@/features/inventory-management/components/BlockInventoryTable"
import { PredictiveInventoryStatusChart } from "@/features/inventory-management/components/PredictiveInventoryStatusChart"
import { SupplierReorderInsightsChart } from "@/features/inventory-management/components/SupplierReorderInsightsChart"
import { ToplineInventoryOverview } from "@/features/inventory-management/components/ToplineInventoryOverview"
import { useReportFilters } from "@/hooks/use-report-filters"

export function InventoryManagementPageContainer() {
  const { shopName } = useReportFilters()
  const activeInventoryFetches = useIsFetching({
    predicate: (query) => {
      const [scope, key] = query.queryKey

      return (
        scope === "inventory-management" &&
        (key === "inventory-big-block" || key === "inventory-big-block-series")
      )
    },
  })
  const isShopFilterLoading = activeInventoryFetches > 0

  return (
    <div className="space-y-6">
      {isShopFilterLoading ? (
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
          <span>
            Updating inventory data{shopName ? ` for ${shopName}` : ""}...
          </span>
        </div>
      ) : null}

      <ToplineInventoryOverview />

      <BlockInventoryTable />

      <PredictiveInventoryStatusChart />

      <SupplierReorderInsightsChart />

      <AiRecommendationSection />
    </div>
  )
}
