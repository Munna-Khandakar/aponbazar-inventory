"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardRightSidebar } from "@/components/dashboard/dashboard-right-sidebar"
import { Button } from "@/components/ui/button"
import { ReportFiltersProvider } from "@/hooks/use-report-filters"
import { useRequireAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isChecking, signOut } = useRequireAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="rounded-2xl border border-border/60 bg-white px-10 py-8 text-sm font-medium text-muted-foreground dark:bg-slate-900">
          Verifying session...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ReportFiltersProvider>
        <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex justify-end lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2"
              onClick={() => setMobileSidebarOpen((open) => !open)}
              aria-label={mobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              Menu
            </Button>
          </div>

          <div className={cn("lg:hidden", mobileSidebarOpen ? "block" : "hidden")}>
            <DashboardNav onSignOut={signOut} onNavigate={() => setMobileSidebarOpen(false)} />
          </div>

          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <div className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <DashboardNav onSignOut={signOut} />
              </div>
            </div>

            <main className="col-span-12 space-y-6 lg:col-span-7">{children}</main>

            <div className="col-span-12 lg:col-span-3">
              <div className="lg:sticky lg:top-6">
                <DashboardRightSidebar />
              </div>
            </div>
          </div>
        </div>
      </ReportFiltersProvider>
    </div>
  )
}
