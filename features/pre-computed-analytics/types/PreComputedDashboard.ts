export interface SalesMonthlyStat {
  shopName: string
  monthStart: string
  netSales: number
  predictedSales: number | null
  predictedMargin: number | null
}

export interface BigBlockSalesStat {
  subCategory: string
  bigBlock: string
  totalSales: number
}

export interface FocusProductOutletRow {
  shopName: string
  currentStockQty: number
  currentStockValue: number
  fiveDayLifting: number | null
  optimumInventoryValue: number | null
  inventoryHealth: "Healthy" | "Overstocked" | "Stockout Risk" | null
}

export interface CustomerClusterRow {
  customerId: number
  customerName: string
  totalSpend: number
  clusterLabel: string
}

export interface PreComputedDashboardData {
  salesMonthly: SalesMonthlyStat[]
  bigBlockSales: BigBlockSalesStat[]
  focusProductStock: Record<string, FocusProductOutletRow[]>
  customerCluster: CustomerClusterRow[]
  computedAt: string
}

export interface PreComputedDashboardResponse {
  success: boolean
  data: PreComputedDashboardData
}

export interface SalesChartPoint {
  monthLabel: string
  netSales: number
  predictedSales: number | null
  predictedMargin: number | null
}

export interface BigBlockTreemapNode {
  name: string
  children: { name: string; size: number }[]
}

export interface ActionInsight {
  id: string
  text: string
  tone: "critical" | "warning" | "opportunity"
}
