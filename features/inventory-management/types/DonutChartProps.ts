import type { DonutCenterLabel } from "@/features/inventory-management/types/DonutCenterLabel"
import type { NumericValueFormatter } from "@/features/inventory-management/types/NumericValueFormatter"

export interface DonutChartProps<TData extends object> {
  data: TData[]
  nameKey: keyof TData & string
  valueKey: keyof TData & string
  colorKey?: keyof TData & string
  colors?: string[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  centerLabel?: DonutCenterLabel
  showLegend?: boolean
  valueFormatter?: NumericValueFormatter
}
