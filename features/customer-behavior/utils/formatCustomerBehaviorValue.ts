export const formatCurrency = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`

export const formatNumber = (value: number) => value.toLocaleString("en-BD")

export const formatPercentage = (value: number) => `${value.toFixed(0)}%`
