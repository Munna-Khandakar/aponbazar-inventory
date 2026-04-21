export const inventoryManagementQueryKeys = {
  all: ["inventory-management"] as const,
  kpiSummary: ["inventory-management", "kpi-summary"] as const,
  movementChart: ["inventory-management", "movement-chart"] as const,
  donutChart: ["inventory-management", "donut-chart"] as const,
  bigBlockSeries: (startDate: string, endDate: string, shopName: string) =>
    ["inventory-management", "inventory-big-block-series", startDate, endDate, shopName] as const,
  bigBlockReport: (startDate: string, endDate: string, shopName: string) =>
    ["inventory-management", "inventory-big-block", startDate, endDate, shopName] as const,
  categoryDetailReport: (startDate: string, endDate: string, bigBlock: string, shopName: string) =>
    ["inventory-management", "inventory-category-detail", startDate, endDate, bigBlock, shopName] as const,
  itemDetailReport: (startDate: string, endDate: string, subCategory: string, shopName: string) =>
    ["inventory-management", "inventory-item-detail", startDate, endDate, subCategory, shopName] as const,
  blockTableData: (startDate: string, endDate: string, shopName: string) =>
    ["inventory-management", "inventory-block-table-data", startDate, endDate, shopName] as const,
  shopInventorySnapshot: (shopName: string) =>
    ["inventory-management", "shop-inventory-snapshot", shopName] as const,
}
