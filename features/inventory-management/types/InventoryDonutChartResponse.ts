import type { DateRange } from "@/features/inventory-management/types/DateRange"
import type { InventoryDonutSlice } from "@/features/inventory-management/types/InventoryDonutSlice"

export interface InventoryDonutChartResponse {
  metric: string
  dateRange: DateRange
  data: InventoryDonutSlice[]
}
