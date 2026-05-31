import type {
  BehavioralInsight,
  CustomerClusterPoint,
  CustomerDemographyRow,
  CustomerOverview,
  CustomerSnapshotRow,
  TransactionMethodVolume,
} from "@/features/customer-behavior/types/CustomerBehaviorDashboard"

export type ShopCustomerBehaviorMock = {
  shopName: string
  overview: CustomerOverview
  demography: CustomerDemographyRow[]
  transactionMethods: TransactionMethodVolume[]
  snapshot: CustomerSnapshotRow
  clusterPoints: CustomerClusterPoint[]
  insights: BehavioralInsight[]
}

const paymentColors = {
  Cash: "#0f766e",
  Card: "#2563eb",
  MFS: "#f59e0b",
  Credit: "#8b5cf6",
} as const

export const customerBehaviorDashboardMock: ShopCustomerBehaviorMock[] = [
  {
    shopName: "Khulshi Mart",
    overview: {
      totalUniqueCustomers: 1284,
      averageBasketValue: 724,
      predictedChurn: 94,
      forecastAccuracy: 92,
    },
    demography: [
      { ageRange: "<19", male: 86, female: 73 },
      { ageRange: "19-25", male: 182, female: 205 },
      { ageRange: "26-34", male: 236, female: 258 },
      { ageRange: "35-45", male: 156, female: 142 },
      { ageRange: "46-59", male: 79, female: 52 },
      { ageRange: ">60", male: 8, female: 7 },
    ],
    transactionMethods: [
      { method: "Cash", transactionCount: 892, color: paymentColors.Cash },
      { method: "Card", transactionCount: 214, color: paymentColors.Card },
      { method: "MFS", transactionCount: 371, color: paymentColors.MFS },
      { method: "Credit", transactionCount: 126, color: paymentColors.Credit },
    ],
    snapshot: {
      shopName: "Khulshi Mart",
      creditSaleRom: 186500,
      topProducts: [
        { subCategory: "Rice & Grains", salesValue: 224300 },
        { subCategory: "Cooking Oil", salesValue: 186700 },
        { subCategory: "Personal Care", salesValue: 142900 },
      ],
      topCustomers: [
        { customerName: "Customer K-1042", spentValue: 18400 },
        { customerName: "Customer K-0871", spentValue: 16950 },
        { customerName: "Customer K-1320", spentValue: 15700 },
      ],
    },
    clusterPoints: [
      { customerId: "K-1042", customerName: "Customer K-1042", purchaseFrequency: 8.4, averageSpend: 2300, cluster: "High Value" },
      { customerId: "K-0871", customerName: "Customer K-0871", purchaseFrequency: 6.8, averageSpend: 1950, cluster: "High Value" },
      { customerId: "K-0221", customerName: "Customer K-0221", purchaseFrequency: 9.2, averageSpend: 780, cluster: "Frequent" },
      { customerId: "K-0638", customerName: "Customer K-0638", purchaseFrequency: 7.6, averageSpend: 920, cluster: "Frequent" },
      { customerId: "K-0118", customerName: "Customer K-0118", purchaseFrequency: 3.1, averageSpend: 680, cluster: "Occasional" },
      { customerId: "K-0549", customerName: "Customer K-0549", purchaseFrequency: 2.4, averageSpend: 510, cluster: "Occasional" },
      { customerId: "K-0440", customerName: "Customer K-0440", purchaseFrequency: 1.2, averageSpend: 440, cluster: "At Risk" },
      { customerId: "K-0917", customerName: "Customer K-0917", purchaseFrequency: 0.8, averageSpend: 620, cluster: "At Risk" },
    ],
    insights: [
      { id: "khulshi-churn", text: "94 customers are approaching the 90-day inactivity threshold in Khulshi Mart.", tone: "critical" },
      { id: "khulshi-credit", text: "Credit sales are forecast to reach BDT 186,500 for the remainder of the month.", tone: "warning" },
      { id: "khulshi-segment", text: "Frequent customers respond well to household essentials bundles.", tone: "opportunity" },
    ],
  },
  {
    shopName: "Liz Fashion Industry Ltd.",
    overview: {
      totalUniqueCustomers: 946,
      averageBasketValue: 618,
      predictedChurn: 71,
      forecastAccuracy: 89,
    },
    demography: [
      { ageRange: "<19", male: 64, female: 78 },
      { ageRange: "19-25", male: 144, female: 186 },
      { ageRange: "26-34", male: 171, female: 149 },
      { ageRange: "35-45", male: 94, female: 81 },
      { ageRange: "46-59", male: 46, female: 27 },
      { ageRange: ">60", male: 4, female: 2 },
    ],
    transactionMethods: [
      { method: "Cash", transactionCount: 631, color: paymentColors.Cash },
      { method: "Card", transactionCount: 173, color: paymentColors.Card },
      { method: "MFS", transactionCount: 284, color: paymentColors.MFS },
      { method: "Credit", transactionCount: 98, color: paymentColors.Credit },
    ],
    snapshot: {
      shopName: "Liz Fashion Industry Ltd.",
      creditSaleRom: 148700,
      topProducts: [
        { subCategory: "Snacks", salesValue: 164200 },
        { subCategory: "Beverages", salesValue: 151800 },
        { subCategory: "Laundry Care", salesValue: 109600 },
      ],
      topCustomers: [
        { customerName: "Customer L-0427", spentValue: 15100 },
        { customerName: "Customer L-0911", spentValue: 14350 },
        { customerName: "Customer L-0735", spentValue: 12800 },
      ],
    },
    clusterPoints: [
      { customerId: "L-0427", customerName: "Customer L-0427", purchaseFrequency: 7.5, averageSpend: 2010, cluster: "High Value" },
      { customerId: "L-0911", customerName: "Customer L-0911", purchaseFrequency: 6.1, averageSpend: 1820, cluster: "High Value" },
      { customerId: "L-0362", customerName: "Customer L-0362", purchaseFrequency: 8.8, averageSpend: 690, cluster: "Frequent" },
      { customerId: "L-0207", customerName: "Customer L-0207", purchaseFrequency: 7.1, averageSpend: 840, cluster: "Frequent" },
      { customerId: "L-0773", customerName: "Customer L-0773", purchaseFrequency: 3.4, averageSpend: 590, cluster: "Occasional" },
      { customerId: "L-0558", customerName: "Customer L-0558", purchaseFrequency: 2.7, averageSpend: 470, cluster: "Occasional" },
      { customerId: "L-0194", customerName: "Customer L-0194", purchaseFrequency: 1.4, averageSpend: 390, cluster: "At Risk" },
      { customerId: "L-0681", customerName: "Customer L-0681", purchaseFrequency: 0.9, averageSpend: 510, cluster: "At Risk" },
    ],
    insights: [
      { id: "liz-churn", text: "71 customers are approaching the 90-day inactivity threshold in Liz Fashion Industry Ltd.", tone: "critical" },
      { id: "liz-credit", text: "Credit sales are forecast to reach BDT 148,700 for the remainder of the month.", tone: "warning" },
      { id: "liz-segment", text: "Promote beverage bundles to frequent customers to raise basket value.", tone: "opportunity" },
    ],
  },
  {
    shopName: "Lida Textile & Dyeing Limited",
    overview: {
      totalUniqueCustomers: 734,
      averageBasketValue: 682,
      predictedChurn: 58,
      forecastAccuracy: 87,
    },
    demography: [
      { ageRange: "<19", male: 43, female: 51 },
      { ageRange: "19-25", male: 111, female: 130 },
      { ageRange: "26-34", male: 146, female: 131 },
      { ageRange: "35-45", male: 76, female: 67 },
      { ageRange: "46-59", male: 41, female: 33 },
      { ageRange: ">60", male: 3, female: 2 },
    ],
    transactionMethods: [
      { method: "Cash", transactionCount: 501, color: paymentColors.Cash },
      { method: "Card", transactionCount: 119, color: paymentColors.Card },
      { method: "MFS", transactionCount: 202, color: paymentColors.MFS },
      { method: "Credit", transactionCount: 84, color: paymentColors.Credit },
    ],
    snapshot: {
      shopName: "Lida Textile & Dyeing Limited",
      creditSaleRom: 124900,
      topProducts: [
        { subCategory: "Rice & Grains", salesValue: 133400 },
        { subCategory: "Baby Care", salesValue: 114800 },
        { subCategory: "Cleaning Supplies", salesValue: 98700 },
      ],
      topCustomers: [
        { customerName: "Customer T-0283", spentValue: 13400 },
        { customerName: "Customer T-0617", spentValue: 12950 },
        { customerName: "Customer T-0494", spentValue: 11600 },
      ],
    },
    clusterPoints: [
      { customerId: "T-0283", customerName: "Customer T-0283", purchaseFrequency: 7.2, averageSpend: 1870, cluster: "High Value" },
      { customerId: "T-0617", customerName: "Customer T-0617", purchaseFrequency: 5.9, averageSpend: 1740, cluster: "High Value" },
      { customerId: "T-0350", customerName: "Customer T-0350", purchaseFrequency: 8.1, averageSpend: 740, cluster: "Frequent" },
      { customerId: "T-0522", customerName: "Customer T-0522", purchaseFrequency: 6.7, averageSpend: 820, cluster: "Frequent" },
      { customerId: "T-0098", customerName: "Customer T-0098", purchaseFrequency: 3.3, averageSpend: 560, cluster: "Occasional" },
      { customerId: "T-0441", customerName: "Customer T-0441", purchaseFrequency: 2.2, averageSpend: 490, cluster: "Occasional" },
      { customerId: "T-0702", customerName: "Customer T-0702", purchaseFrequency: 1.1, averageSpend: 420, cluster: "At Risk" },
      { customerId: "T-0139", customerName: "Customer T-0139", purchaseFrequency: 0.7, averageSpend: 470, cluster: "At Risk" },
    ],
    insights: [
      { id: "lida-churn", text: "58 customers are approaching the 90-day inactivity threshold in Lida Textile & Dyeing Limited.", tone: "critical" },
      { id: "lida-credit", text: "Credit sales are forecast to reach BDT 124,900 for the remainder of the month.", tone: "warning" },
      { id: "lida-segment", text: "Target occasional customers with a return-visit offer this week.", tone: "opportunity" },
    ],
  },
]
