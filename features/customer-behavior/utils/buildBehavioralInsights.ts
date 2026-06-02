import type {
  BehavioralInsight,
  CustomerSnapshotRow,
  PaymentMethodSales,
} from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import {
  formatCurrency,
  formatNumber,
} from "@/features/customer-behavior/utils/formatCustomerBehaviorValue"

type BuildBehavioralInsightsOptions = {
  predictedChurn: number | null
  paymentMethods: PaymentMethodSales[]
  snapshotRows: CustomerSnapshotRow[]
  shopName: string
}

export const buildBehavioralInsights = ({
  predictedChurn,
  paymentMethods,
  snapshotRows,
  shopName,
}: BuildBehavioralInsightsOptions): BehavioralInsight[] => {
  const creditPayment = paymentMethods.find((method) => method.method === "Credit")
  const leadingProduct = snapshotRows
    .flatMap((row) =>
      row.topProducts.map((product) => ({
        shopName: row.shopName,
        ...product,
      }))
    )
    .sort((left, right) => right.salesValue - left.salesValue)[0]
  const scopeLabel = shopName ? ` for ${shopName}` : ""
  const insights: BehavioralInsight[] = [
    {
      id: "current-month-churn-risk",
      text:
        predictedChurn === null
          ? "The current churn-risk count is unavailable."
          : `${formatNumber(predictedChurn)} customers are currently at risk of crossing the churn threshold.`,
      tone: "critical",
    },
  ]

  if (creditPayment) {
    insights.push({
      id: "current-month-credit-share",
      text: `Credit payments account for ${creditPayment.percentage.toFixed(2)}% of current-month sales value (${formatCurrency(creditPayment.amount)}).`,
      tone: "warning",
    })
  }

  if (leadingProduct) {
    insights.push({
      id: "leading-product",
      text: `${leadingProduct.subCategory} is the leading product subcategory${scopeLabel}, with ${formatCurrency(leadingProduct.salesValue)} in sales over the last 30 days.`,
      tone: "opportunity",
    })
  }

  return insights
}
