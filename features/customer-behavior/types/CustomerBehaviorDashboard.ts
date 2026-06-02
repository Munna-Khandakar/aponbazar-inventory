export type CustomerBehaviorReportEnvelope<TData> = {
  success: boolean
  data: {
    reportName: string
    data: TData[]
    totalRows: number
    executionTimeMs: number
    generatedAt: string
  }
  timestamp: string
}

export type CustomerToplineOverviewReportRow = {
  reportName: string
  generatedAt: string
  totalUniqueCustomers: number
  totalTransactions: number
  totalSales: number
  avgBasketValue: number
}

export type CustomerChurnSummaryReportRow = {
  reportName: string
  generatedAt: string
  alreadyChurned: number
  atRisk: number
}

export type CustomerDemographyReportRow = {
  reportName: string
  generatedAt: string
  ageGroup: string
  male: number
  female: number
  common: number
  na: number
  totalCustomers: number
}

export type CustomerTransactionMethodsReportRow = {
  reportName: string
  generatedAt: string
  cashAmount: number
  cardAmount: number
  mfsAmount: number
  creditAmount: number
  totalAmount: number
  cashPct: number
  cardPct: number
  mfsPct: number
  creditPct: number
}

export type CustomerPurchaseBehaviorReportRow = {
  reportName: string
  generatedAt: string
  customerId: number
  customerName: string
  shopName: string
  purchaseFrequency: number
  avgSpend: number
  totalSpend: number
  firstPurchaseDate: string
  lastPurchaseDate: string
  activeDays: number
}

export type ShopTopProductReportRow = {
  rank: number
  subCategory: string
  category: string
  totalSales: number
  totalQty: number
  totalTransactions: number
}

export type ShopTopCustomerReportRow = {
  rank: number
  customerId: number
  customerName: string
  mobileNo: string
  employeeCode: string
  totalSpend: number
  totalTransactions: number
  avgSpend: number
}

export type ShopTopProductsCustomersReportRow = {
  reportName: string
  generatedAt: string
  shopName: string
  warehouseId: number
  topProducts: ShopTopProductReportRow[]
  topCustomers: ShopTopCustomerReportRow[]
}

export type CustomerOverview = {
  totalUniqueCustomers: number
  averageBasketValue: number
  predictedChurn: number | null
  forecastAccuracy: number | null
}

export type CustomerDemographyRow = {
  ageRange: string
  male: number
  female: number
}

export type PaymentMethod = "Cash" | "Card" | "MFS" | "Credit"

export type PaymentMethodSales = {
  method: PaymentMethod
  amount: number
  percentage: number
  color: string
}

export type RankedProduct = {
  rank: number
  subCategory: string
  salesValue: number
}

export type RankedCustomer = {
  rank: number
  customerName: string
  spentValue: number
}

export type CustomerSnapshotRow = {
  shopName: string
  creditSaleRom: number | null
  topProducts: RankedProduct[]
  topCustomers: RankedCustomer[]
}

export type CustomerPurchaseBehaviorPoint = {
  customerId: number
  customerName: string
  shopName: string
  purchaseFrequency: number
  averageSpend: number
  totalSpend: number
}

export type BehavioralInsightTone = "critical" | "warning" | "opportunity"

export type BehavioralInsight = {
  id: string
  text: string
  tone: BehavioralInsightTone
}
