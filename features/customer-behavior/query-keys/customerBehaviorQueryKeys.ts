export const customerBehaviorQueryKeys = {
  all: ["customer-behavior"] as const,
  toplineOverview: ["customer-behavior", "customer-topline-overview"] as const,
  churnSummary: ["customer-behavior", "customer-churn-summary"] as const,
  demography: ["customer-behavior", "customer-demography-age-gender"] as const,
  paymentMethods: ["customer-behavior", "customer-transaction-methods"] as const,
  purchaseBehavior: ["customer-behavior", "customer-purchase-behaviour-analysis"] as const,
  shopSnapshot: (shopName: string) =>
    ["customer-behavior", "shop-top-products-customers", shopName] as const,
}
