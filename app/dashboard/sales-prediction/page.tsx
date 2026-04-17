"use client"

import { ToplineSalesOverview } from "@/components/dashboard/topline-sales-overview"
import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { PromoImpactChart } from "@/components/dashboard/promo-impact-chart"
import { SalesPredictionPerformanceSection } from "@/components/dashboard/sales-prediction-performance-section"

export default function SalesPredictionPage() {
  return (
    <div className="space-y-6">
      <section>
        <ToplineSalesOverview />
      </section>

      <section>
        <SalesForecastChart />
      </section>

      <section>
        <SalesPredictionPerformanceSection />
      </section>

      <section>
        <PromoImpactChart />
      </section>
    </div>
  )
}
