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

const normalizeMatchKey = (value: string | null | undefined) =>
  (value ?? "").trim().toLocaleLowerCase()

const createBlockId = (value: string) => normalizeMatchKey(value).replace(/[^a-z0-9]+/g, "-")

export const useInventoryBlockTableData = () => {
  const bigBlocksQuery = useInventoryBigBlockReport()
  const categoriesQuery = useInventoryCategoryDetailReport()
  const itemsQuery = useInventoryItemDetailReport()

  const data = useMemo<InventoryBlockTableBigBlockData[]>(() => {
    const bigBlockRows = bigBlocksQuery.data?.data.data ?? []
    const categoryRows = categoriesQuery.data?.data.data ?? []
    const itemRows = itemsQuery.data?.data.data ?? []

    const categoriesByBigBlock = new Map<string, typeof categoryRows>()
    for (const categoryRow of categoryRows) {
      const key = normalizeMatchKey(categoryRow.strBigBlock)
      const existingRows = categoriesByBigBlock.get(key)
      if (existingRows) {
        existingRows.push(categoryRow)
      } else {
        categoriesByBigBlock.set(key, [categoryRow])
      }
    }

    const itemsBySubCategory = new Map<string, typeof itemRows>()
    for (const itemRow of itemRows) {
      const key = normalizeMatchKey(itemRow.subCategoryName)
      const existingRows = itemsBySubCategory.get(key)
      if (existingRows) {
        existingRows.push(itemRow)
      } else {
        itemsBySubCategory.set(key, [itemRow])
      }
    }

    return bigBlockRows.map((bigBlockRow) => {
      const categories: InventoryBlockTableCategoryData[] =
        categoriesByBigBlock
          .get(normalizeMatchKey(bigBlockRow.strBigBlock))
          ?.map((categoryRow) => {
            const items: InventoryBlockTableItemData[] =
              itemsBySubCategory
                .get(normalizeMatchKey(categoryRow.subCategoryName))
                ?.map((itemRow) => ({
                  id: `${itemRow.itemId}:${createBlockId(itemRow.subCategoryName)}`,
                  itemId: itemRow.itemId,
                  bigBlockName: categoryRow.strBigBlock,
                  categoryName: itemRow.categoryName,
                  subCategoryName: itemRow.subCategoryName,
                  itemName: itemRow.itemName,
                  itemTypeName: itemRow.itemTypeName,
                  appearsInShopCount: itemRow.appearsInShopCount,
                  stockInQty: itemRow.stockInQty,
                  stockOutQty: itemRow.stockOutQty,
                  stockInValue: itemRow.stockInValue,
                  stockOutValue: itemRow.stockOutValue,
                  currentStockQty: itemRow.currentStockQty,
                  currentStockValue: itemRow.currentStockValue,
                })) ?? []

            return {
              id: `${createBlockId(categoryRow.strBigBlock)}:${createBlockId(categoryRow.subCategoryName)}`,
              bigBlockName: categoryRow.strBigBlock,
              categoryName: categoryRow.subCategoryName,
              totalItems: categoryRow.totalItems,
              stockInQty: categoryRow.stockInQty,
              stockOutQty: categoryRow.stockOutQty,
              stockInValue: categoryRow.stockInValue,
              stockOutValue: categoryRow.stockOutValue,
              currentStockQty: categoryRow.currentStockQty,
              items,
            }
          }) ?? []

      return {
        id: createBlockId(bigBlockRow.strBigBlock),
        bigBlockName: bigBlockRow.strBigBlock,
        totalCategories: bigBlockRow.totalCategories,
        totalSubCategories: bigBlockRow.totalSubCategories,
        totalItems: bigBlockRow.totalItems,
        stockInQty: bigBlockRow.stockInQty,
        stockOutQty: bigBlockRow.stockOutQty,
        stockInValue: bigBlockRow.stockInValue,
        stockOutValue: bigBlockRow.stockOutValue,
        currentStockQty: bigBlockRow.currentStockQty,
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
