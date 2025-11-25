"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, TrendingUp, Package, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

type DashboardNavProps = {
  onSignOut: () => void
}

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/sales-prediction", label: "Sales Prediction", icon: TrendingUp },
  { href: "/dashboard/inventory-management", label: "Inventory Management", icon: Package },
  { href: "/dashboard/customer-behavior", label: "Customer Behavior", icon: Users },
]

export const DashboardNav = ({ onSignOut }: DashboardNavProps) => {
  const pathname = usePathname()

  return (
    <aside className="flex w-full flex-col gap-6 rounded-2xl border border-border/80 bg-card/70 p-6 shadow-sm md:max-w-xs">
      <div>
        <p className="text-sm font-semibold text-muted-foreground">Navigation</p>
      </div>
      <div className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Theme</p>
        <ThemeToggle />
      </div>
      <Button variant="outline" size="lg" className="justify-center gap-2" onClick={onSignOut}>
        <LogOut size={16} />
        Sign out
      </Button>
    </aside>
  )
}
