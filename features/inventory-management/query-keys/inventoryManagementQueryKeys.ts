export const inventoryManagementQueryKeys = {
  all: ["inventory-management"] as const,
  kpiSummary: ["inventory-management", "kpi-summary"] as const,
  movementChart: ["inventory-management", "movement-chart"] as const,
  donutChart: ["inventory-management", "donut-chart"] as const,
  bigBlockReport: (startDate: string, endDate: string) =>
    ["inventory-management", "inventory-big-block", startDate, endDate] as const,
  categoryDetailReport: (startDate: string, endDate: string) =>
    ["inventory-management", "inventory-category-detail", startDate, endDate] as const,
  itemDetailReport: (startDate: string, endDate: string) =>
    ["inventory-management", "inventory-item-detail", startDate, endDate] as const,
  blockTableData: (startDate: string, endDate: string) =>
    ["inventory-management", "inventory-block-table-data", startDate, endDate] as const,
}
