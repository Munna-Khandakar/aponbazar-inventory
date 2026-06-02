"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { customerBehaviorApi } from "@/features/customer-behavior/api/customer-behavior.api"
import { customerBehaviorQueryKeys } from "@/features/customer-behavior/query-keys/customerBehaviorQueryKeys"
import type {
  CustomerDemographyRow,
  CustomerOverview,
  CustomerPurchaseBehaviorPoint,
  CustomerSnapshotRow,
  PaymentMethodSales,
} from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import { useReportFilters } from "@/hooks/use-report-filters"

const queryOptions = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const

const paymentMethodColors = {
  Cash: "#0f766e",
  Card: "#2563eb",
  MFS: "#f59e0b",
  Credit: "#8b5cf6",
} as const

export const useCustomerToplineOverview = () =>
  useQuery({
    queryKey: customerBehaviorQueryKeys.toplineOverview,
    queryFn: customerBehaviorApi.getToplineOverview,
    select: (rows) => rows[0] ?? null,
    ...queryOptions,
  })

export const useCustomerChurnSummary = () =>
  useQuery({
    queryKey: customerBehaviorQueryKeys.churnSummary,
    queryFn: customerBehaviorApi.getChurnSummary,
    select: (rows) => rows[0] ?? null,
    ...queryOptions,
  })

export const useCustomerDemography = () =>
  useQuery({
    queryKey: customerBehaviorQueryKeys.demography,
    queryFn: customerBehaviorApi.getDemography,
    select: (rows): CustomerDemographyRow[] =>
      rows.map((row) => ({
        ageRange: row.ageGroup,
        male: row.male,
        female: row.female,
      })),
    ...queryOptions,
  })

export const useCustomerPaymentMethods = () =>
  useQuery({
    queryKey: customerBehaviorQueryKeys.paymentMethods,
    queryFn: customerBehaviorApi.getPaymentMethods,
    select: (rows): PaymentMethodSales[] => {
      const row = rows[0]

      if (!row) {
        return []
      }

      return [
        {
          method: "Cash",
          amount: row.cashAmount,
          percentage: row.cashPct,
          color: paymentMethodColors.Cash,
        },
        {
          method: "Card",
          amount: row.cardAmount,
          percentage: row.cardPct,
          color: paymentMethodColors.Card,
        },
        {
          method: "MFS",
          amount: row.mfsAmount,
          percentage: row.mfsPct,
          color: paymentMethodColors.MFS,
        },
        {
          method: "Credit",
          amount: row.creditAmount,
          percentage: row.creditPct,
          color: paymentMethodColors.Credit,
        },
      ]
    },
    ...queryOptions,
  })

export const useCustomerPurchaseBehavior = () => {
  const { shopName } = useReportFilters()
  const query = useQuery({
    queryKey: customerBehaviorQueryKeys.purchaseBehavior,
    queryFn: customerBehaviorApi.getPurchaseBehavior,
    select: (rows): CustomerPurchaseBehaviorPoint[] =>
      rows.map((row) => ({
        customerId: row.customerId,
        customerName: row.customerName,
        shopName: row.shopName,
        purchaseFrequency: row.purchaseFrequency,
        averageSpend: row.avgSpend,
        totalSpend: row.totalSpend,
      })),
    ...queryOptions,
  })
  const data = useMemo(
    () =>
      shopName
        ? query.data?.filter((point) => point.shopName === shopName)
        : query.data,
    [query.data, shopName]
  )

  return {
    ...query,
    data,
  }
}

export const useShopCustomerSnapshot = () => {
  const { shopName } = useReportFilters()

  return useQuery({
    queryKey: customerBehaviorQueryKeys.shopSnapshot(shopName),
    queryFn: () => customerBehaviorApi.getShopSnapshot(shopName),
    select: (rows): CustomerSnapshotRow[] =>
      rows.map((row) => ({
        shopName: row.shopName,
        creditSaleRom: null,
        topProducts: row.topProducts.map((product) => ({
          rank: product.rank,
          subCategory: product.subCategory,
          salesValue: product.totalSales,
        })),
        topCustomers: row.topCustomers.map((customer) => ({
          rank: customer.rank,
          customerName: customer.customerName,
          spentValue: customer.totalSpend,
        })),
      })),
    ...queryOptions,
  })
}

export const buildCustomerOverview = ({
  totalUniqueCustomers,
  avgBasketValue,
  atRisk,
}: {
  totalUniqueCustomers: number
  avgBasketValue: number
  atRisk: number | null
}): CustomerOverview => ({
  totalUniqueCustomers,
  averageBasketValue: avgBasketValue,
  predictedChurn: atRisk,
  forecastAccuracy: null,
})
