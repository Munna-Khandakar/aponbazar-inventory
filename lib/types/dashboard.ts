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

// Predictive Sales & Inventory Types (Page 1)

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
  shopName: string
  actualSales: number
  baseSales: number
  predictedGrossSales?: number
  salesPerformance?: number
}

export type StorePerformanceData = {
  shopName: string
  actualSales: number
  baseSales: number
  actualDeliveries: number
  baseDeliveries: number
  salesPerformance?: number
  deliveryPerformance?: number
}

export type StorePerformanceSnapshotData = {
  shopName: string
  actualSales: number
  targetSales: number
  predictedGrossSales?: number
  salesPerformance?: number
}

export type ShopPerformanceSummaryForecastPoint = {
  date: string
  predictedGrossSales: number
}

export type ShopPerformanceSummaryMonthOverview = {
  periodLabel: string
  actualSales: number
  grossSales: number
  returnSales: number
  target: number
  forecast: number
  targetDiff: number
  forecastDiff: number
  achievementRatio?: number
  gapRatio?: number
  forecastVsActualRatio?: number
}

export type ShopPerformanceSummaryCurrentMonth = {
  periodLabel: string
  completed: {
    label: string
    actualSales: number
    grossSales: number
    returnSales: number
    target: number
    forecast: number
    targetDiff: number
    forecastDiff: number
    achievementRatio?: number
    gapRatio?: number
    forecastVsActualRatio?: number
  }
  remaining: {
    label: string
    target: number
    forecast: number
    targetVsForecastRatio?: number
    forecastDayWise: ShopPerformanceSummaryForecastPoint[]
  }
}

export type ShopPerformanceSummaryNextMonth = {
  periodLabel: string
  target: number
  forecast: number
  targetVsForecastRatio?: number
  forecastDayWise: ShopPerformanceSummaryForecastPoint[]
}

export type ShopPerformanceSummaryItem = {
  shopName: string
  warehouseId: number
  prevMonth: ShopPerformanceSummaryMonthOverview
  currentMonth: ShopPerformanceSummaryCurrentMonth
  nextMonth: ShopPerformanceSummaryNextMonth
}

export type ShopPerformanceSummaryDataset = {
  asOf: string
  items: ShopPerformanceSummaryItem[]
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
