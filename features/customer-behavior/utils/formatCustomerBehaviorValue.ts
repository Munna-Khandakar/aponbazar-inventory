export const formatCurrency = (value: number) =>
  `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 0,
  })}`

export const formatNullableCurrency = (value: number | null) =>
  value === null ? "N/A" : formatCurrency(value)

export const formatNumber = (value: number) => value.toLocaleString("en-BD")

export const formatNullableNumber = (value: number | null) =>
  value === null ? "N/A" : formatNumber(value)

export const formatNullablePercentage = (value: number | null) =>
  value === null ? "N/A" : `${value.toFixed(0)}%`
