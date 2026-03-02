"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PerformanceCategory = {
  id: string
  label: string
  shops: string[]
}

const performanceCategories: PerformanceCategory[] = [
  {
    id: "top",
    label: "Top Performer",
    shops: ["Gulshan Flagship", "Banani Express", "Uttara Mega"],
  },
  {
    id: "mid",
    label: "Mid Performer",
    shops: ["Dhanmondi Super", "Mirpur Outlet", "Badda Point"],
  },
  {
    id: "lowest",
    label: "Lowest Performer",
    shops: ["Old Dhaka Store", "Narayanganj Hub", "Moghbazar Mini"],
  },
]

const initialExpandedState = performanceCategories.reduce<Record<string, boolean>>((state, category) => {
  state[category.id] = category.id === performanceCategories[0]?.id
  return state
}, {})

export function PerformanceFilterSection() {
  const [selectedCategory, setSelectedCategory] = useState(performanceCategories[0]?.id)
  const [selectedShop, setSelectedShop] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(initialExpandedState)

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedShop(null)
    setExpandedCategories((previous) => ({
      ...previous,
      [categoryId]: true,
    }))
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((previous) => ({
      ...previous,
      [categoryId]: !previous[categoryId],
    }))
  }

  return (
    <section className="space-y-3 rounded-xl border border-border/70 bg-background/95 p-4">
      <div>
        <h3 className="text-sm font-semibold">Performance Filter</h3>
        <p className="text-xs text-muted-foreground">Select a performer tier and shop.</p>
      </div>

      <div className="space-y-2">
        {performanceCategories.map((category) => {
          const isSelectedCategory = selectedCategory === category.id
          const isExpanded = expandedCategories[category.id]

          return (
            <div key={category.id} className="rounded-lg border border-border/60 bg-muted/20 p-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-between rounded-md px-2 py-1.5 text-left text-sm font-medium transition",
                    isSelectedCategory
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="truncate">{category.label}</span>
                </button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  onClick={() => toggleCategory(category.id)}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.label}`}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
              </div>

              {isExpanded ? (
                <ul className="mt-2 space-y-1.5">
                  {category.shops.map((shop) => {
                    const isSelectedShop = selectedShop === shop

                    return (
                      <li key={shop}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setSelectedShop(shop)
                          }}
                          className={cn(
                            "w-full rounded-md border px-2 py-1.5 text-left text-xs font-medium transition",
                            isSelectedShop
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-transparent bg-background/80 text-muted-foreground hover:border-border/70 hover:text-foreground"
                          )}
                        >
                          {shop}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
