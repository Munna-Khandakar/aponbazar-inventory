import type { ChartSeriesConfig } from "@/features/inventory-management/types/ChartSeriesConfig"
import type { NumericValueFormatter } from "@/features/inventory-management/types/NumericValueFormatter"

export interface StackedBarChartProps<TData extends object> {
  data: TData[]
  xKey: keyof TData & string
  series: ChartSeriesConfig<keyof TData & string>[]
  lineSeries?: ChartSeriesConfig<keyof TData & string>
  positiveSeriesKeys?: (keyof TData & string)[]
  negativeSeriesKeys?: (keyof TData & string)[]
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  valueFormatter?: NumericValueFormatter
}
