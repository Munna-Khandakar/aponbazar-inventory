"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { usePathname } from "next/navigation"

import { DashboardRightSidebar } from "@/components/dashboard/dashboard-right-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { ReportFiltersProvider } from "@/hooks/use-report-filters"
import { useRequireAuth } from "@/hooks/use-auth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isChecking, signOut } = useRequireAuth()
  const pathname = usePathname()
  const showOnlySidebarTitles = pathname === "/dashboard/sales-prediction"
  const snapshotTargetId =
    pathname === "/dashboard/sales-prediction"
      ? "shop-performance-snapshot"
      : pathname === "/dashboard/inventory-management"
        ? "shop-inventory-snapshot"
        : undefined
  const topbarRef = useRef<HTMLDivElement | null>(null)
  const [topbarHeight, setTopbarHeight] = useState(0)

  useEffect(() => {
    const topbarElement = topbarRef.current

    if (!topbarElement) {
      return
    }

    const updateTopbarHeight = () => {
      setTopbarHeight(topbarElement.getBoundingClientRect().height)
    }

    updateTopbarHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateTopbarHeight()
    })

    resizeObserver.observe(topbarElement)
    window.addEventListener("resize", updateTopbarHeight)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", updateTopbarHeight)
    }
  }, [])

  const layoutStyle: CSSProperties & Record<"--dashboard-topbar-height", string> = {
    "--dashboard-topbar-height": `${topbarHeight}px`,
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-border/60 bg-white px-10 py-8 text-sm font-medium text-muted-foreground">
          Verifying session...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50" style={layoutStyle}>
      <ReportFiltersProvider>
        <div className="pb-4 sm:pb-6 lg:pb-8">
          <div ref={topbarRef}>
            <DashboardTopbar onSignOut={signOut} />
          </div>

          <div className="grid gap-6 px-4 pt-4 sm:px-6 sm:pt-4 lg:px-8 xl:grid-cols-[320px_minmax(0,1fr)]">
            <main className="order-1 min-w-0 space-y-6 xl:order-2">{children}</main>

            <div className="order-2 min-w-0 xl:order-1">
              <div className="xl:sticky xl:top-[calc(var(--dashboard-topbar-height)+1rem)]">
                <DashboardRightSidebar
                  showOnlyTitle={showOnlySidebarTitles}
                  snapshotTargetId={snapshotTargetId}
                />
              </div>
            </div>
          </div>
        </div>
      </ReportFiltersProvider>
    </div>
  )
}
