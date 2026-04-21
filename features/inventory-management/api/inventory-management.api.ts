import { apiClient } from "@/lib/api-client"

import type {
  InventoryBigBlockSeriesResponse,
  InventoryBigBlockReportResponse,
  InventoryBigBlockReportRow,
  InventoryCategoryDetailSeriesResponse,
  InventoryCategoryDetailReportResponse,
  InventoryCategoryDetailReportRow,
  InventoryExecuteReportErrorResponse,
  InventoryExecuteReportResponse,
  InventoryItemDetailSeriesResponse,
  InventoryItemDetailReportResponse,
  InventoryItemDetailReportRow,
} from "@/features/inventory-management/types/InventoryBlockReports"
import type { ShopInventorySnapshotReportResponse } from "@/features/inventory-management/types/ShopInventorySnapshotReport"
import { adaptInventoryCategoryDetailReportResponse } from "@/features/inventory-management/utils/adaptInventoryCategoryDetailReport"
import { adaptInventoryBigBlockReportResponse } from "@/features/inventory-management/utils/adaptInventoryBigBlockReport"
import { adaptInventoryItemDetailReportResponse } from "@/features/inventory-management/utils/adaptInventoryItemDetailReport"

type InventoryReportName =
  | "inventory_big_block"
  | "inventory_category_detail"
  | "inventory_item_detail"

type InventoryExecuteReportRequest<TReportName extends InventoryReportName> = {
  reportName: TReportName
  parameters: {
    startDate: string
    endDate: string
    shopName?: string
    bigBlock?: string
    subCategory?: string
  }
  page: number
  size: number
}

const inventoryReportPageSize = 200

const isInventoryBigBlockSeriesResponse = (
  response: InventoryBigBlockReportResponse | InventoryBigBlockSeriesResponse
): response is InventoryBigBlockSeriesResponse => "series" in response.data

const isInventoryCategoryDetailSeriesResponse = (
  response: InventoryCategoryDetailReportResponse | InventoryCategoryDetailSeriesResponse
): response is InventoryCategoryDetailSeriesResponse => "series" in response.data

const isInventoryItemDetailSeriesResponse = (
  response: InventoryItemDetailReportResponse | InventoryItemDetailSeriesResponse
): response is InventoryItemDetailSeriesResponse => "series" in response.data

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

const createInventoryReportParameters = ({
  startDate,
  endDate,
  shopName,
  bigBlock,
  subCategory,
}: {
  startDate: string
  endDate: string
  shopName?: string
  bigBlock?: string
  subCategory?: string
}) => ({
  startDate,
  endDate,
  ...(shopName ? { shopName } : {}),
  ...(bigBlock ? { bigBlock } : {}),
  ...(subCategory ? { subCategory } : {}),
})

export const inventoryManagementApi = {
  getShopInventorySnapshot: async (shopName = ""): Promise<ShopInventorySnapshotReportResponse> => {
    const { data } = await apiClient.post<
      ShopInventorySnapshotReportResponse | InventoryExecuteReportErrorResponse
    >("/api/reports/execute", {
      reportName: "shop_wise_inventory_snapshot",
      parameters: {
        shopName: shopName || null,
      },
    })

    if ("error" in data) {
      throw new Error(data.error || "Failed to load shop_wise_inventory_snapshot")
    }

    return data
  },
  getInventoryBigBlockSeries: async (
    startDate: string,
    endDate: string,
    shopName = ""
  ): Promise<InventoryBigBlockSeriesResponse> => {
    const { data } = await apiClient.post<
      InventoryBigBlockSeriesResponse | InventoryBigBlockReportResponse | InventoryExecuteReportErrorResponse
    >("/api/reports/execute", {
      reportName: "inventory_big_block",
      parameters: createInventoryReportParameters({ startDate, endDate, shopName }),
      page: 0,
      size: inventoryReportPageSize,
    })

    if ("error" in data) {
      throw new Error(data.error || "Failed to load inventory_big_block series")
    }

    if (!isInventoryBigBlockSeriesResponse(data)) {
      throw new Error("Inventory big block series response is not available for predictive chart")
    }

    return data
  },
  getInventoryBigBlockReport: async (
    startDate: string,
    endDate: string,
    shopName = ""
  ): Promise<InventoryBigBlockReportResponse> => {
    const { data } = await apiClient.post<
      InventoryBigBlockReportResponse | InventoryBigBlockSeriesResponse | InventoryExecuteReportErrorResponse
    >("/api/reports/execute", {
      reportName: "inventory_big_block",
      parameters: createInventoryReportParameters({ startDate, endDate, shopName }),
      page: 0,
      size: inventoryReportPageSize,
    })

    if ("error" in data) {
      throw new Error(data.error || "Failed to load inventory_big_block")
    }

    if (isInventoryBigBlockSeriesResponse(data)) {
      return adaptInventoryBigBlockReportResponse(data)
    }

    if (data.data.totalPages <= 1) {
      return data
    }

    const remainingPages = await Promise.all(
      Array.from({ length: data.data.totalPages - 1 }, (_, index) =>
        executeInventoryReportPage<"inventory_big_block", InventoryBigBlockReportRow>({
          reportName: "inventory_big_block",
          parameters: createInventoryReportParameters({ startDate, endDate, shopName }),
          page: index + 1,
          size: inventoryReportPageSize,
        })
      )
    )

    return {
      ...data,
      data: {
        ...data.data,
        data: [
          ...data.data.data,
          ...remainingPages.flatMap((pageResponse) => pageResponse.data.data),
        ],
      },
    }
  },
  getInventoryCategoryDetailReport: async (
    startDate: string,
    endDate: string,
    bigBlock: string,
    shopName = ""
  ): Promise<InventoryCategoryDetailReportResponse> => {
    const { data } = await apiClient.post<
      | InventoryCategoryDetailReportResponse
      | InventoryCategoryDetailSeriesResponse
      | InventoryExecuteReportErrorResponse
    >("/api/reports/execute", {
      reportName: "inventory_category_detail",
      parameters: createInventoryReportParameters({ startDate, endDate, bigBlock, shopName }),
      page: 0,
      size: inventoryReportPageSize,
    })

    if ("error" in data) {
      throw new Error(data.error || "Failed to load inventory_category_detail")
    }

    if (isInventoryCategoryDetailSeriesResponse(data)) {
      return adaptInventoryCategoryDetailReportResponse(data)
    }

    if (data.data.totalPages <= 1) {
      return data
    }

    const remainingPages = await Promise.all(
      Array.from({ length: data.data.totalPages - 1 }, (_, index) =>
        executeInventoryReportPage<"inventory_category_detail", InventoryCategoryDetailReportRow>({
          reportName: "inventory_category_detail",
          parameters: createInventoryReportParameters({ startDate, endDate, bigBlock, shopName }),
          page: index + 1,
          size: inventoryReportPageSize,
        })
      )
    )

    return {
      ...data,
      data: {
        ...data.data,
        data: [
          ...data.data.data,
          ...remainingPages.flatMap((pageResponse) => pageResponse.data.data),
        ],
      },
    }
  },
  getInventoryItemDetailReport: async (
    startDate: string,
    endDate: string,
    subCategory: string,
    shopName = ""
  ): Promise<InventoryItemDetailReportResponse> => {
    const { data } = await apiClient.post<
      | InventoryItemDetailReportResponse
      | InventoryItemDetailSeriesResponse
      | InventoryExecuteReportErrorResponse
    >("/api/reports/execute", {
      reportName: "inventory_item_detail",
      parameters: createInventoryReportParameters({ startDate, endDate, subCategory, shopName }),
      page: 0,
      size: inventoryReportPageSize,
    })

    if ("error" in data) {
      throw new Error(data.error || "Failed to load inventory_item_detail")
    }

    if (isInventoryItemDetailSeriesResponse(data)) {
      return adaptInventoryItemDetailReportResponse(data)
    }

    if (data.data.totalPages <= 1) {
      return data
    }

    const remainingPages = await Promise.all(
      Array.from({ length: data.data.totalPages - 1 }, (_, index) =>
        executeInventoryReportPage<"inventory_item_detail", InventoryItemDetailReportRow>({
          reportName: "inventory_item_detail",
          parameters: createInventoryReportParameters({
            startDate,
            endDate,
            subCategory,
            shopName,
          }),
          page: index + 1,
          size: inventoryReportPageSize,
        })
      )
    )

    return {
      ...data,
      data: {
        ...data.data,
        data: [
          ...data.data.data,
          ...remainingPages.flatMap((pageResponse) => pageResponse.data.data),
        ],
      },
    }
  },
}
