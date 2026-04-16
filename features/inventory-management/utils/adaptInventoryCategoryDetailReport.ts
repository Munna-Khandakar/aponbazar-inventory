import type {
  InventoryCategoryDetailActualRow,
  InventoryCategoryDetailReportResponse,
  InventoryCategoryDetailReportRow,
  InventoryCategoryDetailSeriesResponse,
} from "@/features/inventory-management/types/InventoryBlockReports"

const getLatestGeneratedAt = (rows: InventoryCategoryDetailActualRow[]) =>
  rows.reduce(
    (latestGeneratedAt, row) =>
      row.generatedAt > latestGeneratedAt ? row.generatedAt : latestGeneratedAt,
    rows[0]?.generatedAt ?? ""
  )

const createCategorySeriesKey = (row: InventoryCategoryDetailActualRow) =>
  `${row.strBigBlock}::${row.subCategoryName}`

const adaptActualRows = (
  rows: InventoryCategoryDetailActualRow[]
): InventoryCategoryDetailReportRow[] => {
  const rowsByCategory = new Map<string, InventoryCategoryDetailActualRow[]>()

  rows.forEach((row) => {
    const categoryKey = createCategorySeriesKey(row)
    const existingRows = rowsByCategory.get(categoryKey)

    if (existingRows) {
      existingRows.push(row)
      return
    }

    rowsByCategory.set(categoryKey, [row])
  })

  return Array.from(rowsByCategory.values())
    .map((categoryRows) => ({
      reportName: "inventory_category_detail" as const,
      generatedAt: getLatestGeneratedAt(categoryRows),
      strBigBlock: categoryRows[0].strBigBlock,
      subCategoryName: categoryRows[0].subCategoryName,
      totalItems: Math.max(...categoryRows.map((row) => row.totalItems)),
      stockInQty: categoryRows.reduce((sum, row) => sum + row.stockInQty, 0),
      stockOutQty: categoryRows.reduce((sum, row) => sum + row.stockOutQty, 0),
      stockInValue: categoryRows.reduce((sum, row) => sum + row.stockInValue, 0),
      stockOutValue: categoryRows.reduce((sum, row) => sum + row.stockOutValue, 0),
      currentStockQty: categoryRows.reduce((sum, row) => sum + row.currentStockQty, 0),
    }))
    .sort((left, right) => left.subCategoryName.localeCompare(right.subCategoryName))
}

export const adaptInventoryCategoryDetailReportResponse = (
  response: InventoryCategoryDetailSeriesResponse
): InventoryCategoryDetailReportResponse => {
  const adaptedRows = adaptActualRows(response.data.series.actual)

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
