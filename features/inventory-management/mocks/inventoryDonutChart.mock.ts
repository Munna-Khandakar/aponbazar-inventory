import type { InventoryDonutChartResponse } from "@/features/inventory-management/types/InventoryDonutChartResponse"

export const inventoryDonutChartMock: InventoryDonutChartResponse = {
  metric: "movementByCategory",
  dateRange: {
    from: "2026-01-01",
    to: "2026-06-30",
  },
  data: [
    { id: "fresh-food", label: "Fresh Food", value: 980, color: "#14b8a6" },
    { id: "pantry-staples", label: "Pantry Staples", value: 740, color: "#06b6d4" },
    { id: "household-care", label: "Household Care", value: 520, color: "#f97316" },
    { id: "health-beauty", label: "Health & Beauty", value: 460, color: "#8b5cf6" },
  ],
}
