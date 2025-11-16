"use client"

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePromoImpact } from "@/hooks/use-dashboard"

const chartConfig = {
  baseline: {
    label: "Baseline",
    color: "#94a3b8",
  },
  forecast: {
    label: "Forecast",
    color: "#0ea5e9",
  },
  upliftPct: {
    label: "Uplift %",
    color: "#14b8a6",
  },
} satisfies ChartConfig

export function PromoImpactChart() {
  const { data } = usePromoImpact()
  const chartData = data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotion impact</CardTitle>
        <CardDescription>Baseline vs forecasted lift per live campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="campaign" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value, name) =>
                    name === "upliftPct" ? `${value}% uplift` : `$${Number(value).toLocaleString()}`
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              yAxisId="left"
              dataKey="baseline"
              fill="var(--color-baseline)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              yAxisId="left"
              dataKey="forecast"
              fill="var(--color-forecast)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="upliftPct"
              stroke="var(--color-upliftPct)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ChartContainer>
        <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
          {chartData.map((row) => (
            <div key={row.campaign} className="flex items-center justify-between rounded-lg border border-dashed border-border/70 px-3 py-2">
              <span className="font-medium text-foreground">{row.campaign}</span>
              <span>
                Margin uplift {row.marginPct}% – target ${Math.round(row.forecast - row.baseline).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
