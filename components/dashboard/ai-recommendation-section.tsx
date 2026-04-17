"use client"

import { Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const recommendationItems = [
  {
    id: "stockout-alert",
    text: "5 items will stock out in 7 days in shop 4",
    className: "bg-rose-500 text-white",
  },
  {
    id: "reorder-p002",
    text: "Reorder item P002 in 9 days from BDFood",
    className: "bg-amber-400 text-white",
  },
  {
    id: "optimize-p018",
    text: "Reduce order frequency for P018 as demand slows",
    className: "bg-emerald-400 text-white",
  },
]

export function AiRecommendationSection() {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start gap-3">
          <div>
            <CardTitle>AI Recommendation</CardTitle>
            <CardDescription>
              Critical alerts, upcoming reorders, and optimization tips
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendationItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-sm ${item.className}`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>{item.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
