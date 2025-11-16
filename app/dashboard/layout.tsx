"use client"

import { useState } from "react"
import { Menu } from "lucide-react"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { useRequireAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isChecking, signOut } = useRequireAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

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
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row">
        <div
          className={cn(
            "md:sticky md:top-10 md:h-fit md:w-64",
            mobileNavOpen ? "block" : "hidden md:block"
          )}
        >
          <DashboardNav
            onSignOut={() => {
              setMobileNavOpen(false)
              signOut()
            }}
          />
        </div>
        <div className="flex-1 space-y-6">
          <div className="flex justify-end md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center gap-2 rounded-full border-border/60 bg-white shadow-sm"
              onClick={() => setMobileNavOpen((prev) => !prev)}
            >
              <Menu size={16} />
              Menu
            </Button>
          </div>
          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
