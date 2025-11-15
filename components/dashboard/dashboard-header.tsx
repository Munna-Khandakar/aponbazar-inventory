"use client"

import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { AuthUser } from "@/lib/auth-storage"

type DashboardHeaderProps = {
  user?: AuthUser
  onToggleNav?: () => void
}

export const DashboardHeader = ({ user, onToggleNav }: DashboardHeaderProps) => {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/80 px-6 py-4 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Welcome back</p>
        <p className="text-lg font-semibold">{user?.name ?? "Guest"}</p>
      </div>
      <Button variant="ghost" className="md:hidden" onClick={onToggleNav}>
        <Menu size={18} />
      </Button>
      <div className="hidden text-sm font-medium text-muted-foreground md:block">{user?.role}</div>
    </header>
  )
}
