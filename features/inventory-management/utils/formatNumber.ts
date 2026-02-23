const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})

export const formatNumber = (value: number) => {
  return numberFormatter.format(value)
}
