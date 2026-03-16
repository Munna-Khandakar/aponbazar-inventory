export enum SalesReportType {
  MONTH_WISE_SALES = "month_wise_sales",
  SHOP_WISE_SALES = "shop_wise_sales",
  SHOP_WISE_SALES_AGGREGATE = "shop_wise_sales_aggregate",
  SHOP_WISE_SALES_PERFORMANCE = "shop_wise_sales_performance",
}

export type ReportParameters = {
  startDate: string
  endDate: string
  growthTarget: string
}

export type ExecuteReportRequest<TReportName extends SalesReportType = SalesReportType> = {
  reportName: TReportName
  parameters: ReportParameters
  page: number
  size: number
}

type BaseReportData<TReportName extends SalesReportType> = {
  reportName: TReportName
  totalRows: number
  page: number
  pageSize: number
  totalPages: number
  executionTimeMs: number
  generatedAt: string
}

export type ReportResponse<TData> = {
  success: boolean
  data: TData
  timestamp: string
}

export type SalesForecastSeriesPoint = {
  periodLabel: string
  numTotalNetSales: number
}

export type SalesForecastReportResponse = ReportResponse<
  BaseReportData<SalesReportType.MONTH_WISE_SALES> & {
    series: {
      base: SalesForecastSeriesPoint[]
      actual: SalesForecastSeriesPoint[]
    }
    granularity: string
  }
>

export type ShopPerformanceReportRow = {
  strShopName: string
  actualSales: number
  baseSales: number
  actualDeliveries: number
  baseDeliveries: number
  salesPerformance?: number
  deliveryPerformance?: number
}

export type ShopPerformanceReportResponse = ReportResponse<
  BaseReportData<SalesReportType.SHOP_WISE_SALES_PERFORMANCE> & {
    data: ShopPerformanceReportRow[]
  }
>
