"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { useReportFilters } from "@/hooks/use-report-filters"

import { preComputedAnalyticsApi } from "../api/pre-computed-analytics.api"
import { preComputedQueryKeys } from "../query-keys/preComputedQueryKeys"
import { deriveSalesChartPoints, deriveTreemapCategories } from "../utils/deriveChartData"

export function usePreComputedDashboard() {
  const { shopName } = useReportFilters()

  const query = useQuery({
    queryKey: preComputedQueryKeys.dashboard(shopName),
    queryFn: () => preComputedAnalyticsApi.getDashboard(shopName || undefined),
    placeholderData: (prev) => prev,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const data = query.data?.data

  const salesChartPoints = useMemo(
    () => deriveSalesChartPoints(data?.salesMonthly ?? []),
    [data]
  )

  const treemapCategories = useMemo(
    () => deriveTreemapCategories(data?.bigBlockSales ?? []),
    [data]
  )

  return {
    ...query,
    salesChartPoints,
    treemapCategories,
    focusTop20: data?.focusTop20 ?? [],
    focusProductStock: data?.focusProductStock ?? {},
    dashboardKpi: data?.dashboardKpi ?? null,
    actionInsights: data?.actionInsights ?? null,
    computedAt: data?.computedAt ?? null,
  }
}
