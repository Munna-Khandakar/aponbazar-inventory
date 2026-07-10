const CURRENCY_PREFIX = "BDT"
const TAKA = "৳"

/** Compact currency for KPI cards / tiles, e.g. `BDT 84.62 M`, `BDT 12.4 k`. */
export function formatBdtCompact(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  if (Math.abs(value) >= 1_000_000) return `${CURRENCY_PREFIX} ${(value / 1_000_000).toFixed(2)} M`
  if (Math.abs(value) >= 1_000) return `${CURRENCY_PREFIX} ${(value / 1_000).toFixed(1)} k`
  return `${CURRENCY_PREFIX} ${value.toLocaleString("en-BD")}`
}

/** Compact taka symbol for chart axes / dense labels, e.g. `৳84.6M`. */
export function formatTakaCompact(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  if (Math.abs(value) >= 1_000_000) return `${TAKA}${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${TAKA}${(value / 1_000).toFixed(0)}k`
  return `${TAKA}${value.toLocaleString("en-BD")}`
}

/** Full grouped currency for data tables, e.g. `18,645,230`. */
export function formatBdtFull(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return value.toLocaleString("en-BD", { maximumFractionDigits: 0 })
}

/** Whole-number quantity, e.g. `7,245,600`. */
export function formatQty(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return value.toLocaleString("en-BD", { maximumFractionDigits: 0 })
}

/** Signed percentage, e.g. `+12.6%`, `-2.1%`; `null` → `—`. */
export function formatPct(value: number | null | undefined, fractionDigits = 1): string {
  if (value == null || Number.isNaN(value)) return "—"
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(fractionDigits)}%`
}

/** Plain count with grouping, e.g. `35,787`; `null` → `—`. */
export function formatCount(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return value.toLocaleString("en-BD", { maximumFractionDigits: 0 })
}
