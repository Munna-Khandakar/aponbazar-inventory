import { apiClient } from "@/lib/api-client"

import type {
  InventoryBigBlockReportResponse,
  InventoryBigBlockReportRow,
  InventoryCategoryDetailReportResponse,
  InventoryCategoryDetailReportRow,
  InventoryExecuteReportErrorResponse,
  InventoryExecuteReportResponse,
  InventoryItemDetailReportResponse,
  InventoryItemDetailReportRow,
} from "@/features/inventory-management/types/InventoryBlockReports"

type InventoryReportName =
  | "inventory_big_block"
  | "inventory_category_detail"
  | "inventory_item_detail"

type InventoryExecuteReportRequest<TReportName extends InventoryReportName> = {
  reportName: TReportName
  parameters: {
    startDate: string
    endDate: string
  }
  page: number
  size: number
}

const inventoryReportPageSize = 200

const executeInventoryReportPage = async <
  TReportName extends InventoryReportName,
  TRow,
>(
  request: InventoryExecuteReportRequest<TReportName>
): Promise<
  InventoryExecuteReportResponse<TReportName, TRow>
> => {
  const { data } = await apiClient.post<
    InventoryExecuteReportResponse<TReportName, TRow> | InventoryExecuteReportErrorResponse
  >("/api/reports/execute", request)

  if ("error" in data) {
    throw new Error(data.error || `Failed to load ${request.reportName}`)
  }

  return data
}

const executeInventoryReport = async <
  TReportName extends InventoryReportName,
  TRow,
>(
  reportName: TReportName,
  startDate: string,
  endDate: string
): Promise<InventoryExecuteReportResponse<TReportName, TRow>> => {
  const firstPage = await executeInventoryReportPage<TReportName, TRow>({
    reportName,
    parameters: { startDate, endDate },
    page: 0,
    size: inventoryReportPageSize,
  })

  if (firstPage.data.totalPages <= 1) {
    return firstPage
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.data.totalPages - 1 }, (_, index) =>
      executeInventoryReportPage<TReportName, TRow>({
        reportName,
        parameters: { startDate, endDate },
        page: index + 1,
        size: inventoryReportPageSize,
      })
    )
  )

  return {
    ...firstPage,
    data: {
      ...firstPage.data,
      data: [
        ...firstPage.data.data,
        ...remainingPages.flatMap((pageResponse) => pageResponse.data.data),
      ],
    },
  }
}

export const inventoryManagementApi = {
  getInventoryBigBlockReport: async (
    startDate: string,
    endDate: string
  ): Promise<InventoryBigBlockReportResponse> =>
    executeInventoryReport<"inventory_big_block", InventoryBigBlockReportRow>(
      "inventory_big_block",
      startDate,
      endDate
    ),
  getInventoryCategoryDetailReport: async (
    startDate: string,
    endDate: string
  ): Promise<InventoryCategoryDetailReportResponse> =>
    executeInventoryReport<
      "inventory_category_detail",
      InventoryCategoryDetailReportRow
    >("inventory_category_detail", startDate, endDate),
  getInventoryItemDetailReport: async (
    startDate: string,
    endDate: string
  ): Promise<InventoryItemDetailReportResponse> =>
    executeInventoryReport<"inventory_item_detail", InventoryItemDetailReportRow>(
      "inventory_item_detail",
      startDate,
      endDate
    ),
}
