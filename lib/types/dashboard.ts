export type Metric = {
  id: string
  label: string
  value: string
  trend: string
  trendDirection: "up" | "down"
}

export type Reminder = {
  id: number
  title: string
  dueDate: string
}

export type Insight = {
  id: number
  title: string
  description: string
  status: "new" | "in-progress" | "done"
}

export type Alert = {
  id: number
  message: string
  severity: "low" | "medium" | "high"
  createdAt: string
}

// Chart Data Types

export type MonthlyRevenueData = {
  month: string
  revenue: number
  target: number
}

export type OrderVolumeData = {
  month: string
  orders: number
}

export type SalesTargetData = {
  month: string
  actual: number
  target: number
}

// Predictive Sales & Inventory Types (Page 1)

export type SalesForecastData = {
  month: string
  actual?: number
  predicted: number
  confidence_low?: number
  confidence_high?: number
}

export type InventoryPredictionData = {
  month: string
  electronics: number
  clothing: number
  groceries: number
  homeGoods: number
}

export type DemandForecastRow = {
  sku: string
  product: string
  currentStock: number
  predictedDemand: number
  recommendedOrder: number
  confidence: "high" | "medium" | "low"
}

export type StockLevelData = {
  category: string
  inStock: number
  lowStock: number
  outOfStock: number
}

export type InventoryHealthData = {
  category: string
  healthy: number
  atRisk: number
  overstock: number
  coverDays: number
}

export type PromoImpactData = {
  campaign: string
  baseline: number
  forecast: number
  upliftPct: number
  marginPct: number
}

export type StorePerformanceData = {
  store: string
  region: string
  sales: number
  target: number
  footfall: number
  forecastAccuracy: number
  inventoryRisk: "low" | "medium" | "high"
}

// Customer Behavior Types (Page 2)

export type CustomerSegmentData = {
  segment: string
  count: number
  percentage: number
}

export type ChurnPredictionData = {
  month: string
  actual_churn?: number
  predicted_churn: number
}

export type BehaviorMetricRow = {
  metric: string
  value: string
  change: string
  trend: "up" | "down" | "stable"
  prediction: string
}

export type RetentionCohortData = {
  cohort: string
  month_0: number
  month_1: number
  month_2: number
  month_3: number
  month_4: number
  month_5: number
}

export type CustomerLifetimeValueData = {
  segment: string
  current_ltv: number
  predicted_ltv: number
}

// Radial Chart Types (Main Dashboard)

export type MonthlyGoalData = {
  month: string
  goal: number
  actual: number
}

export type CustomerSatisfactionData = {
  category: string
  score: number
  maxScore: number
}
