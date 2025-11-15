"use client"

import type { ElementType } from "react"

import { AlertTriangle, Circle, ShieldCheck } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Alert } from "@/lib/types/dashboard"

const severityStyles: Record<Alert["severity"], { color: string; icon: ElementType; label: string }> = {
  low: { color: "text-emerald-500", icon: ShieldCheck, label: "Low" },
  medium: { color: "text-amber-500", icon: Circle, label: "Medium" },
  high: { color: "text-rose-500", icon: AlertTriangle, label: "High" },
}

type AlertListProps = {
  alerts: Alert[]
}

export const AlertList = ({ alerts }: AlertListProps) => (
  <Card className="border-border/70">
    <CardHeader>
      <CardTitle className="text-base">System alerts</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {alerts.map((alert) => {
        const meta = severityStyles[alert.severity]
        const Icon = meta.icon
        return (
          <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-border/80 p-4">
            <Icon className={cn("mt-0.5", meta.color)} size={18} />
            <div className="flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs text-muted-foreground">Logged: {alert.createdAt}</p>
            </div>
            <span className={cn("text-xs font-semibold uppercase", meta.color)}>{meta.label}</span>
          </div>
        )
      })}
    </CardContent>
  </Card>
)
