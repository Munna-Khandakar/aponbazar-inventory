'use client'

import { dashboardService } from "@/lib/services/dashboard-service"

type StaticQueryResult<T> = {
  data: T
  isLoading: false
  isError: false
  error: null
}

const createStaticHook = <T>(getter: () => T) => (): StaticQueryResult<T> => ({
  data: getter(),
  isLoading: false,
  isError: false,
  error: null,
})

export const useDashboardStats = createStaticHook(dashboardService.getStats)
export const usePageOneItems = createStaticHook(dashboardService.getPageOneItems)
export const usePageTwoAlerts = createStaticHook(dashboardService.getPageTwoAlerts)

// Dashboard Chart Hooks
export const useMonthlyRevenue = createStaticHook(dashboardService.getMonthlyRevenue)
export const useOrderVolume = createStaticHook(dashboardService.getOrderVolume)

// Page 1: Predictive Sales & Inventory Hooks
export const useSalesForecast = createStaticHook(dashboardService.getSalesForecast)
export const useInventoryPrediction = createStaticHook(dashboardService.getInventoryPrediction)
export const useDemandForecast = createStaticHook(dashboardService.getDemandForecast)
export const useStockLevels = createStaticHook(dashboardService.getStockLevels)
export const useInventoryHealth = createStaticHook(dashboardService.getInventoryHealth)

// Promotions & Store Ops
export const usePromoImpact = createStaticHook(dashboardService.getPromoImpact)
export const useStorePerformance = createStaticHook(dashboardService.getStorePerformance)

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
