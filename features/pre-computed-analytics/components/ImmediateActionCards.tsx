"use client"

import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  ArrowRight,
  PackageMinus,
  PackagePlus,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type { ActionInsightCounts } from "../types/PreComputedDashboard"
import { formatCount } from "../utils/formatters"

type Tone = "red" | "amber" | "rose" | "orange" | "emerald"

const toneStyles: Record<Tone, { card: string; icon: string; value: string }> = {
  red: { card: "border-red-100 bg-red-50/60", icon: "bg-red-100 text-red-600", value: "text-red-600" },
  amber: {
    card: "border-amber-100 bg-amber-50/60",
    icon: "bg-amber-100 text-amber-600",
    value: "text-amber-600",
  },
  rose: {
    card: "border-rose-100 bg-rose-50/60",
    icon: "bg-rose-100 text-rose-600",
    value: "text-rose-600",
  },
  orange: {
    card: "border-orange-100 bg-orange-50/60",
    icon: "bg-orange-100 text-orange-600",
    value: "text-orange-600",
  },
  emerald: {
    card: "border-emerald-100 bg-emerald-50/60",
    icon: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-600",
  },
}

type ActionKey = keyof Omit<ActionInsightCounts, "computedAt">

const actions: {
  key: ActionKey
  title: string
  subtitle: string
  icon: LucideIcon
  tone: Tone
}[] = [
  {
    key: "lowStock",
    title: "Low Stock Alert",
    subtitle: "Subcategories below optimum inventory",
    icon: PackageMinus,
    tone: "red",
  },
  {
    key: "stockOutRisk",
    title: "Stock Out Risk",
    subtitle: "Items will stock out in next 7 days",
    icon: AlertTriangle,
    tone: "amber",
  },
  {
    key: "overstock",
    title: "Overstock Alert",
    subtitle: "Subcategories over optimum inventory",
    icon: PackagePlus,
    tone: "rose",
  },
  {
    key: "reorderSuggested",
    title: "Reorder Suggested",
    subtitle: "Purchase orders recommended",
    icon: ShoppingCart,
    tone: "orange",
  },
  {
    key: "salesOpportunity",
    title: "Sales Opportunity",
    subtitle: "High demand items understocked",
    icon: TrendingUp,
    tone: "emerald",
  },
]

type Props = {
  counts: ActionInsightCounts | null
  isLoading: boolean
}

export function ImmediateActionCards({ counts, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Immediate Action Needed Insights</CardTitle>
        <CardDescription>AI-Powered Alerts &amp; Recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[130px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {actions.map((action) => {
              const style = toneStyles[action.tone]
              const Icon = action.icon
              const value = counts ? counts[action.key] : null
              return (
                <div
                  key={action.key}
                  className={cn("flex flex-col justify-between rounded-xl border p-4", style.card)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        style.icon
                      )}
                    >
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className={cn("text-2xl font-bold leading-none", style.value)}>
                        {formatCount(value)}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{action.title}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">{action.subtitle}</p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition hover:text-foreground"
                  >
                    View Details
                    <ArrowRight size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
