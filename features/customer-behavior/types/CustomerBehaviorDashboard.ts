export type CustomerBehaviorFilters = {
  startDate: string
  endDate: string
  shopName?: string
}

export type CustomerOverview = {
  totalUniqueCustomers: number
  averageBasketValue: number
  predictedChurn: number
  forecastAccuracy: number
}

export type CustomerDemographyRow = {
  ageRange: string
  male: number
  female: number
}

export type TransactionMethod = "Cash" | "Card" | "MFS" | "Credit"

export type TransactionMethodVolume = {
  method: TransactionMethod
  transactionCount: number
  color: string
}

export type RankedProduct = {
  subCategory: string
  salesValue: number
}

export type RankedCustomer = {
  customerName: string
  spentValue: number
}

export type CustomerSnapshotRow = {
  shopName: string
  creditSaleRom: number
  topProducts: RankedProduct[]
  topCustomers: RankedCustomer[]
}

export type CustomerCluster =
  | "High Value"
  | "Frequent"
  | "Occasional"
  | "At Risk"

export type CustomerClusterPoint = {
  customerId: string
  customerName: string
  purchaseFrequency: number
  averageSpend: number
  cluster: CustomerCluster
}

export type BehavioralInsightTone = "critical" | "warning" | "opportunity"

export type BehavioralInsight = {
  id: string
  text: string
  tone: BehavioralInsightTone
}

export type CustomerBehaviorDashboardResponse = {
  filters: CustomerBehaviorFilters
  overview: CustomerOverview
  demography: CustomerDemographyRow[]
  transactionMethods: TransactionMethodVolume[]
  snapshotRows: CustomerSnapshotRow[]
  clusterPoints: CustomerClusterPoint[]
  insights: BehavioralInsight[]
}
