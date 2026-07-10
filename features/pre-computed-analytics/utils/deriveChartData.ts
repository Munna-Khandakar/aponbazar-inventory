import type {
  BigBlockSalesStat,
  SalesChartPoint,
  SalesMonthlyStat,
  TreemapCategory,
} from "../types/PreComputedDashboard"

/**
 * Collapse the per-shop×month `salesMonthly` rows into one company-wide point per
 * month, then compute MoM / YoY growth from the monthly net-sales series.
 *
 * When a `shopName` filter is active the backend already returns rows for a single
 * shop, so the same aggregation trivially reduces to that shop's series.
 */
export function deriveSalesChartPoints(rows: SalesMonthlyStat[]): SalesChartPoint[] {
  const byMonth = new Map<string, { monthLabel: string; netSales: number }>()

  for (const row of rows) {
    const existing = byMonth.get(row.monthStart)
    if (existing) {
      existing.netSales += row.netSales
    } else {
      byMonth.set(row.monthStart, {
        monthLabel: row.monthLabel,
        netSales: row.netSales,
      })
    }
  }

  const months = Array.from(byMonth.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, value]) => value)

  return months.map((month, index) => {
    const previous = months[index - 1]
    const yearAgo = months[index - 12]

    const momGrowth =
      previous && previous.netSales !== 0
        ? (month.netSales / previous.netSales - 1) * 100
        : null
    const yoyGrowth =
      yearAgo && yearAgo.netSales !== 0
        ? (month.netSales / yearAgo.netSales - 1) * 100
        : null

    return {
      monthLabel: month.monthLabel,
      netSales: month.netSales,
      momGrowth,
      yoyGrowth,
    }
  })
}

/**
 * Aggregate `bigBlockSales` rows by `bigBlock` and compute each block's share of
 * total sales (§4 of the D0 handover). Sorted descending by sales.
 */
export function deriveTreemapCategories(rows: BigBlockSalesStat[]): TreemapCategory[] {
  const byBlock = new Map<string, number>()
  for (const row of rows) {
    byBlock.set(row.bigBlock, (byBlock.get(row.bigBlock) ?? 0) + row.totalSales)
  }

  const total = Array.from(byBlock.values()).reduce((sum, value) => sum + value, 0)

  return Array.from(byBlock.entries())
    .map(([name, totalSales]) => ({
      name,
      totalSales,
      pct: total > 0 ? (totalSales / total) * 100 : 0,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
}
