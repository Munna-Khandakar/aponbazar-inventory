'use client'

import { useQuery } from "@tanstack/react-query"

import { dashboardService } from "@/lib/services/dashboard-service"

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardService.getStats,
  })

export const usePageOneItems = () =>
  useQuery({
    queryKey: ["dashboard", "page1"],
    queryFn: dashboardService.getPageOneItems,
  })

export const usePageTwoAlerts = () =>
  useQuery({
    queryKey: ["dashboard", "page2"],
    queryFn: dashboardService.getPageTwoAlerts,
  })

// Dashboard Chart Hooks

export const useMonthlyRevenue = () =>
  useQuery({
    queryKey: ["dashboard", "charts", "monthly-revenue"],
    queryFn: dashboardService.getMonthlyRevenue,
  })

export const useOrderVolume = () =>
  useQuery({
    queryKey: ["dashboard", "charts", "order-volume"],
    queryFn: dashboardService.getOrderVolume,
  })

export const useSalesTarget = () =>
  useQuery({
    queryKey: ["dashboard", "charts", "sales-target"],
    queryFn: dashboardService.getSalesTarget,
  })

export const useKPIComparison = () =>
  useQuery({
    queryKey: ["dashboard", "charts", "kpi-comparison"],
    queryFn: dashboardService.getKPIComparison,
  })

// Page 1: Predictive Sales & Inventory Hooks

export const useSalesForecast = () =>
  useQuery({
    queryKey: ["dashboard", "page1", "sales-forecast"],
    queryFn: dashboardService.getSalesForecast,
  })

export const useInventoryPrediction = () =>
  useQuery({
    queryKey: ["dashboard", "page1", "inventory-prediction"],
    queryFn: dashboardService.getInventoryPrediction,
  })

export const useDemandForecast = () =>
  useQuery({
    queryKey: ["dashboard", "page1", "demand-forecast"],
    queryFn: dashboardService.getDemandForecast,
  })

export const useStockLevels = () =>
  useQuery({
    queryKey: ["dashboard", "page1", "stock-levels"],
    queryFn: dashboardService.getStockLevels,
  })

// Page 2: Customer Behavior Hooks

export const useCustomerSegments = () =>
  useQuery({
    queryKey: ["dashboard", "page2", "customer-segments"],
    queryFn: dashboardService.getCustomerSegments,
  })

export const useChurnPrediction = () =>
  useQuery({
    queryKey: ["dashboard", "page2", "churn-prediction"],
    queryFn: dashboardService.getChurnPrediction,
  })

export const useBehaviorMetrics = () =>
  useQuery({
    queryKey: ["dashboard", "page2", "behavior-metrics"],
    queryFn: dashboardService.getBehaviorMetrics,
  })

export const useRetentionCohorts = () =>
  useQuery({
    queryKey: ["dashboard", "page2", "retention-cohorts"],
    queryFn: dashboardService.getRetentionCohorts,
  })

export const useCustomerLTV = () =>
  useQuery({
    queryKey: ["dashboard", "page2", "customer-ltv"],
    queryFn: dashboardService.getCustomerLTV,
  })

// Radial & Radar Chart Hooks

export const useMonthlyGoals = () =>
  useQuery({
    queryKey: ["dashboard", "charts", "monthly-goals"],
    queryFn: dashboardService.getMonthlyGoals,
  })

export const useProductPerformance = () =>
  useQuery({
    queryKey: ["dashboard", "page1", "product-performance"],
    queryFn: dashboardService.getProductPerformance,
  })

export const useCustomerSatisfaction = () =>
  useQuery({
    queryKey: ["dashboard", "page2", "customer-satisfaction"],
    queryFn: dashboardService.getCustomerSatisfaction,
  })
