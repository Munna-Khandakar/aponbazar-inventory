export type InventoryHealthStatus = "Overstocked" | "Stockout Risk" | "Healthy"

export interface ShopInventorySnapshotReportRow {
  shopName: string
  currentStockQty: number
  currentStockValue: number
  fiveDayLifting?: number
}

export interface ShopInventorySnapshotReportResponse {
  success: boolean
  data: ShopInventorySnapshotReportRow[]
  timestamp: string
}

export interface ShopInventorySnapshotTableRow {
  shopName: string
  currentStockQty: number
  currentStockValue: number
  fiveDayLifting: number | null
  optimumInventoryValue: number | null
  inventoryHealth: InventoryHealthStatus | null
  forecastAccuracy: number | null
}
