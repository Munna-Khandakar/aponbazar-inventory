import { Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BehavioralInsight } from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import { cn } from "@/lib/utils"

type BehavioralInsightsSectionProps = {
  insights: BehavioralInsight[]
}

const toneStyles = {
  critical: "bg-rose-500 text-white",
  warning: "bg-amber-400 text-white",
  opportunity: "bg-emerald-500 text-white",
} as const

export function BehavioralInsightsSection({ insights }: BehavioralInsightsSectionProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>AI Behavioral Insights</CardTitle>
        <CardDescription>
          Rule-based summaries generated from the current live customer reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm",
              toneStyles[insight.tone]
            )}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{insight.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
