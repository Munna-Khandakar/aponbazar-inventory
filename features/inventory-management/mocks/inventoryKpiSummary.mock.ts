import type { InventoryKpiSummaryResponse } from "@/features/inventory-management/types/InventoryKpiSummaryResponse"

export const inventoryKpiSummaryMock: InventoryKpiSummaryResponse = {
  metric: "kpiSummary",
  dateRange: { from: "2026-01-01", to: "2026-06-30" },
  data: {
    totalQtyMoved: 310.0,
    totalTransactionValue: 33900.0,
    totalVAT: 5085.0,
    totalTransactions: 56,
    avgTransactionValue: 605.36,
  },
}
