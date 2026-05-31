"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CustomerDemographyRow } from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import { formatNumber } from "@/features/customer-behavior/utils/formatCustomerBehaviorValue"

const chartConfig = {
  male: {
    label: "Male",
    color: "#2563eb",
  },
  female: {
    label: "Female",
    color: "#ec4899",
  },
} satisfies ChartConfig

type CustomerDemographyChartProps = {
  data: CustomerDemographyRow[]
}

export function CustomerDemographyChart({ data }: CustomerDemographyChartProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Customer Demography</CardTitle>
        <CardDescription>Male and female customers by age range</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
          <BarChart data={data} barCategoryGap="22%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="ageRange" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(Number(value))}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent formatter={(value) => formatNumber(Number(value))} />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="male" stackId="customers" fill="var(--color-male)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="female" stackId="customers" fill="var(--color-female)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
