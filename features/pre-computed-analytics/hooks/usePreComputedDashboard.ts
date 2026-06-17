"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { useReportFilters } from "@/hooks/use-report-filters"

import { preComputedAnalyticsApi } from "../api/pre-computed-analytics.api"
import { preComputedQueryKeys } from "../query-keys/preComputedQueryKeys"
import { deriveActionInsights, deriveSalesChartPoints, deriveTreemapNodes } from "../utils/deriveChartData"

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

  const salesChartPoints = useMemo(
    () => deriveSalesChartPoints(query.data?.data.salesMonthly ?? []),
    [query.data]
  )

  const treemapNodes = useMemo(
    () => deriveTreemapNodes(query.data?.data.bigBlockSales ?? []),
    [query.data]
  )

  const actionInsights = useMemo(
    () => deriveActionInsights(query.data?.data),
    [query.data]
  )

  return {
    ...query,
    salesChartPoints,
    treemapNodes,
    focusProductStock: query.data?.data.focusProductStock ?? {},
    customerCluster: query.data?.data.customerCluster ?? [],
    computedAt: query.data?.data.computedAt ?? null,
    actionInsights,
  }
}
