import { TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metric } from "@/lib/types/dashboard"

type MetricCardProps = {
  metric: Metric
}

export const MetricCard = ({ metric }: MetricCardProps) => {
  const isUp = metric.trendDirection === "up"
  const Icon = isUp ? TrendingUp : TrendingDown

  return (
    <Card className="border-border/70">
      <CardHeader className="gap-1">
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl">{metric.value}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className={isUp ? "text-emerald-500" : "text-rose-500"} size={16} />
        <span className={isUp ? "text-emerald-500" : "text-rose-500"}>{metric.trend}</span>
        <span>vs previous period</span>
      </CardContent>
    </Card>
  )
}
