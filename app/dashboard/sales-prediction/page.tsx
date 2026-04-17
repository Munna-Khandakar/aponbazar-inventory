"use client"

import { ToplineSalesOverview } from "@/components/dashboard/topline-sales-overview"
import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { PromoImpactChart } from "@/components/dashboard/promo-impact-chart"
import { ShopPerformanceSummary } from "@/components/dashboard/sales-prediction-performance-section"
import { AiRecommendationSection } from "@/components/dashboard/ai-recommendation-section"
import { StorePerformanceTable } from "@/components/dashboard/store-performance-table"
import { useReportFilters } from "@/hooks/use-report-filters"

export default function SalesPredictionPage() {
  const { shopName } = useReportFilters()

  return (
    <div className="space-y-6">
      <section>
        <ToplineSalesOverview />
      </section>

      <section>
        <SalesForecastChart />
      </section>

      <section>
        {shopName ? <ShopPerformanceSummary /> : <StorePerformanceTable />}
      </section>

      {!shopName ? (
        <section>
          <PromoImpactChart />
        </section>
      ) : null}

      <section>
        <AiRecommendationSection />
      </section>
    </div>
  )
}
