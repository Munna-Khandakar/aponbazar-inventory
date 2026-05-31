import { customerBehaviorDashboardMock, type ShopCustomerBehaviorMock } from "@/features/customer-behavior/mocks/customerBehaviorDashboard.mock"
import type {
  BehavioralInsight,
  CustomerBehaviorDashboardResponse,
  CustomerBehaviorFilters,
  CustomerClusterPoint,
  CustomerDemographyRow,
  CustomerOverview,
  CustomerSnapshotRow,
  TransactionMethodVolume,
} from "@/features/customer-behavior/types/CustomerBehaviorDashboard"

const DEFAULT_DELAY_MS = 250
const ageRanges = ["<19", "19-25", "26-34", "35-45", "46-59", ">60"]
const transactionMethods = ["Cash", "Card", "MFS", "Credit"] as const

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

const sleep = async (durationMs: number) => {
  if (durationMs <= 0) {
    return
  }

  await new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs)
  })
}

const getDateWindowScale = ({ startDate, endDate }: CustomerBehaviorFilters) => {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return 1
  }

  const dayCount = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1
  return Math.max(0.1, dayCount / 30)
}

const scaleCount = (value: number, scale: number) => Math.max(0, Math.round(value * scale))

const scaleShopData = (shop: ShopCustomerBehaviorMock, scale: number): ShopCustomerBehaviorMock => ({
  ...shop,
  overview: {
    ...shop.overview,
    totalUniqueCustomers: scaleCount(shop.overview.totalUniqueCustomers, scale),
    predictedChurn: scaleCount(shop.overview.predictedChurn, scale),
  },
  demography: shop.demography.map((row) => ({
    ...row,
    male: scaleCount(row.male, scale),
    female: scaleCount(row.female, scale),
  })),
  transactionMethods: shop.transactionMethods.map((method) => ({
    ...method,
    transactionCount: scaleCount(method.transactionCount, scale),
  })),
  snapshot: {
    ...shop.snapshot,
    creditSaleRom: scaleCount(shop.snapshot.creditSaleRom, scale),
  },
})

const sumDemography = (shops: ShopCustomerBehaviorMock[]): CustomerDemographyRow[] =>
  ageRanges.map((ageRange) => ({
    ageRange,
    male: shops.reduce(
      (total, shop) => total + (shop.demography.find((row) => row.ageRange === ageRange)?.male ?? 0),
      0
    ),
    female: shops.reduce(
      (total, shop) => total + (shop.demography.find((row) => row.ageRange === ageRange)?.female ?? 0),
      0
    ),
  }))

const sumTransactionMethods = (shops: ShopCustomerBehaviorMock[]): TransactionMethodVolume[] =>
  transactionMethods.map((method) => {
    const matchingMethod = shops[0]?.transactionMethods.find((item) => item.method === method)

    return {
      method,
      transactionCount: shops.reduce(
        (total, shop) =>
          total +
          (shop.transactionMethods.find((item) => item.method === method)?.transactionCount ?? 0),
        0
      ),
      color: matchingMethod?.color ?? "#64748b",
    }
  })

const sumOverview = (shops: ShopCustomerBehaviorMock[]): CustomerOverview => {
  const uniqueCustomerCount = shops.reduce(
    (total, shop) => total + shop.overview.totalUniqueCustomers,
    0
  )
  const transactionCount = shops.reduce(
    (total, shop) =>
      total +
      shop.transactionMethods.reduce(
        (shopTotal, method) => shopTotal + method.transactionCount,
        0
      ),
    0
  )
  const weightedBasketValue = shops.reduce(
    (total, shop) =>
      total +
      shop.overview.averageBasketValue *
        shop.transactionMethods.reduce(
          (shopTotal, method) => shopTotal + method.transactionCount,
          0
        ),
    0
  )
  const weightedAccuracy = shops.reduce(
    (total, shop) =>
      total + shop.overview.forecastAccuracy * shop.overview.totalUniqueCustomers,
    0
  )

  return {
    totalUniqueCustomers: uniqueCustomerCount,
    averageBasketValue: transactionCount ? Math.round(weightedBasketValue / transactionCount) : 0,
    predictedChurn: shops.reduce((total, shop) => total + shop.overview.predictedChurn, 0),
    forecastAccuracy: uniqueCustomerCount
      ? Math.round(weightedAccuracy / uniqueCustomerCount)
      : 0,
  }
}

const buildAggregateInsights = (shops: ShopCustomerBehaviorMock[]): BehavioralInsight[] => {
  const topChurnShop = [...shops].sort(
    (left, right) => right.overview.predictedChurn - left.overview.predictedChurn
  )[0]
  const totalCreditRom = shops.reduce((total, shop) => total + shop.snapshot.creditSaleRom, 0)

  return [
    {
      id: "aggregate-churn",
      text: `${topChurnShop?.shopName ?? "The leading shop"} has the highest predicted churn exposure. Prioritize retention outreach there.`,
      tone: "critical",
    },
    {
      id: "aggregate-credit",
      text: `Credit sales are forecast to reach BDT ${totalCreditRom.toLocaleString("en-BD")} for the remainder of the month.`,
      tone: "warning",
    },
    {
      id: "aggregate-segment",
      text: "Frequent customers are a strong audience for targeted basket-building promotions.",
      tone: "opportunity",
    },
  ]
}

const buildResponse = (
  shops: ShopCustomerBehaviorMock[],
  filters: CustomerBehaviorFilters
): CustomerBehaviorDashboardResponse => ({
  filters,
  overview: sumOverview(shops),
  demography: sumDemography(shops),
  transactionMethods: sumTransactionMethods(shops),
  snapshotRows: shops.map((shop): CustomerSnapshotRow => shop.snapshot),
  clusterPoints: shops.flatMap((shop): CustomerClusterPoint[] => shop.clusterPoints),
  insights: shops.length === 1 ? shops[0].insights : buildAggregateInsights(shops),
})

const createFallbackShop = (shopName: string): ShopCustomerBehaviorMock => {
  const template = customerBehaviorDashboardMock[0]
  const hash = [...shopName].reduce((total, character) => total + character.charCodeAt(0), 0)
  const scale = 0.72 + (hash % 37) / 100
  const scaledTemplate = scaleShopData(template, scale)

  return {
    ...scaledTemplate,
    shopName,
    snapshot: {
      ...scaledTemplate.snapshot,
      shopName,
    },
    clusterPoints: scaledTemplate.clusterPoints.map((point) => ({
      ...point,
      customerId: `${hash}-${point.customerId}`,
      customerName: point.customerName.replace("K-", `${hash}-`),
    })),
    insights: [
      {
        id: `${hash}-churn`,
        text: `${scaledTemplate.overview.predictedChurn} customers are approaching the 90-day inactivity threshold in ${shopName}.`,
        tone: "critical",
      },
      {
        id: `${hash}-credit`,
        text: `Credit sales are forecast to reach BDT ${scaledTemplate.snapshot.creditSaleRom.toLocaleString("en-BD")} for the remainder of the month.`,
        tone: "warning",
      },
      {
        id: `${hash}-segment`,
        text: "Frequent customers are a strong audience for targeted basket-building promotions.",
        tone: "opportunity",
      },
    ],
  }
}

export const customerBehaviorMockApi = {
  getDashboard: async (
    filters: CustomerBehaviorFilters
  ): Promise<CustomerBehaviorDashboardResponse> => {
    const configuredDelay = Number(
      process.env.NEXT_PUBLIC_CUSTOMER_BEHAVIOR_MOCK_DELAY_MS ?? DEFAULT_DELAY_MS
    )
    await sleep(configuredDelay)

    const scale = getDateWindowScale(filters)
    const selectedShop = filters.shopName?.trim()
    const shops = selectedShop
      ? [
          customerBehaviorDashboardMock.find((shop) => shop.shopName === selectedShop) ??
            createFallbackShop(selectedShop),
        ]
      : customerBehaviorDashboardMock

    return clone(buildResponse(shops.map((shop) => scaleShopData(shop, scale)), filters))
  },
}
