export interface ChartSeriesConfig<TDataKey extends string = string> {
  key: TDataKey
  label: string
  color: string
  stackId?: string
}
