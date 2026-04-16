export enum SalesReportType {
  MONTH_WISE_SALES = "month_wise_sales",
  SHOP_WISE_SALES = "shop_wise_sales",
  SHOP_WISE_SALES_AGGREGATE = "shop_wise_sales_aggregate",
  SHOP_WISE_SALES_PERFORMANCE = "shop_wise_sales_performance",
}

export type DateRangeReportParameters = {
  startDate: string
  endDate: string
  shopName?: string
}

export type ReportParameters = DateRangeReportParameters & {
  growthTarget: string
}

export type ExecuteReportRequest<
  TReportName extends SalesReportType = SalesReportType,
  TParameters extends DateRangeReportParameters | ReportParameters =
    | DateRangeReportParameters
    | ReportParameters,
> = {
  reportName: TReportName
  parameters: TParameters
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

export type PredictedSalesForecastSeriesPoint = {
  periodLabel: string
  predictedGrossSales: number
}

type SeriesReportData<TReportName extends SalesReportType> =
  BaseReportData<TReportName> & {
    series: {
      base: SalesForecastSeriesPoint[]
      actual: SalesForecastSeriesPoint[]
      predicted?: PredictedSalesForecastSeriesPoint[]
    }
    granularity: string
  }

export type SalesForecastReportResponse = ReportResponse<
  SeriesReportData<SalesReportType.MONTH_WISE_SALES>
>

export type ShopWiseSalesReportResponse = ReportResponse<
  SeriesReportData<SalesReportType.SHOP_WISE_SALES>
>

export type ShopWiseSalesAggregateReportRow = {
  strShopName: string
  actualSales: number
  baseSales: number
  actualDeliveries: number
  baseDeliveries: number
  salesPerformance?: number
  deliveryPerformance?: number
  predictedGrossSales?: number
}

export type ShopWiseSalesAggregateReportResponse = ReportResponse<
  BaseReportData<SalesReportType.SHOP_WISE_SALES_AGGREGATE> & {
    data: ShopWiseSalesAggregateReportRow[]
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
