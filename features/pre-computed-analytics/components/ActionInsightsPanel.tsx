"use client"

import { Clock, AlertCircle, TrendingUp, AlertTriangle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { ActionInsight } from "../types/PreComputedDashboard"

const toneStyles = {
  critical: {
    container: "bg-red-50 border-red-200 text-red-900",
    icon: AlertCircle,
    iconClass: "text-red-500",
  },
  warning: {
    container: "bg-amber-50 border-amber-200 text-amber-900",
    icon: AlertTriangle,
    iconClass: "text-amber-500",
  },
  opportunity: {
    container: "bg-emerald-50 border-emerald-200 text-emerald-900",
    icon: TrendingUp,
    iconClass: "text-emerald-500",
  },
}

type Props = {
  insights: ActionInsight[]
  computedAt: string | null
}

export function ActionInsightsPanel({ insights, computedAt }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Immediate Action Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">No critical insights at this time.</p>
        ) : (
          insights.map((insight) => {
            const { container, icon: Icon, iconClass } = toneStyles[insight.tone]
            return (
              <div
                key={insight.id}
                className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", container)}
              >
                <Icon size={16} className={cn("mt-0.5 shrink-0", iconClass)} />
                <span>{insight.text}</span>
              </div>
            )
          })
        )}

        {computedAt ? (
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>
              Data computed at{" "}
              {new Date(computedAt).toLocaleString("en-BD", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
