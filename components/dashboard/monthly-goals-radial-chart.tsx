"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useMonthlyGoals } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
  actual: {
    label: "Actual",
    color: "#10b981",
  },
  goal: {
    label: "Goal",
    color: "#e5e7eb",
  },
} satisfies ChartConfig

export function MonthlyGoalsRadialChart() {
  const { data, isLoading, error } = useMonthlyGoals()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Goal Completion</CardTitle>
          <CardDescription>Current month progress toward target</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Goal Completion</CardTitle>
          <CardDescription>Current month progress toward target</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load goal data
        </CardContent>
      </Card>
    )
  }

  // Get current month (last item)
  const currentMonth = data[data.length - 1]
  const percentage = Math.round((currentMonth.actual / currentMonth.goal) * 100)

  const chartData = [
    {
      month: currentMonth.month,
      actual: currentMonth.actual,
      goal: currentMonth.goal,
      fill: percentage >= 100 ? "#10b981" : percentage >= 75 ? "#3b82f6" : "#f59e0b",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Goal Completion</CardTitle>
        <CardDescription>{currentMonth.month} - Progress toward target</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 + (percentage / 100) * 360}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Complete
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="actual"
              stackId="a"
              cornerRadius={10}
              fill="var(--color-actual)"
              className="stroke-transparent stroke-2"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground">Actual: {value}</span>
                      <span className="text-muted-foreground">Goal: {currentMonth.goal}</span>
                    </div>
                  )}
                />
              }
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
