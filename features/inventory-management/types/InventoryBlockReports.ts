export interface InventoryExecuteReportPayload<TReportName extends string, TRow> {
  reportName: TReportName
  data: TRow[]
  totalRows: number
  page: number
  pageSize: number
  totalPages: number
  executionTimeMs: number
  generatedAt: string
}

export interface InventoryExecuteReportResponse<TReportName extends string, TRow> {
  success: boolean
  data: InventoryExecuteReportPayload<TReportName, TRow>
  timestamp: string
}

export interface InventoryExecuteReportErrorResponse {
  success: false
  error: string
  timestamp: string
}

export interface InventoryBigBlockReportRow {
  reportName: "inventory_big_block"
  generatedAt: string
  strBigBlock: string
  totalCategories: number
  totalSubCategories: number
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
}

export interface InventoryBigBlockActualRow {
  reportName: "inventory_big_block"
  generatedAt: string
  date: string
  strBigBlock: string
  totalCategories: number
  totalSubCategories: number
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
}

export interface InventoryBigBlockPredictedRow {
  reportName: "inventory_big_block_prediction"
  generatedAt: string
  date: string
  bigBlock: string
  predictedQty: number
}

export interface InventoryBigBlockSeriesPayload {
  reportName: "inventory_big_block"
  series: {
    actual: InventoryBigBlockActualRow[]
    predicted: InventoryBigBlockPredictedRow[]
  }
  granularity: string
  totalRows: number
  executionTimeMs: number
  generatedAt: string
}

export interface InventoryBigBlockSeriesResponse {
  success: boolean
  data: InventoryBigBlockSeriesPayload
  timestamp: string
}

export interface InventoryCategoryDetailReportRow {
  reportName: "inventory_category_detail"
  generatedAt: string
  strBigBlock: string
  subCategoryName: string
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
}

export interface InventoryCategoryDetailActualRow {
  reportName: "inventory_category_detail"
  generatedAt: string
  date: string
  strBigBlock: string
  subCategoryName: string
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
}

export interface InventoryCategoryDetailPredictedRow {
  reportName: "inventory_category_detail_prediction"
  generatedAt: string
  date: string
  bigBlock: string
  subCategoryName: string
  predictedQty: number
}

export interface InventoryCategoryDetailSeriesPayload {
  reportName: "inventory_category_detail"
  series: {
    actual: InventoryCategoryDetailActualRow[]
    predicted: InventoryCategoryDetailPredictedRow[]
  }
  granularity: string
  totalRows: number
  executionTimeMs: number
  generatedAt: string
}

export interface InventoryCategoryDetailSeriesResponse {
  success: boolean
  data: InventoryCategoryDetailSeriesPayload
  timestamp: string
}

export interface InventoryItemDetailReportRow {
  reportName: "inventory_item_detail"
  generatedAt: string
  itemId: number
  itemName: string
  itemTypeName: string
  categoryName: string
  subCategoryName: string
  appearsInShopCount: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
  currentStockValue: number
}

export interface InventoryItemDetailActualRow {
  reportName: "inventory_item_detail"
  generatedAt: string
  date: string
  itemId: number
  itemName: string
  itemTypeName: string
  categoryName: string
  subCategoryName: string
  appearsInShopCount: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
  currentStockValue: number
}

export interface InventoryItemDetailPredictedRow {
  reportName: "inventory_item_detail_prediction"
  generatedAt: string
  date: string
  itemId: number
  itemName: string
  categoryName: string
  subCategoryName: string
  predictedQty: number
}

export interface InventoryItemDetailSeriesPayload {
  reportName: "inventory_item_detail"
  series: {
    actual: InventoryItemDetailActualRow[]
    predicted: InventoryItemDetailPredictedRow[]
  }
  granularity: string
  totalRows: number
  executionTimeMs: number
  generatedAt: string
}

export interface InventoryItemDetailSeriesResponse {
  success: boolean
  data: InventoryItemDetailSeriesPayload
  timestamp: string
}

export type InventoryBigBlockReportResponse = InventoryExecuteReportResponse<
  "inventory_big_block",
  InventoryBigBlockReportRow
>

export type InventoryCategoryDetailReportResponse = InventoryExecuteReportResponse<
  "inventory_category_detail",
  InventoryCategoryDetailReportRow
>

export type InventoryItemDetailReportResponse = InventoryExecuteReportResponse<
  "inventory_item_detail",
  InventoryItemDetailReportRow
>

export interface InventoryBlockTableItemData {
  id: string
  itemId: number
  bigBlockName: string
  categoryName: string
  subCategoryName: string
  itemName: string
  itemTypeName: string
  appearsInShopCount: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
  currentStockValue: number
}

export interface InventoryBlockTableCategoryData {
  id: string
  bigBlockName: string
  categoryName: string
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
  items: InventoryBlockTableItemData[]
}

export interface InventoryBlockTableBigBlockData {
  id: string
  bigBlockName: string
  totalCategories: number
  totalSubCategories: number
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  stockOutValue: number
  currentStockQty: number
  categories: InventoryBlockTableCategoryData[]
}
