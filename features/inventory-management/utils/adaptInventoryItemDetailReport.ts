import type {
  InventoryItemDetailActualRow,
  InventoryItemDetailReportResponse,
  InventoryItemDetailReportRow,
  InventoryItemDetailSeriesResponse,
} from "@/features/inventory-management/types/InventoryBlockReports"

const getLatestGeneratedAt = (rows: InventoryItemDetailActualRow[]) =>
  rows.reduce(
    (latestGeneratedAt, row) =>
      row.generatedAt > latestGeneratedAt ? row.generatedAt : latestGeneratedAt,
    rows[0]?.generatedAt ?? ""
  )

const createItemSeriesKey = (row: InventoryItemDetailActualRow) => `${row.itemId}`

const adaptActualRows = (rows: InventoryItemDetailActualRow[]): InventoryItemDetailReportRow[] => {
  const rowsByItemId = new Map<string, InventoryItemDetailActualRow[]>()

  rows.forEach((row) => {
    const itemKey = createItemSeriesKey(row)
    const existingRows = rowsByItemId.get(itemKey)

    if (existingRows) {
      existingRows.push(row)
      return
    }

    rowsByItemId.set(itemKey, [row])
  })

  return Array.from(rowsByItemId.values())
    .map((itemRows) => ({
      reportName: "inventory_item_detail" as const,
      generatedAt: getLatestGeneratedAt(itemRows),
      itemId: itemRows[0].itemId,
      itemName: itemRows[0].itemName,
      itemTypeName: itemRows[0].itemTypeName,
      categoryName: itemRows[0].categoryName,
      subCategoryName: itemRows[0].subCategoryName,
      appearsInShopCount: Math.max(...itemRows.map((row) => row.appearsInShopCount)),
      stockInQty: itemRows.reduce((sum, row) => sum + row.stockInQty, 0),
      stockOutQty: itemRows.reduce((sum, row) => sum + row.stockOutQty, 0),
      stockInValue: itemRows.reduce((sum, row) => sum + row.stockInValue, 0),
      stockOutValue: itemRows.reduce((sum, row) => sum + row.stockOutValue, 0),
      currentStockQty: itemRows.reduce((sum, row) => sum + row.currentStockQty, 0),
      currentStockValue: itemRows.reduce((sum, row) => sum + row.currentStockValue, 0),
    }))
    .sort((left, right) => left.itemName.localeCompare(right.itemName))
}

export const adaptInventoryItemDetailReportResponse = (
  response: InventoryItemDetailSeriesResponse
): InventoryItemDetailReportResponse => {
  const adaptedRows = adaptActualRows(response.data.series?.actual ?? [])

  return {
    success: response.success,
    data: {
      reportName: response.data.reportName,
      data: adaptedRows,
      totalRows: adaptedRows.length,
      page: 0,
      pageSize: adaptedRows.length,
      totalPages: adaptedRows.length > 0 ? 1 : 0,
      executionTimeMs: response.data.executionTimeMs,
      generatedAt: response.data.generatedAt,
    },
    timestamp: response.timestamp,
  }
}
