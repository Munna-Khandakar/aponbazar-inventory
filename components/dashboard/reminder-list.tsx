"use client"

import { CalendarClock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Reminder } from "@/lib/types/dashboard"

type ReminderListProps = {
  reminders: Reminder[]
  className?: string
}

export const ReminderList = ({ reminders, className }: ReminderListProps) => {
  return (
    <Card className={cn("border-border/70", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-primary" size={18} />
          <CardTitle className="text-base">Upcoming reminders</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">{reminders.length} scheduled</span>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2">
            <div>
              <p className="text-sm font-medium">{reminder.title}</p>
              <p className="text-xs text-muted-foreground">{reminder.dueDate}</p>
            </div>
            <span className="text-xs font-semibold text-primary">Due</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
