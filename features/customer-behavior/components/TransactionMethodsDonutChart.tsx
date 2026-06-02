"use client"

import { Cell, Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PaymentMethodSales } from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import { formatCurrency } from "@/features/customer-behavior/utils/formatCustomerBehaviorValue"

type TransactionMethodsDonutChartProps = {
  data: PaymentMethodSales[]
}

export function TransactionMethodsDonutChart({ data }: TransactionMethodsDonutChartProps) {
  const totalSalesValue = data.reduce(
    (total, method) => total + method.amount,
    0
  )

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle>Payment Method Sales Mix</CardTitle>
        <CardDescription>Current-month sales value by payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ChartContainer config={{}} className="aspect-auto h-[230px] w-full">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => (
                      <div className="flex min-w-32 items-center justify-between gap-4">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="font-mono font-medium">
                          {formatCurrency(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="amount"
                nameKey="method"
                innerRadius={66}
                outerRadius={96}
                strokeWidth={2}
              >
                {data.map((method) => (
                  <Cell key={method.method} fill={method.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Sales Value
              </p>
              <p className="font-mono text-xl font-semibold text-foreground">
                {formatCurrency(totalSalesValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {data.map((method) => {
            return (
              <div
                key={method.method}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: method.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{method.method}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatCurrency(method.amount)} ({method.percentage.toFixed(2)}%)
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
