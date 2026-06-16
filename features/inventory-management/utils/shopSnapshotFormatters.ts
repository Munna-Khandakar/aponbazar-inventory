import type { InventoryHealthStatus } from "@/features/inventory-management/types/ShopInventorySnapshotReport"

const quantityFormatter = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentageFormatter = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatQuantity = (value: number | null) => {
  if (value === null) {
    return "N/A"
  }

  return quantityFormatter.format(value)
}

export const formatCurrency = (value: number | null) => {
  if (value === null) {
    return "N/A"
  }

  return `৳${currencyFormatter.format(value)}`
}

export const formatPercentage = (value: number | null) => {
  if (value === null) {
    return "N/A"
  }

  return `${percentageFormatter.format(value)}%`
}

export const getHealthTone = (value: InventoryHealthStatus | null) => {
  switch (value) {
    case "Healthy":
      return "bg-emerald-100 text-emerald-700"
    case "Overstocked":
      return "bg-amber-100 text-amber-700"
    case "Stockout Risk":
      return "bg-rose-100 text-rose-700"
    default:
      return "bg-slate-100 text-slate-600"
  }
}
