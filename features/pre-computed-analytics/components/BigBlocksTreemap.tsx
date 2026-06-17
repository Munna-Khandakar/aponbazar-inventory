"use client"

import { useMemo } from "react"
import { Treemap, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { BigBlockTreemapNode } from "../types/PreComputedDashboard"

const PALETTE = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#d97706",
  "#16a34a",
  "#0891b2",
  "#9333ea",
  "#ea580c",
  "#65a30d",
]

function formatBdt(value: number) {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `৳${(value / 1_000).toFixed(0)}k`
  return `৳${value.toLocaleString("en-BD")}`
}

type CustomContentProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  root?: { children?: BigBlockTreemapNode[] }
  depth?: number
  index?: number
  value?: number
}

function CustomContent({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name,
  root,
  depth,
  index = 0,
  value,
}: CustomContentProps) {
  if (depth === 0 || !root?.children) return null

  const parentIndex = root.children.findIndex((g) =>
    g.children.some((c) => c.name === name)
  )
  const colorIndex = parentIndex >= 0 ? parentIndex : index
  const fill = PALETTE[colorIndex % PALETTE.length]
  const showLabel = width > 48 && height > 28

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        fill={fill}
        fillOpacity={depth === 1 ? 0.15 : 0.8}
        stroke={fill}
        strokeWidth={depth === 1 ? 2 : 0}
        rx={4}
      />
      {showLabel ? (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={depth === 1 ? fill : "#fff"}
            fontSize={depth === 1 ? 13 : 11}
            fontWeight={depth === 1 ? 700 : 500}
          >
            {name}
          </text>
          {depth === 2 && value != null ? (
            <text
              x={x + width / 2}
              y={y + height / 2 + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize={10}
              opacity={0.85}
            >
              {formatBdt(value)}
            </text>
          ) : null}
        </>
      ) : null}
    </g>
  )
}

type Props = {
  data: BigBlockTreemapNode[]
  isLoading: boolean
}

export function BigBlocksTreemap({ data, isLoading }: Props) {
  const bigBlocks = useMemo(() => data.map((n) => n.name), [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Big Block Sales</CardTitle>
        <CardDescription>Sales volume by product category and sub-category</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[360px] w-full" />
        ) : data.length === 0 ? (
          <div className="flex h-[360px] items-center justify-center text-sm text-muted-foreground">
            No big block sales data available.
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={360}>
              <Treemap
                data={data}
                dataKey="size"
                content={<CustomContent root={{ children: data }} />}
              />
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-2">
              {bigBlocks.map((name, i) => (
                <div
                  key={name}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                  />
                  {name}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
