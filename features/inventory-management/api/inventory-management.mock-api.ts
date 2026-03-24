import { inventoryBigBlockReportMock } from "@/features/inventory-management/mocks/inventoryBigBlockReport.mock"
import { inventoryCategoryDetailReportMock } from "@/features/inventory-management/mocks/inventoryCategoryDetailReport.mock"
import { inventoryDonutChartMock } from "@/features/inventory-management/mocks/inventoryDonutChart.mock"
import { inventoryItemDetailReportMock } from "@/features/inventory-management/mocks/inventoryItemDetailReport.mock"
import { inventoryKpiSummaryMock } from "@/features/inventory-management/mocks/inventoryKpiSummary.mock"
import { inventoryMovementChartMock } from "@/features/inventory-management/mocks/inventoryMovementChart.mock"
import type {
  InventoryBigBlockReportResponse,
  InventoryCategoryDetailReportResponse,
  InventoryItemDetailReportResponse,
} from "@/features/inventory-management/types/InventoryBlockReports"
import type { InventoryDonutChartResponse } from "@/features/inventory-management/types/InventoryDonutChartResponse"
import type { InventoryKpiSummaryResponse } from "@/features/inventory-management/types/InventoryKpiSummaryResponse"
import type { InventoryMovementChartResponse } from "@/features/inventory-management/types/InventoryMovementChartResponse"
import { simulateApiRequest } from "@/features/inventory-management/utils/simulateApiRequest"

const MOCK_ERROR_RATE = Number(process.env.NEXT_PUBLIC_INVENTORY_MOCK_ERROR_RATE ?? 0)

export const inventoryManagementMockApi = {
  getInventoryKpiSummary: async (): Promise<InventoryKpiSummaryResponse> => {
    return simulateApiRequest(inventoryKpiSummaryMock, {
      errorRate: MOCK_ERROR_RATE,
      errorMessage: "Failed to load KPI summary",
    })
  },
  getInventoryMovementChart: async (): Promise<InventoryMovementChartResponse> => {
    return simulateApiRequest(inventoryMovementChartMock, {
      errorRate: MOCK_ERROR_RATE,
      errorMessage: "Failed to load movement chart",
    })
  },
  getInventoryDonutChart: async (): Promise<InventoryDonutChartResponse> => {
    return simulateApiRequest(inventoryDonutChartMock, {
      errorRate: MOCK_ERROR_RATE,
      errorMessage: "Failed to load donut chart",
    })
  },
  getInventoryBigBlockReport: async (): Promise<InventoryBigBlockReportResponse> => {
    return simulateApiRequest(inventoryBigBlockReportMock, {
      errorRate: MOCK_ERROR_RATE,
      errorMessage: "Failed to load inventory big block report",
      minDelayMs: 200,
      maxDelayMs: 500,
    })
  },
  getInventoryCategoryDetailReport: async (): Promise<InventoryCategoryDetailReportResponse> => {
    return simulateApiRequest(inventoryCategoryDetailReportMock, {
      errorRate: MOCK_ERROR_RATE,
      errorMessage: "Failed to load inventory category detail report",
      minDelayMs: 200,
      maxDelayMs: 500,
    })
  },
  getInventoryItemDetailReport: async (): Promise<InventoryItemDetailReportResponse> => {
    return simulateApiRequest(inventoryItemDetailReportMock, {
      errorRate: MOCK_ERROR_RATE,
      errorMessage: "Failed to load inventory item detail report",
      minDelayMs: 200,
      maxDelayMs: 500,
    })
  },
}
