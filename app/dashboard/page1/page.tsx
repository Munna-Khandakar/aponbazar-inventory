"use client"

import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { InventoryPredictionChart } from "@/components/dashboard/inventory-prediction-chart"
import { DemandForecastTable } from "@/components/dashboard/demand-forecast-table"
import { StockLevelsChart } from "@/components/dashboard/stock-levels-chart"
import { ProductPerformanceRadarChart } from "@/components/dashboard/product-performance-radar-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPageOne() {
  return (
    <div className="space-y-6">
      <Card className="border border-dashed border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Predictive Sales & Inventory Operations</CardTitle>
          <CardDescription>
            AI-powered forecasting for sales trends and inventory management
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Leverage predictive analytics to optimize stock levels, anticipate demand, and make data-driven purchasing decisions.
        </CardContent>
      </Card>

      <section>
        <SalesForecastChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <InventoryPredictionChart />
        <StockLevelsChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <DemandForecastTable />
        <ProductPerformanceRadarChart />
      </section>
    </div>
  )
}
