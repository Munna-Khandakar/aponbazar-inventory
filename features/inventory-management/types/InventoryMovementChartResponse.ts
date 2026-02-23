import type { DateRange } from "@/features/inventory-management/types/DateRange"
import type { InventoryMovementPoint } from "@/features/inventory-management/types/InventoryMovementPoint"

export interface InventoryMovementChartResponse {
  period: string
  dateRange: DateRange
  data: InventoryMovementPoint[]
}
