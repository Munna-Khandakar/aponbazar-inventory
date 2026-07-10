"use client"

import type { LucideIcon } from "lucide-react"
import { Boxes, Database, PieChart, Store, TrendingDown, TrendingUp } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import type { DashboardKpi } from "../types/PreComputedDashboard"
import { formatBdtCompact } from "../utils/formatters"

type Accent = "emerald" | "violet" | "sky" | "amber" | "rose"

const accentStyles: Record<Accent, { icon: string; value: string }> = {
  emerald: { icon: "bg-emerald-50 text-emerald-600", value: "text-emerald-600" },
  violet: { icon: "bg-violet-50 text-violet-600", value: "text-violet-600" },
  sky: { icon: "bg-sky-50 text-sky-600", value: "text-sky-600" },
  amber: { icon: "bg-amber-50 text-amber-600", value: "text-amber-700" },
  rose: { icon: "bg-rose-50 text-rose-600", value: "text-rose-600" },
}

function KpiShell({
  label,
  sublabel,
  icon: Icon,
  accent,
  children,
}: {
  label: string
  sublabel: string
  icon: LucideIcon
  accent: Accent
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{label}</p>
          <p className="truncate text-xs text-muted-foreground">{sublabel}</p>
        </div>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            accentStyles[accent].icon
          )}
        >
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function DeltaLine({
  prefix,
  deltaPct,
}: {
  prefix: string
  deltaPct: number | null
}) {
  if (deltaPct == null) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">
        {prefix} <span className="font-medium text-foreground">—</span>
      </p>
    )
  }
  const positive = deltaPct >= 0
  const Icon = positive ? TrendingUp : TrendingDown
  return (
    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
      {prefix}
      <span
        className={cn(
          "inline-flex items-center gap-0.5 font-medium",
          positive ? "text-emerald-600" : "text-rose-600"
        )}
      >
        <Icon size={13} />
        {`${positive ? "+" : ""}${deltaPct.toFixed(1)}%`}
      </span>
    </p>
  )
}

function PlaceholderValue({ stage }: { stage: string }) {
  return (
    <div>
      <p className="text-lg font-semibold text-muted-foreground/70">Coming soon</p>
      <p className="mt-2 text-xs text-muted-foreground">Awaiting {stage} data</p>
    </div>
  )
}

type Props = {
  kpi: DashboardKpi | null
  computedAt: string | null
  isLoading: boolean
}

export function DashboardKpiRow({ kpi, computedAt, isLoading }: Props) {
  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] w-full rounded-xl" />
        ))}
      </section>
    )
  }

  const activePct =
    kpi && kpi.outletsTotal > 0
      ? Math.round((kpi.outletsActive / kpi.outletsTotal) * 100)
      : null

  const updatedDate = computedAt
    ? new Date(computedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—"
  const updatedTime = computedAt
    ? new Date(computedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : ""

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {/* Stage 3 — not delivered yet */}
      <KpiShell label="Total Sales (Predicted)" sublabel="Current Month" icon={TrendingUp} accent="emerald">
        <PlaceholderValue stage="Stage 3" />
      </KpiShell>

      {/* Stage 3 — not delivered yet */}
      <KpiShell label="Predicted Margin" sublabel="Current Month" icon={PieChart} accent="violet">
        <PlaceholderValue stage="Stage 3" />
      </KpiShell>

      <KpiShell label="Total Inventory Value" sublabel="All Outlets" icon={Boxes} accent="sky">
        <p className={cn("text-2xl font-bold", accentStyles.sky.value)}>
          {formatBdtCompact(kpi?.totalInventoryValue)}
        </p>
        <DeltaLine prefix="vs Yesterday" deltaPct={kpi?.inventoryValueDeltaPct ?? null} />
      </KpiShell>

      <KpiShell label="Outlets" sublabel="Active / Total" icon={Store} accent="amber">
        <p className={cn("text-2xl font-bold", accentStyles.amber.value)}>
          {kpi ? `${kpi.outletsActive} / ${kpi.outletsTotal}` : "—"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {activePct != null ? (
            <span className="font-medium text-emerald-600">{activePct}% Active</span>
          ) : (
            "—"
          )}
        </p>
      </KpiShell>

      <KpiShell label="Data Update Status" sublabel="Last Updated" icon={Database} accent="rose">
        <p className={cn("text-2xl font-bold", accentStyles.rose.value)}>{updatedDate}</p>
        <p className="mt-2 text-xs text-muted-foreground">{updatedTime || "—"}</p>
      </KpiShell>
    </section>
  )
}
