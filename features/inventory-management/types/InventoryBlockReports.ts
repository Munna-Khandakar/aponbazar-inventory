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
