import { apiClient } from "@/lib/api-client"

import type {
  CustomerBehaviorReportEnvelope,
  CustomerChurnSummaryReportRow,
  CustomerDemographyReportRow,
  CustomerPurchaseBehaviorReportRow,
  CustomerToplineOverviewReportRow,
  CustomerTransactionMethodsReportRow,
  ShopTopProductsCustomersReportRow,
} from "@/features/customer-behavior/types/CustomerBehaviorDashboard"

type CustomerBehaviorReportName =
  | "customer_topline_overview"
  | "customer_churn_summary"
  | "customer_demography_age_gender"
  | "customer_transaction_methods"
  | "customer_purchase_behaviour_analysis"
  | "shop_top_products_customers"

type ExecuteReportErrorResponse = {
  success: false
  error: string
  timestamp: string
}

const executeReport = async <TRow>(
  reportName: CustomerBehaviorReportName,
  parameters?: { shopName: string }
) => {
  const { data } = await apiClient.post<
    CustomerBehaviorReportEnvelope<TRow> | ExecuteReportErrorResponse
  >("/api/reports/execute", {
    reportName,
    ...(parameters ? { parameters } : {}),
  })

  if (!data.success || !("data" in data)) {
    throw new Error("error" in data ? data.error : `Failed to load ${reportName}`)
  }

  return data.data.data
}

export const customerBehaviorApi = {
  getToplineOverview: () =>
    executeReport<CustomerToplineOverviewReportRow>("customer_topline_overview"),
  getChurnSummary: () =>
    executeReport<CustomerChurnSummaryReportRow>("customer_churn_summary"),
  getDemography: () =>
    executeReport<CustomerDemographyReportRow>("customer_demography_age_gender"),
  getPaymentMethods: () =>
    executeReport<CustomerTransactionMethodsReportRow>("customer_transaction_methods"),
  getPurchaseBehavior: () =>
    executeReport<CustomerPurchaseBehaviorReportRow>(
      "customer_purchase_behaviour_analysis"
    ),
  getShopSnapshot: (shopName: string) =>
    executeReport<ShopTopProductsCustomersReportRow>(
      "shop_top_products_customers",
      shopName ? { shopName } : undefined
    ),
}
