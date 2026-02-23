import type { InventoryMovementChartResponse } from "@/features/inventory-management/types/InventoryMovementChartResponse"

export const inventoryMovementChartMock: InventoryMovementChartResponse = {
  period: "monthly",
  dateRange: {
    from: "2026-01-01",
    to: "2026-06-30",
  },
  data: [
    { label: "Jan 2026", inbound: 520, outbound: -340, netMovement: 180 },
    { label: "Feb 2026", inbound: 430, outbound: -390, netMovement: 40 },
    { label: "Mar 2026", inbound: 610, outbound: -450, netMovement: 160 },
    { label: "Apr 2026", inbound: 390, outbound: -420, netMovement: -30 },
    { label: "May 2026", inbound: 700, outbound: -510, netMovement: 190 },
    { label: "Jun 2026", inbound: 480, outbound: -460, netMovement: 20 },
  ],
}
