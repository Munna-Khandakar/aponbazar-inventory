export type SalesForecastData = {
  periodLabel: string
  actualSales: number | null
  forecastedSales: number | null
  predictedSalesLine: number | null
}

export type SalesForecastDataset = {
  granularity: string
  points: SalesForecastData[]
}
