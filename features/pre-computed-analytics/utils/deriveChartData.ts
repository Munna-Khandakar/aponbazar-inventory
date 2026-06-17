import type {
  ActionInsight,
  BigBlockSalesStat,
  BigBlockTreemapNode,
  PreComputedDashboardData,
  SalesChartPoint,
  SalesMonthlyStat,
} from "../types/PreComputedDashboard"

export function deriveSalesChartPoints(rows: SalesMonthlyStat[]): SalesChartPoint[] {
  return [...rows]
    .sort((a, b) => a.monthStart.localeCompare(b.monthStart))
    .map((row) => {
      const [year, month] = row.monthStart.split("-").map(Number)
      const date = new Date(year, month - 1, 1)
      const monthLabel = date.toLocaleString("en-BD", { month: "short", year: "numeric" })
      return {
        monthLabel,
        netSales: row.netSales,
        predictedSales: row.predictedSales,
        predictedMargin: row.predictedMargin,
      }
    })
}

export function deriveTreemapNodes(rows: BigBlockSalesStat[]): BigBlockTreemapNode[] {
  const grouped: Record<string, { name: string; size: number }[]> = {}
  for (const row of rows) {
    if (!grouped[row.bigBlock]) grouped[row.bigBlock] = []
    grouped[row.bigBlock].push({ name: row.subCategory, size: row.totalSales })
  }
  return Object.entries(grouped).map(([bigBlock, children]) => ({
    name: bigBlock,
    children,
  }))
}

export function deriveActionInsights(data: PreComputedDashboardData | undefined): ActionInsight[] {
  if (!data) return []
  const insights: ActionInsight[] = []

  // Stockout risk check
  for (const [product, outlets] of Object.entries(data.focusProductStock)) {
    const atRisk = outlets.filter((o) => o.inventoryHealth === "Stockout Risk")
    if (atRisk.length > 0) {
      insights.push({
        id: `stockout-${product}`,
        text: `${product} is at stockout risk in ${atRisk.length} outlet${atRisk.length > 1 ? "s" : ""}: ${atRisk.map((o) => o.shopName).join(", ")}.`,
        tone: "critical",
      })
    }
  }

  // Predicted vs actual sales
  const sorted = [...data.salesMonthly].sort((a, b) =>
    b.monthStart.localeCompare(a.monthStart)
  )
  const latest = sorted[0]
  const previous = sorted[1]
  if (latest?.predictedSales != null && previous?.netSales != null) {
    const delta = ((latest.predictedSales - previous.netSales) / previous.netSales) * 100
    if (delta >= 5) {
      insights.push({
        id: "sales-growth",
        text: `Predicted sales for the current month are ${delta.toFixed(1)}% above last month's actuals.`,
        tone: "opportunity",
      })
    } else if (delta <= -5) {
      insights.push({
        id: "sales-decline",
        text: `Predicted sales for the current month are ${Math.abs(delta).toFixed(1)}% below last month's actuals.`,
        tone: "warning",
      })
    }
  }

  // Cluster count
  const clusterCount = new Set(data.customerCluster.map((c) => c.clusterLabel)).size
  if (clusterCount > 0) {
    insights.push({
      id: "cluster-count",
      text: `${clusterCount} distinct customer segment${clusterCount > 1 ? "s" : ""} identified. Review clusters to tailor promotions per segment.`,
      tone: "opportunity",
    })
  }

  return insights
}
