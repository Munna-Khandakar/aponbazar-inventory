"use client"

import { useState } from "react"

import { ToplineSalesOverview } from "@/components/dashboard/topline-sales-overview"
import { SalesForecastChart } from "@/components/dashboard/sales-forecast-chart"
import { PromoImpactChart } from "@/components/dashboard/promo-impact-chart"
import { ShopPerformanceSummary } from "@/components/dashboard/sales-prediction-performance-section"
import { AiRecommendationSection } from "@/components/dashboard/ai-recommendation-section"
import { StorePerformanceTable } from "@/components/dashboard/store-performance-table"
import { useReportFilters } from "@/hooks/use-report-filters"
import { getDefaultBaseMonth } from "@/lib/base-month"

export default function SalesPredictionPage() {
  const { shopName } = useReportFilters()
  const [baseMonth, setBaseMonth] = useState(getDefaultBaseMonth)

  return (
    <div className="space-y-6">
      <section>
        <ToplineSalesOverview baseMonth={baseMonth} onBaseMonthChange={setBaseMonth} />
      </section>

      <section>
        <SalesForecastChart baseMonth={baseMonth} />
      </section>

      <section
        id="shop-performance-snapshot"
        className="scroll-mt-[calc(var(--dashboard-topbar-height)+1.5rem)]"
      >
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
