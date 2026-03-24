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

export interface InventoryBigBlockReportRow {
  strBigBlock: string
  intTotalCategories: number
  intTotalItems: number
  numStockInQty: number
  numStockOutQty: number
  numStockInValue: number
  numCurrentStock: number
  numStockPct: number
  numDaysUntilStockout: number | null
}

export interface InventoryCategoryDetailReportRow {
  strBigBlock: string
  strCategoryName: string
  intTotalItems: number
  numStockInQty: number
  numStockOutQty: number
  numStockInValue: number
  numCurrentStock: number
  numStockPct: number
  numDaysUntilStockout: number | null
  strSupplier: string | null
}

export interface InventoryItemDetailReportRow {
  strBigBlock: string
  strCategoryName: string
  strSubCategoryName: string
  intItemId: number
  strItemName: string
  strUOM: string
  numStockInQty: number
  numStockOutQty: number
  numStockInValue: number
  numCurrentStock: number
  numStockPct: number
  numDaysUntilStockout: number | null
  strSupplier: string | null
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
  unitOfMeasure: string
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  currentStock: number
  stockPct: number
  daysUntilStockout: number | null
  supplier: string | null
}

export interface InventoryBlockTableCategoryData {
  id: string
  bigBlockName: string
  categoryName: string
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  currentStock: number
  stockPct: number
  daysUntilStockout: number | null
  supplier: string | null
  items: InventoryBlockTableItemData[]
}

export interface InventoryBlockTableBigBlockData {
  id: string
  bigBlockName: string
  totalCategories: number
  totalItems: number
  stockInQty: number
  stockOutQty: number
  stockInValue: number
  currentStock: number
  stockPct: number
  daysUntilStockout: number | null
  categories: InventoryBlockTableCategoryData[]
}
