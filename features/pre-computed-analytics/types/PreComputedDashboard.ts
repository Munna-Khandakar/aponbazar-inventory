export type InventoryHealth = "Healthy" | "Caution" | "Low"

export interface SalesMonthlyStat {
  shopName: string
  warehouseId: number
  monthStart: string
  monthLabel: string
  periodYear: number
  periodMonth: number
  netSales: number
  totalTransactions: number
  uniqueCustomers: number
  // Stage 3 — not sent by the backend yet (kept nullable for forward-compat).
  predictedSales?: number | null
  predictedMargin?: number | null
}

export interface BigBlockSalesStat {
  subCategory: string
  bigBlock: string
  totalSales: number
  totalQty: number
  totalTransactions: number
}

export interface FocusProductOutletRow {
  shopName: string
  warehouseId: number
  subCategory: string
  currentStockQty: number
  currentStockValue: number
  netSales: number
  lifting5d: number | null
  inventoryHealth: InventoryHealth | null
}

export interface FocusTop20Row {
  subCategory: string
  netSales: number
  salesPct: number
  currentStockValue: number
  lifting5d: number | null
  inventoryHealth: InventoryHealth | null
}

export interface CustomerClusterRow {
  customerId: number
  customerName: string
  mobileNo: string
  shopName: string
  warehouseId: number
  gender: string
  ageGroup: string
  purchaseFrequency: number
  totalSpend: number
  avgSpend: number
  firstPurchaseDate: string
  lastPurchaseDate: string
  activeDays: number
  daysSinceLastPurchase: number
}

export interface ActionInsightCounts {
  lowStock: number
  stockOutRisk: number
  overstock: number
  reorderSuggested: number
  salesOpportunity: number
  computedAt: string
}

export interface DashboardKpi {
  snapshotDate: string
  totalInventoryValue: number
  inventoryValueDeltaPct: number | null
  outletsActive: number
  outletsTotal: number
  computedAt: string
}

export interface PreComputedDashboardData {
  salesMonthly: SalesMonthlyStat[]
  bigBlockSales: BigBlockSalesStat[]
  focusProductStock: Record<string, FocusProductOutletRow[]>
  focusTop20: FocusTop20Row[]
  customerCluster: CustomerClusterRow[]
  actionInsights: ActionInsightCounts
  dashboardKpi: DashboardKpi
  computedAt: string
}

export interface PreComputedDashboardResponse {
  success: boolean
  data: PreComputedDashboardData
  timestamp: string
}

export interface SalesChartPoint {
  monthLabel: string
  netSales: number
  momGrowth: number | null
  yoyGrowth: number | null
}

export interface TreemapCategory {
  name: string
  totalSales: number
  pct: number
}
