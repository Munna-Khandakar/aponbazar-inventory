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
