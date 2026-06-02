import { Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ReportSectionStateProps = {
  title: string
  description: string
  message: string
  isLoading?: boolean
  className?: string
}

export function ReportSectionState({
  title,
  description,
  message,
  isLoading = false,
  className,
}: ReportSectionStateProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-44 items-center justify-center text-sm text-muted-foreground">
        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        {message}
      </CardContent>
    </Card>
  )
}
