"use client"

import { Loader2 } from "lucide-react"

import { BehavioralInsightsSection } from "@/features/customer-behavior/components/BehavioralInsightsSection"
import { ConsumerClusterPredictionChart } from "@/features/customer-behavior/components/ConsumerClusterPredictionChart"
import { CustomerDemographyChart } from "@/features/customer-behavior/components/CustomerDemographyChart"
import { CustomerSnapshotTable } from "@/features/customer-behavior/components/CustomerSnapshotTable"
import { ToplineCustomerOverview } from "@/features/customer-behavior/components/ToplineCustomerOverview"
import { TransactionMethodsDonutChart } from "@/features/customer-behavior/components/TransactionMethodsDonutChart"
import { useCustomerBehaviorDashboard } from "@/features/customer-behavior/hooks/useCustomerBehaviorDashboard"
import { useReportFilters } from "@/hooks/use-report-filters"

export function CustomerBehaviorPageContainer() {
  const { shopName } = useReportFilters()
  const { data, isLoading, isFetching, error } = useCustomerBehaviorDashboard()

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-border/70 bg-card text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading customer behavior data...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-destructive/30 bg-card text-sm text-destructive">
        Failed to load customer behavior data.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isFetching ? (
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
          <span>
            Updating customer behavior data{shopName ? ` for ${shopName}` : ""}...
          </span>
        </div>
      ) : null}

      <ToplineCustomerOverview overview={data.overview} />

      <section className="grid gap-6 lg:grid-cols-2">
        <CustomerDemographyChart data={data.demography} />
        <TransactionMethodsDonutChart data={data.transactionMethods} />
      </section>

      <section
        id="shop-customer-snapshot"
        className="scroll-mt-[calc(var(--dashboard-topbar-height)+1.5rem)]"
      >
        <CustomerSnapshotTable rows={data.snapshotRows} />
      </section>

      <ConsumerClusterPredictionChart data={data.clusterPoints} />

      <BehavioralInsightsSection insights={data.insights} />
    </div>
  )
}
