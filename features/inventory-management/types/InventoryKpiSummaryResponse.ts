import type { DateRange } from "@/features/inventory-management/types/DateRange"
import type { InventoryKpiSummaryData } from "@/features/inventory-management/types/InventoryKpiSummaryData"

export interface InventoryKpiSummaryResponse {
  metric: string
  dateRange: DateRange
  data: InventoryKpiSummaryData
}
