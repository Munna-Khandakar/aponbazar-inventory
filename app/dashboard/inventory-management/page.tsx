"use client"

import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { InventoryPredictionChart } from "@/components/dashboard/inventory-prediction-chart"
import { InventoryHealthChart } from "@/components/dashboard/inventory-health-chart"
import { StockLevelsChart } from "@/components/dashboard/stock-levels-chart"
import { DemandForecastTable } from "@/components/dashboard/demand-forecast-table"

export default function InventoryManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor stock levels, predict inventory needs, and optimize supply chain
        </p>
      </div>

      <DashboardFilters />

      <section className="grid gap-6 lg:grid-cols-2">
        <InventoryPredictionChart />
        <InventoryHealthChart />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <StockLevelsChart />
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <span className="text-sm font-medium">Total SKUs</span>
              <span className="text-2xl font-bold">1,247</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <span className="text-sm font-medium">Low Stock Items</span>
              <span className="text-2xl font-bold text-orange-600">23</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <span className="text-sm font-medium">Out of Stock</span>
              <span className="text-2xl font-bold text-red-600">7</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <span className="text-sm font-medium">Overstocked</span>
              <span className="text-2xl font-bold text-blue-600">15</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <DemandForecastTable />
      </section>
    </div>
  )
}
