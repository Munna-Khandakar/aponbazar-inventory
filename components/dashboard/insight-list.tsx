"use client"

import type { ElementType } from "react"

import { BadgeCheck, Clock4, Rocket } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Insight } from "@/lib/types/dashboard"

const statusMap: Record<Insight["status"], { icon: ElementType; label: string; color: string }> = {
  new: { icon: Rocket, label: "New", color: "text-sky-500" },
  "in-progress": { icon: Clock4, label: "In progress", color: "text-amber-500" },
  done: { icon: BadgeCheck, label: "Done", color: "text-emerald-500" },
}

type InsightListProps = {
  insights: Insight[]
}

export const InsightList = ({ insights }: InsightListProps) => (
  <Card className="border-border/70">
    <CardHeader>
      <CardTitle className="text-base">Actionable insights</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {insights.map((insight) => {
        const meta = statusMap[insight.status]
        const Icon = meta.icon
        return (
          <div key={insight.id} className="rounded-xl border border-border/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">{insight.title}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${meta.color}`}>
                <Icon size={14} />
                {meta.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </div>
        )
      })}
    </CardContent>
  </Card>
)
