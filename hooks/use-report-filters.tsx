"use client"

import {
  useCallback,
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

export type DateMode = "30d" | "90d" | "custom"

type ReportFiltersContextValue = {
  dateMode: DateMode
  setDateMode: Dispatch<SetStateAction<DateMode>>
  startDate: string
  setStartDate: Dispatch<SetStateAction<string>>
  endDate: string
  setEndDate: Dispatch<SetStateAction<string>>
  growthTarget: string
  setGrowthTarget: Dispatch<SetStateAction<string>>
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  setPresetRange: (mode: Exclude<DateMode, "custom">) => void
  setCustomRange: () => void
}

const ReportFiltersContext = createContext<ReportFiltersContextValue | null>(null)

const formatDateInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getToday = () => new Date()

const getTodayValue = () => formatDateInputValue(getToday())
const defaultStartDate = "2025-10-01"
const defaultEndDate = "2026-03-15"

const getDateBeforeValue = (days: number) => {
  const base = getToday()
  base.setDate(base.getDate() - days)
  return formatDateInputValue(base)
}

export function ReportFiltersProvider({ children }: { children: ReactNode }) {
  const [dateMode, setDateMode] = useState<DateMode>("custom")
  const [startDate, setStartDate] = useState(defaultStartDate)
  const [endDate, setEndDate] = useState(defaultEndDate)
  const [growthTarget, setGrowthTarget] = useState("8")
  const [searchTerm, setSearchTerm] = useState("")

  const setPresetRange = useCallback((mode: Exclude<DateMode, "custom">) => {
    setDateMode(mode)
    setEndDate(getTodayValue())
    setStartDate(mode === "30d" ? getDateBeforeValue(29) : getDateBeforeValue(89))
  }, [])

  const setCustomRange = useCallback(() => {
    setDateMode("custom")
    setStartDate(defaultStartDate)
    setEndDate(defaultEndDate)
  }, [])

  const value = useMemo<ReportFiltersContextValue>(
    () => ({
      dateMode,
      setDateMode,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      growthTarget,
      setGrowthTarget,
      searchTerm,
      setSearchTerm,
      setPresetRange,
      setCustomRange,
    }),
    [
      dateMode,
      startDate,
      endDate,
      growthTarget,
      searchTerm,
      setPresetRange,
      setCustomRange,
    ]
  )

  return (
    <ReportFiltersContext.Provider value={value}>
      {children}
    </ReportFiltersContext.Provider>
  )
}

export function useReportFilters() {
  const context = useContext(ReportFiltersContext)

  if (!context) {
    throw new Error("useReportFilters must be used within a ReportFiltersProvider")
  }

  return context
}
