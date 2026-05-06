import type {
  InventoryBigBlockActualRow,
  InventoryBigBlockReportResponse,
  InventoryBigBlockReportRow,
  InventoryBigBlockSeriesResponse,
} from "@/features/inventory-management/types/InventoryBlockReports"

const getLatestGeneratedAt = (rows: InventoryBigBlockActualRow[]) =>
  rows.reduce(
    (latestGeneratedAt, row) =>
      row.generatedAt > latestGeneratedAt ? row.generatedAt : latestGeneratedAt,
    rows[0]?.generatedAt ?? ""
  )

const adaptActualRows = (rows: InventoryBigBlockActualRow[]): InventoryBigBlockReportRow[] => {
  const rowsByBlockName = new Map<string, InventoryBigBlockActualRow[]>()

  rows.forEach((row) => {
    const existingRows = rowsByBlockName.get(row.strBigBlock)

    if (existingRows) {
      existingRows.push(row)
      return
    }

    rowsByBlockName.set(row.strBigBlock, [row])
  })

  return Array.from(rowsByBlockName.entries())
    .map(([strBigBlock, blockRows]) => ({
      reportName: "inventory_big_block" as const,
      generatedAt: getLatestGeneratedAt(blockRows),
      strBigBlock,
      totalCategories: Math.max(...blockRows.map((row) => row.totalCategories)),
      totalSubCategories: Math.max(...blockRows.map((row) => row.totalSubCategories)),
      totalItems: Math.max(...blockRows.map((row) => row.totalItems)),
      stockInQty: blockRows.reduce((sum, row) => sum + row.stockInQty, 0),
      stockOutQty: blockRows.reduce((sum, row) => sum + row.stockOutQty, 0),
      stockInValue: blockRows.reduce((sum, row) => sum + row.stockInValue, 0),
      stockOutValue: blockRows.reduce((sum, row) => sum + row.stockOutValue, 0),
      currentStockQty: blockRows.reduce((sum, row) => sum + row.currentStockQty, 0),
    }))
    .sort((left, right) => left.strBigBlock.localeCompare(right.strBigBlock))
}

export const adaptInventoryBigBlockReportResponse = (
  response: InventoryBigBlockSeriesResponse
): InventoryBigBlockReportResponse => {
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
