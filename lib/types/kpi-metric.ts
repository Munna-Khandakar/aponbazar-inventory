export enum KpiMetricType {
  ACTUAL_SALES = "ACTUAL_SALES",
  PREDICTED_SALES = "PREDICTED_SALES",
  GROWTH_TARGET = "GROWTH_TARGET",
  FORECAST_ACCURACY = "FORECAST_ACCURACY",
}

export type KpiMetricDataset = {
  metricType: KpiMetricType
  progressValue: number
  valueText: number
  summary?: string
}
