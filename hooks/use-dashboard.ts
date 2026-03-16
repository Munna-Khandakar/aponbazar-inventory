'use client'

import { useQuery } from "@tanstack/react-query"

import { useReportFilters } from "@/hooks/use-report-filters"
import { dashboardService } from "@/lib/services/dashboard-service"
import {
  SalesReportType,
  type DateRangeReportParameters,
  type ExecuteReportRequest,
  type ReportParameters,
} from "@/lib/types/report"

type StaticQueryResult<T> = {
  data: T
  isLoading: false
  isError: false
  error: null
}

const reportPage = 0
const reportSize = 200

const createStaticHook = <T>(getter: () => T) => (): StaticQueryResult<T> => ({
  data: getter(),
  isLoading: false,
  isError: false,
  error: null,
})

const useReportRequest = <TReportName extends SalesReportType>(
  reportName: TReportName,
  options?: { includeGrowthTarget?: boolean }
): ExecuteReportRequest<TReportName, DateRangeReportParameters | ReportParameters> => {
  const { startDate, endDate, growthTarget } = useReportFilters()
  const parameters =
    options?.includeGrowthTarget === false
      ? { startDate, endDate }
      : { startDate, endDate, growthTarget }

  return {
    reportName,
    parameters,
    page: reportPage,
    size: reportSize,
  }
}

export const useDashboardStats = createStaticHook(dashboardService.getStats)
export const usePageOneItems = createStaticHook(dashboardService.getPageOneItems)
export const usePageTwoAlerts = createStaticHook(dashboardService.getPageTwoAlerts)

// Dashboard Chart Hooks
export const useMonthlyRevenue = createStaticHook(dashboardService.getMonthlyRevenue)
export const useOrderVolume = createStaticHook(dashboardService.getOrderVolume)

// Page 1: Predictive Sales & Inventory Hooks
export const useSalesForecast = () => {
  const request = useReportRequest(SalesReportType.MONTH_WISE_SALES, {
    includeGrowthTarget: true,
  })

  return useQuery({
    queryKey: ["reports", request.reportName, request.parameters, request.page, request.size],
    queryFn: () => dashboardService.getSalesForecast(request),
    placeholderData: (previousData) => previousData,
  })
}

export const useInventoryPrediction = createStaticHook(dashboardService.getInventoryPrediction)
export const useDemandForecast = createStaticHook(dashboardService.getDemandForecast)
export const useStockLevels = createStaticHook(dashboardService.getStockLevels)
export const useInventoryHealth = createStaticHook(dashboardService.getInventoryHealth)

// Promotions & Store Ops
export const usePromoImpact = () => {
  const request = useReportRequest(SalesReportType.SHOP_WISE_SALES_AGGREGATE, {
    includeGrowthTarget: false,
  })

  return useQuery({
    queryKey: ["reports", request.reportName, request.parameters, request.page, request.size],
    queryFn: () => dashboardService.getPromoImpact(request),
    placeholderData: (previousData) => previousData,
  })
}
export const useStorePerformance = () => {
  const request = useReportRequest(SalesReportType.SHOP_WISE_SALES_PERFORMANCE, {
    includeGrowthTarget: false,
  })

  return useQuery({
    queryKey: ["reports", request.reportName, request.parameters, request.page, request.size],
    queryFn: () => dashboardService.getStorePerformance(request),
    placeholderData: (previousData) => previousData,
  })
}

// Page 2: Customer Behavior Hooks
export const useCustomerSegments = createStaticHook(dashboardService.getCustomerSegments)
export const useChurnPrediction = createStaticHook(dashboardService.getChurnPrediction)
export const useBehaviorMetrics = createStaticHook(dashboardService.getBehaviorMetrics)
export const useRetentionCohorts = createStaticHook(dashboardService.getRetentionCohorts)
export const useCustomerLTV = createStaticHook(dashboardService.getCustomerLTV)

// Radial & Radar Chart Hooks
export const useMonthlyGoals = createStaticHook(dashboardService.getMonthlyGoals)
export const useCustomerSatisfaction = createStaticHook(
  dashboardService.getCustomerSatisfaction
)
