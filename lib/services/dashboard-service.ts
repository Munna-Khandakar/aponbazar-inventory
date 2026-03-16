import { apiClient } from "@/lib/api-client"
import type {
  Alert,
  BehaviorMetricRow,
  ChurnPredictionData,
  CustomerLifetimeValueData,
  CustomerSatisfactionData,
  CustomerSegmentData,
  DemandForecastRow,
  Insight,
  InventoryPredictionData,
  InventoryHealthData,
  Metric,
  MonthlyGoalData,
  MonthlyRevenueData,
  OrderVolumeData,
  PromoImpactData,
  Reminder,
  RetentionCohortData,
  StockLevelData,
  StorePerformanceData,
} from "@/lib/types/dashboard"
import type { SalesForecastData } from "@/lib/types/SalesForecastData"
import type {
  ExecuteReportRequest,
  SalesForecastReportResponse,
  ShopPerformanceReportResponse,
} from "@/lib/types/report"
import { SalesReportType } from "@/lib/types/report"

const metrics: Metric[] = [
  { id: "sales", label: "Sales vs Target", value: "$1.28M", trend: "+6.2%", trendDirection: "up" },
  { id: "accuracy", label: "Forecast accuracy", value: "94.1%", trend: "+2.1pts", trendDirection: "up" },
  { id: "coverage", label: "Inventory cover days", value: "27 days", trend: "-3 days", trendDirection: "down" },
  { id: "shrink", label: "Shrink rate", value: "2.4%", trend: "-0.6pts", trendDirection: "up" },
]

const reminders: Reminder[] = [
  { id: 1, title: "Ship wholesale order #1042", dueDate: "Today, 5:30 PM" },
  { id: 2, title: "Reconcile payout batch", dueDate: "Tomorrow, 9:00 AM" },
  { id: 3, title: "Inventory count for West Hub", dueDate: "Fri, 2:00 PM" },
]

const insights: Insight[] = [
  {
    id: 1,
    title: "Restock perishables in Gulshan",
    description: "Fresh dairy inventory will dip below 2.5 days of cover by tomorrow afternoon.",
    status: "new",
  },
  {
    id: 2,
    title: "Approve weekend promo tiles",
    description: "Projected to lift basket size +9% in Mirpur once approved by Friday 3 PM.",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Close shrink investigation",
    description: "CCTV review complete for Uttara store; update audit log before EOD.",
    status: "done",
  },
]

const pageOneTasks: Insight[] = [
  {
    id: 1,
    title: "Sync supplier pricing",
    description: "Upload the revised wholesale catalog before the next cut-off window.",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Approve marketing assets",
    description: "Final review for the Eid promotion tiles destined for the hero section.",
    status: "new",
  },
  {
    id: 3,
    title: "Archive stale SKUs",
    description: "Hide 12 products with zero sales volume in the last quarter.",
    status: "done",
  },
]

const alerts: Alert[] = [
  {
    id: 1,
    message: "Payment gateway latency exceeded 400ms for 8 minutes.",
    severity: "medium",
    createdAt: "Today • 09:24 AM",
  },
  {
    id: 2,
    message: "Bulk import failed for merchant Orion Foods.",
    severity: "high",
    createdAt: "Today • 07:13 AM",
  },
  {
    id: 3,
    message: "Security patch available for reporting microservice.",
    severity: "low",
    createdAt: "Yesterday • 05:41 PM",
  },
]

// Dashboard Chart Data

const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: "Jan", revenue: 98500, target: 95000 },
  { month: "Feb", revenue: 105200, target: 100000 },
  { month: "Mar", revenue: 112800, target: 105000 },
  { month: "Apr", revenue: 118600, target: 110000 },
  { month: "May", revenue: 125300, target: 115000 },
  { month: "Jun", revenue: 128400, target: 120000 },
]

const orderVolumeData: OrderVolumeData[] = [
  { month: "Jan", orders: 856 },
  { month: "Feb", orders: 892 },
  { month: "Mar", orders: 923 },
  { month: "Apr", orders: 945 },
  { month: "May", orders: 968 },
  { month: "Jun", orders: 982 },
]

// Page 1: Predictive Sales & Inventory Data

const salesForecastApiResponse: SalesForecastReportResponse = {
  success: true,
  data: {
    reportName: SalesReportType.MONTH_WISE_SALES,
    series: {
      base: [
        { periodLabel: "October 2025", numTotalNetSales: 37882203.08 },
        { periodLabel: "November 2025", numTotalNetSales: 44589124.45 },
        { periodLabel: "December 2025", numTotalNetSales: 43813531.38 },
        { periodLabel: "January 2026", numTotalNetSales: 52358785.07 },
        { periodLabel: "February 2026", numTotalNetSales: 49232851.46 },
        { periodLabel: "March 2026", numTotalNetSales: 23764087.2 },
      ],
      actual: [
        { periodLabel: "October 2025", numTotalNetSales: 55649541.01 },
        { periodLabel: "November 2025", numTotalNetSales: 56362584.76 },
        { periodLabel: "December 2025", numTotalNetSales: 54716948.57 },
        { periodLabel: "January 2026", numTotalNetSales: 59598570.73 },
        { periodLabel: "February 2026", numTotalNetSales: 50323126.27 },
        { periodLabel: "March 2026", numTotalNetSales: 98973992.12 },
      ],
    },
    granularity: "MONTH",
    totalRows: 12,
    page: 0,
    pageSize: 0,
    totalPages: 0,
    executionTimeMs: 3247,
    generatedAt: "2026-03-16T16:28:43.109599",
  },
  timestamp: "2026-03-16T16:28:43.111624",
}

const mapSalesForecastReport = (
  response: SalesForecastReportResponse
): SalesForecastData[] =>
  response.data.series.base.map((forecastPoint) => {
    const actualPoint = response.data.series.actual.find(
      (point) => point.periodLabel === forecastPoint.periodLabel
    )

    return {
      periodLabel: forecastPoint.periodLabel,
      forecastedSales: forecastPoint.numTotalNetSales,
      actualSales: actualPoint?.numTotalNetSales ?? 0,
    }
  })

const inventoryPredictionData: InventoryPredictionData[] = [
  { month: "Jan", electronics: 1250, clothing: 2100, groceries: 3400, homeGoods: 1800 },
  { month: "Feb", electronics: 1320, clothing: 2250, groceries: 3600, homeGoods: 1900 },
  { month: "Mar", electronics: 1400, clothing: 2400, groceries: 3800, homeGoods: 2000 },
  { month: "Apr", electronics: 1480, clothing: 2550, groceries: 4000, homeGoods: 2100 },
  { month: "May", electronics: 1560, clothing: 2700, groceries: 4200, homeGoods: 2200 },
  { month: "Jun", electronics: 1640, clothing: 2850, groceries: 4400, homeGoods: 2300 },
  { month: "Jul", electronics: 1720, clothing: 3000, groceries: 4600, homeGoods: 2400 },
]

const demandForecastData: DemandForecastRow[] = [
  { sku: "ELEC-1001", product: "Wireless Headphones", currentStock: 245, predictedDemand: 320, recommendedOrder: 150, confidence: "high" },
  { sku: "CLO-2045", product: "Cotton T-Shirt (M)", currentStock: 180, predictedDemand: 290, recommendedOrder: 200, confidence: "high" },
  { sku: "GROC-3012", product: "Organic Rice 5kg", currentStock: 420, predictedDemand: 380, recommendedOrder: 100, confidence: "medium" },
  { sku: "HOME-4203", product: "Kitchen Knife Set", currentStock: 85, predictedDemand: 140, recommendedOrder: 100, confidence: "high" },
  { sku: "ELEC-1089", product: "Bluetooth Speaker", currentStock: 125, predictedDemand: 95, recommendedOrder: 0, confidence: "medium" },
  { sku: "CLO-2156", product: "Denim Jeans (32)", currentStock: 65, predictedDemand: 180, recommendedOrder: 150, confidence: "high" },
  { sku: "GROC-3401", product: "Coffee Beans 500g", currentStock: 290, predictedDemand: 310, recommendedOrder: 100, confidence: "medium" },
  { sku: "HOME-4567", product: "Bedsheet Set Queen", currentStock: 45, predictedDemand: 120, recommendedOrder: 100, confidence: "low" },
]

const stockLevelData: StockLevelData[] = [
  { category: "Electronics", inStock: 1640, lowStock: 85, outOfStock: 12 },
  { category: "Clothing", inStock: 2850, lowStock: 120, outOfStock: 8 },
  { category: "Groceries", inStock: 4400, lowStock: 65, outOfStock: 5 },
  { category: "Home Goods", inStock: 2300, lowStock: 95, outOfStock: 15 },
]

const inventoryHealthData: InventoryHealthData[] = [
  { category: "Fresh Food", healthy: 3120, atRisk: 460, overstock: 90, coverDays: 3 },
  { category: "Pantry Staples", healthy: 5480, atRisk: 310, overstock: 420, coverDays: 16 },
  { category: "Household Care", healthy: 2740, atRisk: 190, overstock: 160, coverDays: 14 },
  { category: "Health & Beauty", healthy: 2180, atRisk: 150, overstock: 85, coverDays: 9 },
]

const promoImpactData: PromoImpactData[] = [
  { campaign: "Eid Family Basket", baseline: 42000, forecast: 61000, upliftPct: 38, marginPct: 21 },
  { campaign: "Weekend Essentials", baseline: 28500, forecast: 36000, upliftPct: 26, marginPct: 17 },
  { campaign: "Hyper Saver Days", baseline: 19400, forecast: 31000, upliftPct: 60, marginPct: 15 },
  { campaign: "Fresh Express", baseline: 15800, forecast: 26200, upliftPct: 66, marginPct: 24 },
]

const storePerformanceApiResponse: ShopPerformanceReportResponse = {
  success: true,
  data: {
    reportName: SalesReportType.SHOP_WISE_SALES_PERFORMANCE,
    data: [
      {
        strShopName: "Khulshi Mart",
        actualSales: 83913790.87,
        baseSales: 0,
        actualDeliveries: 11405,
        baseDeliveries: 0,
      },
      {
        strShopName: "Liz Fashion Industry Ltd.",
        actualSales: 27492849.59,
        baseSales: 8153138.07,
        actualDeliveries: 26245,
        baseDeliveries: 7425,
        salesPerformance: 337.21,
        deliveryPerformance: 353.47,
      },
    ],
    totalRows: 38,
    page: 0,
    pageSize: 0,
    totalPages: 0,
    executionTimeMs: 6601,
    generatedAt: "2026-03-16T02:07:37.734742",
  },
  timestamp: "2026-03-16T02:07:37.736563",
}

const mapStorePerformanceReport = (
  response: ShopPerformanceReportResponse
): StorePerformanceData[] =>
  response.data.data.map((shop) => ({
    shopName: shop.strShopName,
    actualSales: shop.actualSales,
    baseSales: shop.baseSales,
    actualDeliveries: shop.actualDeliveries,
    baseDeliveries: shop.baseDeliveries,
    salesPerformance: shop.salesPerformance,
    deliveryPerformance: shop.deliveryPerformance,
  }))

// Page 2: Customer Behavior Data

const customerSegmentData: CustomerSegmentData[] = [
  { segment: "VIP", count: 245, percentage: 13.3 },
  { segment: "Regular", count: 892, percentage: 48.4 },
  { segment: "New", count: 485, percentage: 26.3 },
  { segment: "At Risk", count: 220, percentage: 12.0 },
]

const churnPredictionData: ChurnPredictionData[] = [
  { month: "Jan", actual_churn: 3.2, predicted_churn: 3.1 },
  { month: "Feb", actual_churn: 3.5, predicted_churn: 3.4 },
  { month: "Mar", actual_churn: 3.1, predicted_churn: 3.2 },
  { month: "Apr", actual_churn: 2.9, predicted_churn: 2.8 },
  { month: "May", actual_churn: 2.7, predicted_churn: 2.7 },
  { month: "Jun", actual_churn: 2.5, predicted_churn: 2.6 },
  { month: "Jul", predicted_churn: 2.4 },
  { month: "Aug", predicted_churn: 2.3 },
  { month: "Sep", predicted_churn: 2.2 },
]

const behaviorMetricsData: BehaviorMetricRow[] = [
  { metric: "Average Session Duration", value: "8m 42s", change: "+12%", trend: "up", prediction: "9m 15s next month" },
  { metric: "Purchase Frequency", value: "2.3x/month", change: "+8%", trend: "up", prediction: "2.5x/month next month" },
  { metric: "Cart Abandonment Rate", value: "24.5%", change: "-5%", trend: "down", prediction: "22% next month" },
  { metric: "Customer Satisfaction", value: "4.6/5", change: "0%", trend: "stable", prediction: "4.7/5 next month" },
  { metric: "Repeat Purchase Rate", value: "42%", change: "+15%", trend: "up", prediction: "45% next month" },
  { metric: "Email Click-Through", value: "18.2%", change: "+3%", trend: "up", prediction: "19% next month" },
]

const retentionCohortData: RetentionCohortData[] = [
  { cohort: "Jan 2024", month_0: 100, month_1: 78, month_2: 65, month_3: 58, month_4: 54, month_5: 51 },
  { cohort: "Feb 2024", month_0: 100, month_1: 82, month_2: 69, month_3: 62, month_4: 58, month_5: 55 },
  { cohort: "Mar 2024", month_0: 100, month_1: 85, month_2: 72, month_3: 66, month_4: 62, month_5: 59 },
  { cohort: "Apr 2024", month_0: 100, month_1: 87, month_2: 75, month_3: 69, month_4: 65, month_5: 62 },
  { cohort: "May 2024", month_0: 100, month_1: 89, month_2: 78, month_3: 72, month_4: 68, month_5: 0 },
  { cohort: "Jun 2024", month_0: 100, month_1: 91, month_2: 80, month_3: 74, month_4: 0, month_5: 0 },
]

const customerLTVData: CustomerLifetimeValueData[] = [
  { segment: "VIP", current_ltv: 1842, predicted_ltv: 2150 },
  { segment: "Regular", current_ltv: 524, predicted_ltv: 612 },
  { segment: "New", current_ltv: 156, predicted_ltv: 289 },
  { segment: "At Risk", current_ltv: 342, predicted_ltv: 185 },
]

// Radial Chart Data (Main Dashboard)

const monthlyGoalData: MonthlyGoalData[] = [
  { month: "Jan", goal: 100, actual: 87 },
  { month: "Feb", goal: 100, actual: 92 },
  { month: "Mar", goal: 100, actual: 95 },
  { month: "Apr", goal: 100, actual: 98 },
  { month: "May", goal: 100, actual: 96 },
  { month: "Jun", goal: 100, actual: 102 },
]

const customerSatisfactionData: CustomerSatisfactionData[] = [
  { category: "Product Quality", score: 88, maxScore: 100 },
  { category: "Customer Service", score: 92, maxScore: 100 },
  { category: "Delivery Experience", score: 85, maxScore: 100 },
  { category: "Website Usability", score: 78, maxScore: 100 },
  { category: "Value for Money", score: 82, maxScore: 100 },
  { category: "Brand Trust", score: 90, maxScore: 100 },
]

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))
const useMockReportResponses = true

const getMockReportResponse = (
  request: ExecuteReportRequest
): SalesForecastReportResponse | ShopPerformanceReportResponse => {
  switch (request.reportName) {
    case SalesReportType.MONTH_WISE_SALES:
      return clone(salesForecastApiResponse)
    case SalesReportType.SHOP_WISE_SALES_PERFORMANCE:
      return clone(storePerformanceApiResponse)
    default:
      throw new Error(`No mock response configured for report "${request.reportName}"`)
  }
}

const executeReport = async <
  TResponse extends SalesForecastReportResponse | ShopPerformanceReportResponse,
>(
  request: ExecuteReportRequest
): Promise<TResponse> => {
  if (useMockReportResponses) {
    return getMockReportResponse(request) as TResponse
  }

  const { data } = await apiClient.post<TResponse>("/api/reports/execute", request)
  return data
}

export const dashboardService = {
  getStats: () => clone({ metrics, reminders, insights }),
  getPageOneItems: () => clone({ items: pageOneTasks }),
  getPageTwoAlerts: () => clone({ alerts }),

  // Dashboard Charts
  getMonthlyRevenue: () => clone(monthlyRevenueData),
  getOrderVolume: () => clone(orderVolumeData),

  // Page 1: Predictive Sales & Inventory
  getSalesForecast: async (request: ExecuteReportRequest<SalesReportType.MONTH_WISE_SALES>) =>
    mapSalesForecastReport(
      await executeReport<SalesForecastReportResponse>(request)
    ),
  getInventoryPrediction: () => clone(inventoryPredictionData),
  getDemandForecast: () => clone(demandForecastData),
  getStockLevels: () => clone(stockLevelData),
  getInventoryHealth: () => clone(inventoryHealthData),

  // Promotions & Store Ops
  getPromoImpact: () => clone(promoImpactData),
  getStorePerformance: async (
    request: ExecuteReportRequest<SalesReportType.SHOP_WISE_SALES_PERFORMANCE>
  ) =>
    mapStorePerformanceReport(
      await executeReport<ShopPerformanceReportResponse>(request)
    ),

  // Page 2: Customer Behavior
  getCustomerSegments: () => clone(customerSegmentData),
  getChurnPrediction: () => clone(churnPredictionData),
  getBehaviorMetrics: () => clone(behaviorMetricsData),
  getRetentionCohorts: () => clone(retentionCohortData),
  getCustomerLTV: () => clone(customerLTVData),

  // Radial & Radar Charts
  getMonthlyGoals: () => clone(monthlyGoalData),
  getCustomerSatisfaction: () => clone(customerSatisfactionData),
}
