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
  ShopPerformanceSummaryDataset,
  StockLevelData,
  StorePerformanceData,
  StorePerformanceSnapshotData,
} from "@/lib/types/dashboard"
import type { SalesForecastData, SalesForecastDataset } from "@/lib/types/SalesForecastData"
import type {
  ExecuteReportRequest,
  SalesForecastReportResponse,
  ShopPerformanceSummaryReportResponse,
  ShopWiseSalesAggregateReportResponse,
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
      predicted: [
        { periodLabel: "February  2026", predictedGrossSales: 2131334.32 },
        { periodLabel: "March     2026", predictedGrossSales: 17399009.53 },
        { periodLabel: "April 2026", predictedGrossSales: 22000000 },
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
): SalesForecastDataset => {
  const normalizePeriodLabel = (periodLabel: string) =>
    periodLabel.replace(/\s+/g, " ").trim()

  const monthOrder = new Map([
    ["january", 0],
    ["february", 1],
    ["march", 2],
    ["april", 3],
    ["may", 4],
    ["june", 5],
    ["july", 6],
    ["august", 7],
    ["september", 8],
    ["october", 9],
    ["november", 10],
    ["december", 11],
  ])

  const getPeriodTimestamp = (periodLabel: string) => {
    const normalizedLabel = normalizePeriodLabel(periodLabel)
    const weekMatch = normalizedLabel.match(/^(\d{4})-W(\d{1,2})$/)

    if (weekMatch) {
      const [, year, week] = weekMatch
      return Number(year) * 100 + Number(week)
    }

    const [monthName, year] = normalizedLabel.split(" ")
    const monthIndex = monthOrder.get(monthName.toLowerCase())
    const yearNumber = Number(year)

    if (monthIndex === undefined || Number.isNaN(yearNumber)) {
      return Number.MAX_SAFE_INTEGER
    }

    return yearNumber * 100 + monthIndex
  }

  const baseByPeriod = new Map(
    response.data.series.base.map((point) => [
      normalizePeriodLabel(point.periodLabel),
      point.numTotalNetSales,
    ])
  )

  const actualByPeriod = new Map(
    response.data.series.actual.map((point) => [
      normalizePeriodLabel(point.periodLabel),
      point.numTotalNetSales,
    ])
  )

  const predictedByPeriod = new Map(
    (response.data.series.predicted ?? []).map((point) => [
      normalizePeriodLabel(point.periodLabel),
      point.predictedGrossSales,
    ])
  )

  const periods = Array.from(
    new Set([
      ...baseByPeriod.keys(),
      ...actualByPeriod.keys(),
      ...predictedByPeriod.keys(),
    ])
  ).sort((left, right) => getPeriodTimestamp(left) - getPeriodTimestamp(right))

  return {
    granularity: response.data.granularity,
    points: bridgePredictedSalesPoint(
      periods.map((periodLabel) => ({
        periodLabel,
        forecastedSales: baseByPeriod.get(periodLabel) ?? null,
        actualSales: actualByPeriod.get(periodLabel) ?? null,
        predictedSales: predictedByPeriod.get(periodLabel) ?? null,
        predictedSalesLine: predictedByPeriod.get(periodLabel) ?? null,
      }))
    ),
  }
}

const bridgePredictedSalesPoint = (
  data: SalesForecastData[]
): SalesForecastData[] => {
  const lastActualIndex = data.reduce(
    (latestIndex, point, index) => (point.actualSales !== null ? index : latestIndex),
    -1
  )
  const firstPredictedIndex = data.findIndex((point) => point.predictedSales !== null)
  const shouldBridgePrediction =
    lastActualIndex !== -1 &&
    firstPredictedIndex !== -1 &&
    firstPredictedIndex > lastActualIndex

  return data.map((point, index) => ({
    ...point,
    predictedSalesLine:
      shouldBridgePrediction && index === lastActualIndex
        ? point.actualSales
        : point.predictedSales,
  }))
}

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

const mapShopWiseSalesReport = (
  response: ShopWiseSalesAggregateReportResponse
): PromoImpactData[] =>
  response.data.data.map((shop) => ({
    shopName: shop.strShopName,
    baseSales: shop.baseSales,
    predictedGrossSales: shop.predictedGrossSales,
    actualSales: shop.actualSales,
    salesPerformance: shop.salesPerformance,
  }))

const mapStorePerformanceSnapshotReport = (
  response: ShopWiseSalesAggregateReportResponse
): StorePerformanceSnapshotData[] =>
  response.data.data.map((shop) => ({
    shopName: shop.strShopName,
    actualSales: shop.actualSales,
    targetSales: shop.baseSales,
    predictedGrossSales: shop.predictedGrossSales,
    salesPerformance: shop.salesPerformance,
  }))

const storePerformanceApiResponse: ShopPerformanceReportResponse = {
  success: true,
  data: {
    reportName: SalesReportType.SHOP_WISE_SALES_PERFORMANCE,
    data: [
      {
        strShopName: "Khulshi Mart",
        actualSales: 83915322.87,
        baseSales: 0,
        actualDeliveries: 11405,
        baseDeliveries: 0,
      },
      {
        strShopName: "Liz Fashion Industry Ltd.",
        actualSales: 27493249.61,
        baseSales: 8153138.07,
        actualDeliveries: 26245,
        baseDeliveries: 7425,
        salesPerformance: 337.21,
        deliveryPerformance: 353.47,
      },
      {
        strShopName: "Lida Textile & Dyeing Limited",
        actualSales: 24657578.65,
        baseSales: 15725560.62,
        actualDeliveries: 29158,
        baseDeliveries: 20807,
        salesPerformance: 156.8,
        deliveryPerformance: 140.14,
      },
      {
        strShopName: "Silken Sewing Ltd.",
        actualSales: 21579914.54,
        baseSales: 22082873.9,
        actualDeliveries: 22966,
        baseDeliveries: 22128,
        salesPerformance: 97.72,
        deliveryPerformance: 103.79,
      },
      {
        strShopName: "Interstoff Apparels Ltd.",
        actualSales: 18856212.32,
        baseSales: 19033701.83,
        actualDeliveries: 18512,
        baseDeliveries: 27978,
        salesPerformance: 99.07,
        deliveryPerformance: 66.17,
      },
      {
        strShopName: "Alim Knit (BD) Ltd.",
        actualSales: 15743168.23,
        baseSales: 13956224.93,
        actualDeliveries: 12773,
        baseDeliveries: 11074,
        salesPerformance: 112.8,
        deliveryPerformance: 115.34,
      },
      {
        strShopName: "Silver Line Composite Mills Ltd.",
        actualSales: 15435842.48,
        baseSales: 11688448.22,
        actualDeliveries: 14192,
        baseDeliveries: 11083,
        salesPerformance: 132.06,
        deliveryPerformance: 128.05,
      },
      {
        strShopName: "The Rose Dresses Limited",
        actualSales: 15029378.74,
        baseSales: 11227949.45,
        actualDeliveries: 16932,
        baseDeliveries: 12131,
        salesPerformance: 133.86,
        deliveryPerformance: 139.58,
      },
      {
        strShopName: "Majumder Garments Limited",
        actualSales: 14021545.17,
        baseSales: 9696130.95,
        actualDeliveries: 13165,
        baseDeliveries: 10112,
        salesPerformance: 144.61,
        deliveryPerformance: 130.19,
      },
      {
        strShopName: "Dekko Designs Limited",
        actualSales: 13871754.48,
        baseSales: 13725578.44,
        actualDeliveries: 14382,
        baseDeliveries: 13753,
        salesPerformance: 101.07,
        deliveryPerformance: 104.57,
      },
      {
        strShopName: "Agami Apparels Ltd.",
        actualSales: 11301875.38,
        baseSales: 2321195.1,
        actualDeliveries: 15104,
        baseDeliveries: 3043,
        salesPerformance: 486.9,
        deliveryPerformance: 496.35,
      },
      {
        strShopName: "Saturn Textiles Ltd.",
        actualSales: 8708997.4,
        baseSales: 6669181.18,
        actualDeliveries: 12780,
        baseDeliveries: 8387,
        salesPerformance: 130.59,
        deliveryPerformance: 152.38,
      },
      {
        strShopName: "KDS IDR Limited",
        actualSales: 8312839.19,
        baseSales: 7649708.27,
        actualDeliveries: 6755,
        baseDeliveries: 7114,
        salesPerformance: 108.67,
        deliveryPerformance: 94.95,
      },
      {
        strShopName: "GoodEarth Apparels Ltd.",
        actualSales: 8150426.95,
        baseSales: 9589565.73,
        actualDeliveries: 9050,
        baseDeliveries: 11345,
        salesPerformance: 84.99,
        deliveryPerformance: 79.77,
      },
      {
        strShopName: "Renaissance Apparels Ltd.",
        actualSales: 7442799.34,
        baseSales: 10859409.23,
        actualDeliveries: 10024,
        baseDeliveries: 11137,
        salesPerformance: 68.54,
        deliveryPerformance: 90.01,
      },
      {
        strShopName: "Southern Garments Ltd.",
        actualSales: 7349162.75,
        baseSales: 7765348.12,
        actualDeliveries: 9926,
        baseDeliveries: 12041,
        salesPerformance: 94.64,
        deliveryPerformance: 82.44,
      },
      {
        strShopName: "Evitex Dress Shirt Limited",
        actualSales: 6952091.94,
        baseSales: 7468059.82,
        actualDeliveries: 6770,
        baseDeliveries: 8197,
        salesPerformance: 93.09,
        deliveryPerformance: 82.59,
      },
      {
        strShopName: "Continental Garments Ind. (Pvt.) Ltd.",
        actualSales: 6826383.71,
        baseSales: 8665348.39,
        actualDeliveries: 8669,
        baseDeliveries: 11210,
        salesPerformance: 78.78,
        deliveryPerformance: 77.33,
      },
      {
        strShopName: "EcoFab Limited",
        actualSales: 6290494.55,
        baseSales: 6707540.03,
        actualDeliveries: 6563,
        baseDeliveries: 6074,
        salesPerformance: 93.78,
        deliveryPerformance: 108.05,
      },
      {
        strShopName: "Interfab Shirt Manufacturing Limited Unit-02 (Viyellatex Group).",
        actualSales: 6247001.85,
        baseSales: 5791483.54,
        actualDeliveries: 5898,
        baseDeliveries: 5674,
        salesPerformance: 107.87,
        deliveryPerformance: 103.95,
      },
      {
        strShopName: "Mehmud Industries Limited",
        actualSales: 5875069.27,
        baseSales: 2266060.5,
        actualDeliveries: 6430,
        baseDeliveries: 3063,
        salesPerformance: 259.26,
        deliveryPerformance: 209.92,
      },
      {
        strShopName: "Global Fit (Bangladesh) Limited",
        actualSales: 5585101.36,
        baseSales: 0,
        actualDeliveries: 6784,
        baseDeliveries: 0,
      },
      {
        strShopName: "Millenneium Textiles (Southern) Ltd.",
        actualSales: 5332393.71,
        baseSales: 2922708.2,
        actualDeliveries: 6762,
        baseDeliveries: 4606,
        salesPerformance: 182.45,
        deliveryPerformance: 146.81,
      },
      {
        strShopName: "Setara Group",
        actualSales: 4585105.61,
        baseSales: 0,
        actualDeliveries: 5826,
        baseDeliveries: 0,
      },
      {
        strShopName: "Picard Bangladesh Limited",
        actualSales: 4439726.32,
        baseSales: 4021164.56,
        actualDeliveries: 7835,
        baseDeliveries: 5337,
        salesPerformance: 110.41,
        deliveryPerformance: 146.81,
      },
      {
        strShopName: "Interfab Shirt Manufacturing Limited Unit-01",
        actualSales: 3585825.97,
        baseSales: 6646493.09,
        actualDeliveries: 3382,
        baseDeliveries: 5226,
        salesPerformance: 53.95,
        deliveryPerformance: 64.71,
      },
      {
        strShopName: "Eco Couture",
        actualSales: 2868949.76,
        baseSales: 0,
        actualDeliveries: 3683,
        baseDeliveries: 0,
      },
      {
        strShopName: "Karim Textiles Ltd.",
        actualSales: 2786028.86,
        baseSales: 0,
        actualDeliveries: 1914,
        baseDeliveries: 0,
      },
      {
        strShopName: "Concorde Garments Ltd.",
        actualSales: 2670948.38,
        baseSales: 7986813.66,
        actualDeliveries: 2161,
        baseDeliveries: 7034,
        salesPerformance: 33.44,
        deliveryPerformance: 30.72,
      },
      {
        strShopName: "Aus-Bangla Jutex",
        actualSales: 2568488.88,
        baseSales: 2335192.41,
        actualDeliveries: 3037,
        baseDeliveries: 2666,
        salesPerformance: 109.99,
        deliveryPerformance: 113.92,
      },
      {
        strShopName: "Amigo Bangladesh Limited",
        actualSales: 1986715.13,
        baseSales: 0,
        actualDeliveries: 3505,
        baseDeliveries: 0,
      },
      {
        strShopName: "Pioneer Knitwears (BD) Ltd.",
        actualSales: 1965928.45,
        baseSales: 1371955.9,
        actualDeliveries: 3377,
        baseDeliveries: 2928,
        salesPerformance: 143.29,
        deliveryPerformance: 115.33,
      },
      {
        strShopName: "Simco Spinning & Textiles Limited",
        actualSales: 1644423.45,
        baseSales: 0,
        actualDeliveries: 2989,
        baseDeliveries: 0,
      },
      {
        strShopName: "Impress-Newtex Knit Fashions Ltd.",
        actualSales: 635370.97,
        baseSales: 0,
        actualDeliveries: 502,
        baseDeliveries: 0,
      },
      {
        strShopName: "Karnaphuli EPZ",
        actualSales: 482306.5,
        baseSales: 0,
        actualDeliveries: 545,
        baseDeliveries: 0,
      },
      {
        strShopName: "MG Niche Stitch Limited",
        actualSales: 271939.94,
        baseSales: 5643629.98,
        actualDeliveries: 433,
        baseDeliveries: 6018,
        salesPerformance: 4.82,
        deliveryPerformance: 7.2,
      },
      {
        strShopName: "Tropical Knitex Limited",
        actualSales: 155173,
        baseSales: 0,
        actualDeliveries: 294,
        baseDeliveries: 0,
      },
      {
        strShopName: "Apon Central Warehouse",
        actualSales: 309.76,
        baseSales: 0,
        actualDeliveries: 9,
        baseDeliveries: 0,
      },
    ],
    totalRows: 38,
    page: 0,
    pageSize: 0,
    totalPages: 0,
    executionTimeMs: 12113,
    generatedAt: "2026-03-16T22:35:18.068183",
  },
  timestamp: "2026-03-16T22:35:18.068224",
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

const mapShopPerformanceSummaryReport = (
  response: ShopPerformanceSummaryReportResponse
): ShopPerformanceSummaryDataset => ({
  asOf: response.timestamp,
  items: response.data.map((shop) => ({
    shopName: shop.shopName,
    warehouseId: shop.intWarehouseId,
    prevMonth: {
      periodLabel: shop.prevMonth.periodLabel,
      actualSales: shop.prevMonth.actualSales,
      grossSales: shop.prevMonth.grossSales,
      returnSales: shop.prevMonth.returnSales,
      target: shop.prevMonth.target,
      forecast: shop.prevMonth.forecast,
      targetDiff: shop.prevMonth.targetDiff,
      forecastDiff: shop.prevMonth.forecastDiff,
      achievementRatio: shop.prevMonth.achievementRatio,
      gapRatio: shop.prevMonth.gapRatio,
      forecastVsActualRatio: shop.prevMonth.forecastVsActualRatio,
    },
    currentMonth: {
      periodLabel: shop.currentMonth.periodLabel,
      completed: {
        label: shop.currentMonth.completed.label,
        actualSales: shop.currentMonth.completed.actualSales,
        grossSales: shop.currentMonth.completed.grossSales,
        returnSales: shop.currentMonth.completed.returnSales,
        target: shop.currentMonth.completed.target,
        forecast: shop.currentMonth.completed.forecast,
        targetDiff: shop.currentMonth.completed.targetDiff,
        forecastDiff: shop.currentMonth.completed.forecastDiff,
        achievementRatio: shop.currentMonth.completed.achievementRatio,
        gapRatio: shop.currentMonth.completed.gapRatio,
        forecastVsActualRatio: shop.currentMonth.completed.forecastVsActualRatio,
      },
      remaining: {
        label: shop.currentMonth.remaining.label,
        target: shop.currentMonth.remaining.target,
        forecast: shop.currentMonth.remaining.forecast,
        targetVsForecastRatio: shop.currentMonth.remaining.targetVsForecastRatio,
        forecastDayWise: shop.currentMonth.remaining.forecastDayWise.map((point) => ({
          date: point.date,
          predictedGrossSales: point.predictedGrossSales,
        })),
      },
    },
    nextMonth: {
      periodLabel: shop.nextMonth.periodLabel,
      target: shop.nextMonth.target,
      forecast: shop.nextMonth.forecast,
      targetVsForecastRatio: shop.nextMonth.targetVsForecastRatio,
      forecastDayWise: shop.nextMonth.forecastDayWise.map((point) => ({
        date: point.date,
        predictedGrossSales: point.predictedGrossSales,
      })),
    },
  })),
})

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
const liveReportTypes = new Set<SalesReportType>([
  SalesReportType.MONTH_WISE_SALES,
  SalesReportType.SHOP_WISE_SALES_AGGREGATE,
  SalesReportType.SHOP_WISE_SALES_PERFORMANCE,
  SalesReportType.SHOP_PERFORMANCE_SUMMARY,
])

const getMockReportResponse = (
  request: ExecuteReportRequest
):
  | SalesForecastReportResponse
  | ShopPerformanceReportResponse => {
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
  TResponse extends
    | SalesForecastReportResponse
    | ShopPerformanceSummaryReportResponse
    | ShopWiseSalesAggregateReportResponse
    | ShopPerformanceReportResponse,
>(
  request: ExecuteReportRequest
): Promise<TResponse> => {
  if (!liveReportTypes.has(request.reportName)) {
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
  getPromoImpact: async (
    request: ExecuteReportRequest<SalesReportType.SHOP_WISE_SALES_AGGREGATE>
  ) =>
    mapShopWiseSalesReport(
      await executeReport<ShopWiseSalesAggregateReportResponse>(request)
    ),
  getStorePerformanceSnapshot: async (
    request: ExecuteReportRequest<SalesReportType.SHOP_WISE_SALES_AGGREGATE>
  ) =>
    mapStorePerformanceSnapshotReport(
      await executeReport<ShopWiseSalesAggregateReportResponse>(request)
    ),
  getStorePerformance: async (
    request: ExecuteReportRequest<SalesReportType.SHOP_WISE_SALES_PERFORMANCE>
  ) =>
    mapStorePerformanceReport(
      await executeReport<ShopPerformanceReportResponse>(request)
    ),
  getShopPerformanceSummary: async (
    request: ExecuteReportRequest<SalesReportType.SHOP_PERFORMANCE_SUMMARY>
  ) =>
    mapShopPerformanceSummaryReport(
      await executeReport<ShopPerformanceSummaryReportResponse>(request)
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
