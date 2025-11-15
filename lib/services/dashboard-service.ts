import type { Alert, Insight, Metric, Reminder } from "@/lib/types/dashboard"

const metrics: Metric[] = [
  { id: "revenue", label: "Monthly revenue", value: "$128.4k", trend: "+12.4%", trendDirection: "up" },
  { id: "orders", label: "Orders fulfilled", value: "982", trend: "+4.1%", trendDirection: "up" },
  { id: "returns", label: "Returns", value: "32", trend: "-2.3%", trendDirection: "down" },
  { id: "nps", label: "Customer NPS", value: "67", trend: "+3pts", trendDirection: "up" },
]

const reminders: Reminder[] = [
  { id: 1, title: "Ship wholesale order #1042", dueDate: "Today, 5:30 PM" },
  { id: 2, title: "Reconcile payout batch", dueDate: "Tomorrow, 9:00 AM" },
  { id: 3, title: "Inventory count for West Hub", dueDate: "Fri, 2:00 PM" },
]

const insights: Insight[] = [
  {
    id: 1,
    title: "Subscriptions up 18%",
    description: "Consider unlocking the new retention campaign to keep the cohort engaged.",
    status: "new",
  },
  {
    id: 2,
    title: "Logistics SLA slipping",
    description: "Average fulfillment time exceeded target by 14 minutes across two hubs.",
    status: "in-progress",
  },
  {
    id: 3,
    title: "Checkout revamp shipped",
    description: "Monitor conversion impact throughout the next two deploy windows.",
    status: "done",
  },
]

const pageOneTasks: Insight[] = [
  {
    id: 1,
    title: "Sync supplier pricing",
    description: "Upload the revised wholesale catalog before the next cut-off window.",
    status: "in-progress",
  },
  {
    id: 2,
    title: "Approve marketing assets",
    description: "Final review for the Eid promotion tiles destined for the hero section.",
    status: "new",
  },
  {
    id: 3,
    title: "Archive stale SKUs",
    description: "Hide 12 products with zero sales volume in the last quarter.",
    status: "done",
  },
]

const alerts: Alert[] = [
  {
    id: 1,
    message: "Payment gateway latency exceeded 400ms for 8 minutes.",
    severity: "medium",
    createdAt: "Today • 09:24 AM",
  },
  {
    id: 2,
    message: "Bulk import failed for merchant Orion Foods.",
    severity: "high",
    createdAt: "Today • 07:13 AM",
  },
  {
    id: 3,
    message: "Security patch available for reporting microservice.",
    severity: "low",
    createdAt: "Yesterday • 05:41 PM",
  },
]

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const dashboardService = {
  getStats: async () => clone({ metrics, reminders, insights }),
  getPageOneItems: async () => clone({ items: pageOneTasks }),
  getPageTwoAlerts: async () => clone({ alerts }),
}
