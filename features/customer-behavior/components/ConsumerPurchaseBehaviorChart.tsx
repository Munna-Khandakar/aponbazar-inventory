"use client"

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CustomerPurchaseBehaviorPoint } from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import { formatCurrency } from "@/features/customer-behavior/utils/formatCustomerBehaviorValue"

const shopColors = [
  "#8b5cf6",
  "#0f766e",
  "#f59e0b",
  "#ef4444",
  "#2563eb",
  "#ec4899",
  "#84cc16",
  "#06b6d4",
]

type ConsumerPurchaseBehaviorChartProps = {
  data: CustomerPurchaseBehaviorPoint[]
}

type PurchaseBehaviorTooltipProps = {
  active?: boolean
  payload?: Array<{ payload: CustomerPurchaseBehaviorPoint }>
}

function PurchaseBehaviorTooltip({ active, payload }: PurchaseBehaviorTooltipProps) {
  const point = payload?.[0]?.payload

  if (!active || !point) {
    return null
  }

  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground">{point.customerName}</p>
      <p className="mt-1 text-muted-foreground">Shop: {point.shopName}</p>
      <p className="text-muted-foreground">
        Purchase frequency: {point.purchaseFrequency.toLocaleString("en-BD")}
      </p>
      <p className="text-muted-foreground">
        Average spend: {formatCurrency(point.averageSpend)}
      </p>
      <p className="text-muted-foreground">
        Total spend: {formatCurrency(point.totalSpend)}
      </p>
    </div>
  )
}

export function ConsumerPurchaseBehaviorChart({
  data,
}: ConsumerPurchaseBehaviorChartProps) {
  const shopNames = [...new Set(data.map((point) => point.shopName))].sort()

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Consumer Purchase Behavior</CardTitle>
        <CardDescription>
          Current-month purchase frequency compared with average spend, grouped by shop
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length ? (
          <>
            <ChartContainer config={{}} className="aspect-auto h-[360px] w-full">
              <ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="purchaseFrequency"
                  name="Purchase frequency"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  type="number"
                  dataKey="averageSpend"
                  name="Average spend"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `৳${Number(value).toLocaleString("en-BD")}`}
                  width={72}
                />
                <ChartTooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={<PurchaseBehaviorTooltip />}
                />
                {shopNames.map((shopName, index) => (
                  <Scatter
                    key={shopName}
                    name={shopName}
                    data={data.filter((point) => point.shopName === shopName)}
                    fill={shopColors[index % shopColors.length]}
                  />
                ))}
              </ScatterChart>
            </ChartContainer>

            <div className="mt-4 flex flex-wrap gap-2">
              {shopNames.map((shopName, index) => (
                <div
                  key={shopName}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: shopColors[index % shopColors.length] }}
                  />
                  {shopName}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-52 items-center justify-center text-sm text-muted-foreground">
            No customer purchase behavior rows are available for the current shop.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
