export enum SalesReportType {
  MONTH_WISE_SALES = "month_wise_sales",
  SHOP_WISE_SALES = "shop_wise_sales",
  SHOP_WISE_SALES_AGGREGATE = "shop_wise_sales_aggregate",
  SHOP_WISE_SALES_PERFORMANCE = "shop_wise_sales_performance",
}

export type SalesForecastData = {
  periodLabel: string
  actualSales: number
  forecastedSales: number
}

export type SalesForecastSeriesPoint = {
  periodLabel: string
  numTotalNetSales: number
}

export type SalesForecastApiResponse = {
  success: boolean
  data: {
    reportName: SalesReportType
    series: {
      base: SalesForecastSeriesPoint[]
      actual: SalesForecastSeriesPoint[]
    }
    granularity: string
    totalRows: number
    page: number
    pageSize: number
    totalPages: number
    executionTimeMs: number
    generatedAt: string
  }
  timestamp: string
}
