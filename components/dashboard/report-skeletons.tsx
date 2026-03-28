"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const salesForecastColumnHeights = [
  "h-20",
  "h-28",
  "h-24",
  "h-36",
  "h-32",
  "h-44",
]

const salesForecastComparisonHeights = [
  "h-16",
  "h-24",
  "h-20",
  "h-32",
  "h-28",
  "h-36",
]

const promoImpactBarWidths = [
  "w-8/12",
  "w-10/12",
  "w-7/12",
  "w-11/12",
  "w-9/12",
  "w-6/12",
]

const promoImpactComparisonBarWidths = [
  "w-7/12",
  "w-8/12",
  "w-6/12",
  "w-9/12",
  "w-7/12",
  "w-5/12",
]

export function SalesForecastChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted/20 px-4 py-5">
        <div className="pointer-events-none absolute inset-x-4 top-5 space-y-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-px bg-border/60" />
          ))}
        </div>
        <div className="pointer-events-none absolute bottom-9 left-12 right-4 h-px bg-border/70" />
        <div className="pointer-events-none absolute bottom-9 left-12 top-4 w-px bg-border/70" />

        <div className="relative flex h-full items-end gap-4 pb-12 pl-14 pr-4">
          {salesForecastColumnHeights.map((heightClass, index) => (
            <div key={index} className="flex flex-1 items-end justify-center gap-2">
              <Skeleton className={cn("w-3 rounded-full", heightClass)} />
              <Skeleton
                className={cn(
                  "w-3 rounded-full opacity-70",
                  salesForecastComparisonHeights[index]
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PromoImpactChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {["w-20", "w-20", "w-28"].map((widthClass, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className={cn("h-3", widthClass)} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
        <div className="space-y-4">
          {promoImpactBarWidths.map((widthClass, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <div className="space-y-2 rounded-lg border border-border/40 bg-background/60 p-3">
                <Skeleton className={cn("h-3", widthClass)} />
                <Skeleton
                  className={cn(
                    "h-3 opacity-70",
                    promoImpactComparisonBarWidths[index]
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function StorePerformanceTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={index} className="border-b border-border/60 last:border-b-0">
          <td className="py-3 pr-3">
            <Skeleton className="h-4 w-36" />
          </td>
          <td className="py-3 text-center">
            <Skeleton className="mx-auto h-6 w-16 rounded-full" />
          </td>
          <td className="py-3 text-center">
            <Skeleton className="mx-auto h-6 w-16 rounded-full" />
          </td>
          <td className="py-3">
            <Skeleton className="ml-auto h-4 w-20" />
          </td>
          <td className="py-3">
            <Skeleton className="ml-auto h-4 w-20" />
          </td>
          <td className="py-3">
            <Skeleton className="ml-auto h-4 w-16" />
          </td>
          <td className="py-3">
            <Skeleton className="ml-auto h-4 w-16" />
          </td>
        </tr>
      ))}
    </>
  )
}

export function SidebarInsightsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <li
          key={index}
          className="space-y-2 rounded-md border border-border/60 bg-slate-50/70 p-2"
        >
          <Skeleton className="h-3.5 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-2.5 flex-1 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        </li>
      ))}
    </>
  )
}
