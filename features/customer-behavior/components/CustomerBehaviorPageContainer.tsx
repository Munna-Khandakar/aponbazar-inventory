"use client"

import { Loader2 } from "lucide-react"

import { BehavioralInsightsSection } from "@/features/customer-behavior/components/BehavioralInsightsSection"
import { ConsumerPurchaseBehaviorChart } from "@/features/customer-behavior/components/ConsumerPurchaseBehaviorChart"
import { CustomerDemographyChart } from "@/features/customer-behavior/components/CustomerDemographyChart"
import { CustomerSnapshotTable } from "@/features/customer-behavior/components/CustomerSnapshotTable"
import { ReportSectionState } from "@/features/customer-behavior/components/ReportSectionState"
import { ToplineCustomerOverview } from "@/features/customer-behavior/components/ToplineCustomerOverview"
import { TransactionMethodsDonutChart } from "@/features/customer-behavior/components/TransactionMethodsDonutChart"
import {
  buildCustomerOverview,
  useCustomerChurnSummary,
  useCustomerDemography,
  useCustomerPaymentMethods,
  useCustomerPurchaseBehavior,
  useCustomerToplineOverview,
  useShopCustomerSnapshot,
} from "@/features/customer-behavior/hooks/useCustomerBehaviorDashboard"
import { buildBehavioralInsights } from "@/features/customer-behavior/utils/buildBehavioralInsights"
import { useReportFilters } from "@/hooks/use-report-filters"

export function CustomerBehaviorPageContainer() {
  const { shopName } = useReportFilters()
  const toplineQuery = useCustomerToplineOverview()
  const churnQuery = useCustomerChurnSummary()
  const demographyQuery = useCustomerDemography()
  const paymentMethodsQuery = useCustomerPaymentMethods()
  const purchaseBehaviorQuery = useCustomerPurchaseBehavior()
  const snapshotQuery = useShopCustomerSnapshot()
  const isFetching = [
    toplineQuery,
    churnQuery,
    demographyQuery,
    paymentMethodsQuery,
    purchaseBehaviorQuery,
    snapshotQuery,
  ].some((query) => query.isFetching)
  const overview = toplineQuery.data
    ? buildCustomerOverview({
        totalUniqueCustomers: toplineQuery.data.totalUniqueCustomers,
        avgBasketValue: toplineQuery.data.avgBasketValue,
        atRisk: churnQuery.data?.atRisk ?? null,
      })
    : null
  const insights = buildBehavioralInsights({
    predictedChurn: churnQuery.data?.atRisk ?? null,
    paymentMethods: paymentMethodsQuery.data ?? [],
    snapshotRows: snapshotQuery.data ?? [],
    shopName,
  })

  return (
    <div className="space-y-6">
      {isFetching ? (
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
          <span>
            Updating live customer behavior data{shopName ? ` for ${shopName}` : ""}...
          </span>
        </div>
      ) : null}

      {shopName ? (
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-5 text-slate-600 shadow-sm">
          Shop selection filters the customer snapshot and purchase behavior chart. Topline,
          churn, demography, and payment mix remain current-month totals across all shops.
        </p>
      ) : null}

      {overview ? (
        <ToplineCustomerOverview overview={overview} />
      ) : (
        <ReportSectionState
          title="Topline Customer Overview"
          description="Current-month customer health signals"
          message={
            toplineQuery.isLoading
              ? "Loading topline customer overview..."
              : "Failed to load topline customer overview."
          }
          isLoading={toplineQuery.isLoading}
        />
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        {demographyQuery.data ? (
          <CustomerDemographyChart data={demographyQuery.data} />
        ) : (
          <ReportSectionState
            title="Customer Demography"
            description="Current-month male and female customers by age range"
            message={
              demographyQuery.isLoading
                ? "Loading customer demography..."
                : "Failed to load customer demography."
            }
            isLoading={demographyQuery.isLoading}
          />
        )}

        {paymentMethodsQuery.data ? (
          <TransactionMethodsDonutChart data={paymentMethodsQuery.data} />
        ) : (
          <ReportSectionState
            title="Payment Method Sales Mix"
            description="Current-month sales value by payment method"
            message={
              paymentMethodsQuery.isLoading
                ? "Loading payment method sales mix..."
                : "Failed to load payment method sales mix."
            }
            isLoading={paymentMethodsQuery.isLoading}
          />
        )}
      </section>

      <section
        id="shop-customer-snapshot"
        className="scroll-mt-[calc(var(--dashboard-topbar-height)+1.5rem)]"
      >
        {snapshotQuery.data ? (
          <CustomerSnapshotTable rows={snapshotQuery.data} />
        ) : (
          <ReportSectionState
            title="Shop customer snapshot"
            description="Last-30-day leading products and identified customers by shop"
            message={
              snapshotQuery.isLoading
                ? "Loading shop customer snapshot..."
                : "Failed to load shop customer snapshot."
            }
            isLoading={snapshotQuery.isLoading}
          />
        )}
      </section>

      {purchaseBehaviorQuery.data ? (
        <ConsumerPurchaseBehaviorChart data={purchaseBehaviorQuery.data} />
      ) : (
        <ReportSectionState
          title="Consumer Purchase Behavior"
          description="Current-month purchase frequency compared with average spend"
          message={
            purchaseBehaviorQuery.isLoading
              ? "Loading customer purchase behavior..."
              : "Failed to load customer purchase behavior."
          }
          isLoading={purchaseBehaviorQuery.isLoading}
        />
      )}

      <BehavioralInsightsSection insights={insights} />
    </div>
  )
}
