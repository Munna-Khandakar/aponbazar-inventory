export type BaseMonthOption = {
  value: string
  label: string
}

export const getBaseMonthOptions = (): BaseMonthOption[] => {
  const months: BaseMonthOption[] = []
  const now = new Date()
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" })
    months.push({ value, label })
  }
  return months
}

export const getDefaultBaseMonth = (): string => {
  const now = new Date()
  const d = new Date(now.getFullYear() - 1, now.getMonth(), 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}
