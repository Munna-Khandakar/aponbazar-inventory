"use client"

import { useMemo } from "react"

import { useInventoryBigBlockReport } from "@/features/inventory-management/hooks/useInventoryBigBlockReport"
import { useInventoryCategoryDetailReport } from "@/features/inventory-management/hooks/useInventoryCategoryDetailReport"
import { useInventoryItemDetailReport } from "@/features/inventory-management/hooks/useInventoryItemDetailReport"
import type {
  InventoryBlockTableBigBlockData,
  InventoryBlockTableCategoryData,
  InventoryBlockTableItemData,
} from "@/features/inventory-management/types/InventoryBlockReports"

const normalizeMatchKey = (value: string | null | undefined) => {
  return (value ?? "").trim().toLocaleLowerCase()
}

const createBlockId = (value: string) => normalizeMatchKey(value).replace(/[^a-z0-9]+/g, "-")

export const useInventoryBlockTableData = () => {
  const bigBlocksQuery = useInventoryBigBlockReport()
  const categoriesQuery = useInventoryCategoryDetailReport()
  const itemsQuery = useInventoryItemDetailReport()

  const data = useMemo<InventoryBlockTableBigBlockData[]>(() => {
    const bigBlockRows = bigBlocksQuery.data?.data.data ?? []
    const categoryRows = categoriesQuery.data?.data.data ?? []
    const itemRows = itemsQuery.data?.data.data ?? []

    return bigBlockRows.map((bigBlockRow) => {
      const matchingCategories = categoryRows.filter(
        (categoryRow) =>
          normalizeMatchKey(categoryRow.strBigBlock) ===
          normalizeMatchKey(bigBlockRow.strBigBlock)
      )

      const categories: InventoryBlockTableCategoryData[] = matchingCategories.map(
        (categoryRow) => {
          const matchingItems = itemRows.filter(
            (itemRow) =>
              normalizeMatchKey(itemRow.strBigBlock) ===
                normalizeMatchKey(categoryRow.strBigBlock) &&
              normalizeMatchKey(itemRow.strCategoryName) ===
                normalizeMatchKey(categoryRow.strCategoryName)
          )

          const items: InventoryBlockTableItemData[] = matchingItems.map((itemRow) => ({
            id: String(itemRow.intItemId),
            itemId: itemRow.intItemId,
            bigBlockName: itemRow.strBigBlock,
            categoryName: itemRow.strCategoryName,
            subCategoryName: itemRow.strSubCategoryName,
            itemName: itemRow.strItemName,
            unitOfMeasure: itemRow.strUOM,
            stockInQty: itemRow.numStockInQty,
            stockOutQty: itemRow.numStockOutQty,
            stockInValue: itemRow.numStockInValue,
            currentStock: itemRow.numCurrentStock,
            stockPct: itemRow.numStockPct,
            daysUntilStockout: itemRow.numDaysUntilStockout,
            supplier: itemRow.strSupplier,
          }))

          return {
            id: `${createBlockId(categoryRow.strBigBlock)}:${createBlockId(categoryRow.strCategoryName)}`,
            bigBlockName: categoryRow.strBigBlock,
            categoryName: categoryRow.strCategoryName,
            totalItems: categoryRow.intTotalItems,
            stockInQty: categoryRow.numStockInQty,
            stockOutQty: categoryRow.numStockOutQty,
            stockInValue: categoryRow.numStockInValue,
            currentStock: categoryRow.numCurrentStock,
            stockPct: categoryRow.numStockPct,
            daysUntilStockout: categoryRow.numDaysUntilStockout,
            supplier: categoryRow.strSupplier,
            items,
          }
        }
      )

      return {
        id: createBlockId(bigBlockRow.strBigBlock),
        bigBlockName: bigBlockRow.strBigBlock,
        totalCategories: bigBlockRow.intTotalCategories,
        totalItems: bigBlockRow.intTotalItems,
        stockInQty: bigBlockRow.numStockInQty,
        stockOutQty: bigBlockRow.numStockOutQty,
        stockInValue: bigBlockRow.numStockInValue,
        currentStock: bigBlockRow.numCurrentStock,
        stockPct: bigBlockRow.numStockPct,
        daysUntilStockout: bigBlockRow.numDaysUntilStockout,
        categories,
      }
    })
  }, [bigBlocksQuery.data, categoriesQuery.data, itemsQuery.data])

  return {
    data,
    isLoading:
      bigBlocksQuery.isLoading || categoriesQuery.isLoading || itemsQuery.isLoading,
    isError: bigBlocksQuery.isError || categoriesQuery.isError || itemsQuery.isError,
    error: bigBlocksQuery.error ?? categoriesQuery.error ?? itemsQuery.error ?? null,
  }
}
