import type { CustomerOverview } from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import {
  formatCurrency,
  formatNumber,
  formatNullableNumber,
  formatNullablePercentage,
} from "@/features/customer-behavior/utils/formatCustomerBehaviorValue"
import { cn } from "@/lib/utils"

type ToplineCustomerOverviewProps = {
  overview: CustomerOverview
}

const cardStyles = [
  {
    panel: "border-emerald-200 bg-emerald-50/80",
    value: "text-emerald-700",
  },
  {
    panel: "border-violet-200 bg-violet-50/80",
    value: "text-violet-700",
  },
  {
    panel: "border-rose-200 bg-rose-50/80",
    value: "text-rose-700",
  },
  {
    panel: "border-sky-200 bg-sky-50/80",
    value: "text-sky-700",
  },
] as const

export function ToplineCustomerOverview({ overview }: ToplineCustomerOverviewProps) {
  const metrics = [
    {
      label: "Total Unique Customers",
      value: formatNumber(overview.totalUniqueCustomers),
      definition: "How many individual customers transacted in the selected period.",
    },
    {
      label: "Average Basket Value",
      value: formatCurrency(overview.averageBasketValue),
      definition: "Total sales divided by total transactions in the selected period.",
    },
    {
      label: "Predicted Churn",
      value: formatNullableNumber(overview.predictedChurn),
      definition: "Customers currently at risk of crossing the churn threshold.",
    },
    {
      label: "Forecast Accuracy",
      value: formatNullablePercentage(overview.forecastAccuracy),
      definition: "Forecast accuracy is not available from the current API.",
    },
  ]

  return (
    <section>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Topline Customer Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Current-month customer health signals
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <article
            key={metric.label}
            className={cn("flex h-full flex-col rounded-xl border p-5", cardStyles[index].panel)}
          >
            <p className="text-sm font-medium text-slate-700">{metric.label}</p>
            <p
              className={cn(
                "mt-3 text-2xl font-semibold tracking-tight",
                cardStyles[index].value
              )}
            >
              {metric.value}
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-600">{metric.definition}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
