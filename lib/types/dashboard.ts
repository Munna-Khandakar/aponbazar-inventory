export type Metric = {
  id: string
  label: string
  value: string
  trend: string
  trendDirection: "up" | "down"
}

export type Reminder = {
  id: number
  title: string
  dueDate: string
}

export type Insight = {
  id: number
  title: string
  description: string
  status: "new" | "in-progress" | "done"
}

export type Alert = {
  id: number
  message: string
  severity: "low" | "medium" | "high"
  createdAt: string
}
