# Inventory Management Page Implementation Plan

## Implementation Plan
1. Create a feature module for inventory management and keep `app/dashboard/inventory-management/page.tsx` as a thin container entry.
2. Keep `DashboardFilters` unchanged and reuse it exactly as-is.
3. Replace current page body so it renders only:
   1. Filter card
   2. KPI summary row
   3. Stacked bar chart row
   4. Donut chart row
4. Add mock API layer with realistic async behavior (2–3s delay, optional error simulation).
5. Add 3 React Query hooks:
   1. `useInventoryKpiSummary`
   2. `useInventoryMovementChart`
   3. `useInventoryDonutChart`
6. Build reusable chart primitives (`StackedBarChart`, `DonutChart`) driven entirely by props.
7. Build inventory-specific section components that map hook data into generic chart/KPI components.
8. Verify loading, error, and success states for each section independently.
9. Run `npm run lint` and `npm run build`.

## Proposed Folder Structure
- `app/dashboard/inventory-management/page.tsx`
- `features/inventory-management/components/InventoryManagementPageContainer.tsx`
- `features/inventory-management/components/InventoryKpiSummaryRow.tsx`
- `features/inventory-management/components/InventoryKpiCard.tsx`
- `features/inventory-management/components/InventoryMovementChartSection.tsx`
- `features/inventory-management/components/InventoryDonutChartSection.tsx`
- `features/inventory-management/charts/StackedBarChart.tsx`
- `features/inventory-management/charts/DonutChart.tsx`
- `features/inventory-management/hooks/useInventoryKpiSummary.ts`
- `features/inventory-management/hooks/useInventoryMovementChart.ts`
- `features/inventory-management/hooks/useInventoryDonutChart.ts`
- `features/inventory-management/api/inventory-management.mock-api.ts`
- `features/inventory-management/mocks/inventoryKpiSummary.mock.ts`
- `features/inventory-management/mocks/inventoryMovementChart.mock.ts`
- `features/inventory-management/mocks/inventoryDonutChart.mock.ts`
- `features/inventory-management/query-keys/inventoryManagementQueryKeys.ts`
- `features/inventory-management/utils/simulateApiRequest.ts`
- `features/inventory-management/utils/formatCurrency.ts`
- `features/inventory-management/utils/formatNumber.ts`
- `features/inventory-management/types/*.ts` (one type/interface per file, listed below)

## Type Files (One Type Per File)
- `features/inventory-management/types/DateRange.ts`
- `features/inventory-management/types/InventoryKpiSummaryData.ts`
- `features/inventory-management/types/InventoryKpiSummaryResponse.ts`
- `features/inventory-management/types/InventoryMovementPoint.ts`
- `features/inventory-management/types/InventoryMovementChartResponse.ts`
- `features/inventory-management/types/InventoryDonutSlice.ts`
- `features/inventory-management/types/InventoryDonutChartResponse.ts`
- `features/inventory-management/types/KpiCardItem.ts`
- `features/inventory-management/types/ChartSeriesConfig.ts`
- `features/inventory-management/types/StackedBarChartProps.ts`
- `features/inventory-management/types/DonutChartProps.ts`
- `features/inventory-management/types/MockApiError.ts`
- `features/inventory-management/types/SimulateApiRequestOptions.ts`

## Reusable Chart Design
- `StackedBarChart`:
  - Props: `data`, `xKey`, `series`, `stackId`, `height?`, `valueFormatter?`, `showLegend?`, `showGrid?`
  - `series` supports configurable keys like `inbound`, `outbound`, future keys without code change.
  - Uses existing `components/ui/chart.tsx` primitives for consistent tooltip/legend theme.
- `DonutChart`:
  - Props: `data`, `nameKey`, `valueKey`, `colorKey?`, `colors?`, `innerRadius?`, `outerRadius?`, `centerLabel?`, `showLegend?`
  - Generic enough for unknown future donut payloads.

## React Query Mock Implementation
- `simulateApiRequest.ts`:
  - Wait random `2000–3000ms`
  - Return deep-cloned mock payload
  - Optionally throw simulated error (configurable error rate or forced error flag)
- `inventory-management.mock-api.ts`:
  - `getInventoryKpiSummary()`
  - `getInventoryMovementChart()`
  - `getInventoryDonutChart()`
  - Each calls `simulateApiRequest(...)`
- Hooks:
  - `useQuery({ queryKey, queryFn, staleTime, retry })`
  - Explicit loading/error/success handling in section components
  - Query keys centralized in `inventoryManagementQueryKeys.ts`

## Chart Library Recommendation
- Keep `Recharts` (already installed and integrated with your `components/ui/chart.tsx` design system).
- No replacement needed for this scope.
- Only consider ECharts later if you need very high-density data or advanced interactions.

## Scalability Notes
- Strict SRP: page shell, hooks, mock API, chart primitives, and UI sections stay isolated.
- Future backend swap: replace only `inventory-management.mock-api.ts`; hooks/components remain unchanged.
- Donut payload is flexible by design, so final API shape can be mapped with minimal changes.
