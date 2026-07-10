"use client"

import { useMemo } from "react"
import { ResponsiveContainer, Tooltip, Treemap } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { TreemapCategory } from "../types/PreComputedDashboard"
import { formatTakaCompact } from "../utils/formatters"

const PALETTE = [
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#dc2626",
  "#d97706",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ea580c",
  "#9333ea",
]

type TreemapDatum = {
  name: string
  size: number
}

type CustomContentProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  name?: string
  value?: number
  /** Total of all sizes — passed explicitly so we don't rely on recharts
   * forwarding arbitrary data fields to the content renderer. */
  total?: number
}

function CustomContent({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  name,
  value,
  total = 0,
}: CustomContentProps) {
  if (!name) return null
  const showLabel = width > 54 && height > 34
  const fill = PALETTE[index % PALETTE.length]
  const pct = total > 0 && value != null ? (value / total) * 100 : null
  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        fill={fill}
        fillOpacity={0.9}
        rx={4}
      />
      {showLabel ? (
        <>
          <text x={x + 10} y={y + 22} fill="#fff" fontSize={13} fontWeight={600}>
            {name}
          </text>
          {pct != null ? (
            <text x={x + 10} y={y + 40} fill="#fff" fontSize={12} opacity={0.9}>
              {pct.toFixed(1)}%
            </text>
          ) : null}
        </>
      ) : null}
    </g>
  )
}

type TreemapTooltipProps = {
  active?: boolean
  payload?: { value?: number; payload?: { name?: string } }[]
  total?: number
}

function TreemapTooltip({ active, payload, total = 0 }: TreemapTooltipProps) {
  if (!active || !payload?.length) return null
  const node = payload[0]
  const name = node.payload?.name
  const value = node.value
  if (!name) return null
  const pct = total > 0 && value != null ? (value / total) * 100 : null
  return (
    <div className="rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-xs shadow-md">
      <p className="font-medium text-foreground">{name}</p>
      <p className="text-muted-foreground">
        {formatTakaCompact(value)}
        {pct != null ? ` · ${pct.toFixed(1)}%` : ""}
      </p>
    </div>
  )
}

type Props = {
  data: TreemapCategory[]
  isLoading: boolean
}

export function InventoryOverviewTreemap({ data, isLoading }: Props) {
  const treemapData = useMemo<TreemapDatum[]>(
    () =>
      data.map((category) => ({
        name: category.name,
        size: category.totalSales,
      })),
    [data]
  )
  const total = useMemo(
    () => data.reduce((sum, category) => sum + category.totalSales, 0),
    [data]
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Inventory Overview (By Sales Volume)</CardTitle>
        <CardDescription>All Outlets · share of total sales</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[340px] w-full" />
        ) : treemapData.length === 0 ? (
          <div className="flex h-[340px] items-center justify-center text-sm text-muted-foreground">
            No inventory overview data available.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={treemapData}
                dataKey="size"
                stroke="#fff"
                isAnimationActive={false}
                content={<CustomContent total={total} />}
              >
                <Tooltip content={<TreemapTooltip total={total} />} />
              </Treemap>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {data.map((category, index) => (
                <div key={category.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                  />
                  <span className="text-foreground">{category.name}</span>
                  <span className="text-muted-foreground">{category.pct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
