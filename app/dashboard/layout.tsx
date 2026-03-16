"use client"

import { DashboardRightSidebar } from "@/components/dashboard/dashboard-right-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { ReportFiltersProvider } from "@/hooks/use-report-filters"
import { useRequireAuth } from "@/hooks/use-auth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isChecking, signOut } = useRequireAuth()

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
    <div className="min-h-screen bg-slate-50">
      <ReportFiltersProvider>
        <div className="pb-4 sm:pb-6 lg:pb-8">
          <DashboardTopbar onSignOut={signOut} />

          <div className="grid gap-6 px-4 pt-6 sm:px-6 sm:pt-6 lg:px-8 xl:grid-cols-[320px_minmax(0,1fr)]">
            <main className="order-1 min-w-0 space-y-6 xl:order-2">{children}</main>

            <div className="order-2 min-w-0 xl:order-1">
              <div className="xl:sticky xl:top-28">
                <DashboardRightSidebar />
              </div>
            </div>
          </div>
        </div>
      </ReportFiltersProvider>
    </div>
  )
}
