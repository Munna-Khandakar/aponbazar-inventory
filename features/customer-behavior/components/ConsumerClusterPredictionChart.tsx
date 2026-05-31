"use client"

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type {
  CustomerCluster,
  CustomerClusterPoint,
} from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import { formatCurrency } from "@/features/customer-behavior/utils/formatCustomerBehaviorValue"

const chartConfig = {
  highValue: {
    label: "High Value",
    color: "#8b5cf6",
  },
  frequent: {
    label: "Frequent",
    color: "#0f766e",
  },
  occasional: {
    label: "Occasional",
    color: "#f59e0b",
  },
  atRisk: {
    label: "At Risk",
    color: "#ef4444",
  },
} satisfies ChartConfig

const clusterStyles: Record<CustomerCluster, { color: string }> = {
  "High Value": chartConfig.highValue,
  Frequent: chartConfig.frequent,
  Occasional: chartConfig.occasional,
  "At Risk": chartConfig.atRisk,
}

const clusters = Object.keys(clusterStyles) as CustomerCluster[]

type ConsumerClusterPredictionChartProps = {
  data: CustomerClusterPoint[]
}

type ClusterTooltipProps = {
  active?: boolean
  payload?: Array<{ payload: CustomerClusterPoint }>
}

function ClusterTooltip({ active, payload }: ClusterTooltipProps) {
  const point = payload?.[0]?.payload

  if (!active || !point) {
    return null
  }

  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground">{point.customerName}</p>
      <p className="mt-1 text-muted-foreground">Cluster: {point.cluster}</p>
      <p className="text-muted-foreground">
        Frequency: {point.purchaseFrequency.toFixed(1)} transactions
      </p>
      <p className="text-muted-foreground">
        Average spend: {formatCurrency(point.averageSpend)}
      </p>
    </div>
  )
}

export function ConsumerClusterPredictionChart({
  data,
}: ConsumerClusterPredictionChartProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Consumer Cluster Prediction</CardTitle>
        <CardDescription>
          Customer purchase frequency compared with average basket spend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[360px] w-full">
          <ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="purchaseFrequency"
              name="Purchase frequency"
              unit=" txns"
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
            <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ClusterTooltip />} />
            {clusters.map((cluster) => (
              <Scatter
                key={cluster}
                name={cluster}
                data={data.filter((point) => point.cluster === cluster)}
                fill={clusterStyles[cluster].color}
              />
            ))}
          </ScatterChart>
        </ChartContainer>

        <div className="mt-4 flex flex-wrap gap-2">
          {clusters.map((cluster) => (
            <div
              key={cluster}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: clusterStyles[cluster].color }}
              />
              {cluster}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
