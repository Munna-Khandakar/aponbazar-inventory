"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useInventoryHealth } from "@/hooks/use-dashboard"

const chartConfig = {
  healthy: {
    label: "Healthy",
    color: "#10b981",
  },
  atRisk: {
    label: "At risk",
    color: "#f97316",
  },
  overstock: {
    label: "Overstock",
    color: "#ef4444",
  },
} satisfies ChartConfig

export function InventoryHealthChart() {
  const { data } = useInventoryHealth()
  const chartData = data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory health</CardTitle>
        <CardDescription>Cover days and risk posture by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value) => `${Number(value).toLocaleString()} units`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="healthy" stackId="inventory" fill="var(--color-healthy)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="atRisk" stackId="inventory" fill="var(--color-atRisk)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="overstock" stackId="inventory" fill="var(--color-overstock)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
          {chartData.map((category) => (
            <div key={category.category} className="flex items-center justify-between rounded-xl border border-dashed border-border/70 px-3 py-2">
              <span className="font-medium text-foreground">{category.category}</span>
              <span className="text-foreground">
                {category.coverDays} <span className="text-muted-foreground">days cover</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
