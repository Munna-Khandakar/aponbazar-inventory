"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const timeRanges = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "YTD", value: "ytd" },
]

const storeOptions = ["All stores", "Gulshan Flagship", "Dhanmondi Super", "Uttara Mega", "Chattogram Hub"]

const catalogHierarchy = {
  "Fresh Food": {
    categories: {
      Produce: ["Seasonal Mango Crate", "Farmers Market Vegetables", "Leafy Greens Pack"],
      Dairy: ["Organic Milk 2L", "Greek Yogurt Tub", "Artisan Cheese Board"],
    },
  },
  "Pantry Staples": {
    categories: {
      Grains: ["Premium Basmati Rice 10kg", "Whole Grain Atta"],
      Condiments: ["Signature Spice Mix", "Cold Pressed Mustard Oil"],
    },
  },
  "Household Care": {
    categories: {
      Cleaning: ["Lemon Surface Cleaner", "Concentrated Floor Solution"],
      PaperGoods: ["Jumbo Kitchen Roll", "Eco Paper Towels"],
    },
  },
  "Health & Beauty": {
    categories: {
      PersonalCare: ["Herbal Shampoo", "Vitamin C Serum"],
      Wellness: ["Immunity Booster Pack", "Electrolyte Mix Sachets"],
    },
  },
} as const

const defaultCategoryOption = "All categories"
const defaultItemOption = "All items"
const bigCategoryOptions = ["All departments", ...Object.keys(catalogHierarchy)]

const allCategoryNames = Array.from(
  new Set(Object.values(catalogHierarchy).flatMap((section) => Object.keys(section.categories)))
)

const categoryToItems = Object.values(catalogHierarchy).reduce((acc, section) => {
  for (const [category, items] of Object.entries(section.categories)) {
    acc[category] = items
  }
  return acc
}, {} as Record<string, string[]>)

const allItemNames = Array.from(new Set(Object.values(categoryToItems).flat()))

export function DashboardFilters() {
  const [range, setRange] = useState("30d")
  const [store, setStore] = useState(storeOptions[0])
  const [bigCategory, setBigCategory] = useState(bigCategoryOptions[0])
  const [category, setCategory] = useState(defaultCategoryOption)
  const [item, setItem] = useState(defaultItemOption)

  const availableCategories = useMemo(() => {
    if (bigCategory === "All departments") {
      return [defaultCategoryOption, ...allCategoryNames]
    }
    const section = catalogHierarchy[bigCategory as keyof typeof catalogHierarchy]
    return [defaultCategoryOption, ...(section ? Object.keys(section.categories) : [])]
  }, [bigCategory])

  const availableItems = useMemo(() => {
    if (category !== defaultCategoryOption) {
      return [defaultItemOption, ...(categoryToItems[category] ?? [])]
    }

    if (bigCategory === "All departments") {
      return [defaultItemOption, ...allItemNames]
    }

    const section = catalogHierarchy[bigCategory as keyof typeof catalogHierarchy]
    if (!section) {
      return [defaultItemOption]
    }

    const scopedItems = Object.values(section.categories).flat()
    return [defaultItemOption, ...scopedItems]
  }, [bigCategory, category])

  return (
    <Card className="border border-border/60">
      <CardHeader className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle className="text-base">Scenario filters</CardTitle>
          <CardDescription>Dial forecasts by range, store, and assortment slice.</CardDescription>
        </div>
        <p className="text-xs text-muted-foreground">
          Active:{" "}
          <span className="font-medium text-foreground">
            {range.toUpperCase()} • {store}
          </span>
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-3">
          {timeRanges.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={range === option.value ? "default" : "outline"}
              className={
                range === option.value
                  ? "shadow-sm"
                  : "border-border/70 bg-transparent text-foreground hover:bg-muted"
              }
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            <span>Store focus</span>
            <select
              value={store}
              onChange={(event) => setStore(event.target.value)}
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring"
            >
              {storeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            <span>Big category</span>
            <select
              value={bigCategory}
              onChange={(event) => {
                setBigCategory(event.target.value)
                setCategory(defaultCategoryOption)
                setItem(defaultItemOption)
              }}
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring"
            >
              {bigCategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setItem(defaultItemOption)
              }}
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring"
            >
              {availableCategories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            <span>Item</span>
            <select
              value={item}
              onChange={(event) => setItem(event.target.value)}
              className="w-full rounded-xl border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring"
            >
              {availableItems.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
