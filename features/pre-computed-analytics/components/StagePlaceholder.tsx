import type { LucideIcon } from "lucide-react"
import { Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  title: string
  description?: string
  /** Which backend delivery stage will populate this section. */
  stage: string
  detail?: string
  icon?: LucideIcon
  minHeight?: number
}

/**
 * Card-sized "coming soon" placeholder used for D0 sections whose backend data
 * is not delivered yet (Stage 2/3/4). Keeps the grid layout intact.
 */
export function StagePlaceholder({
  title,
  description,
  stage,
  detail,
  icon: Icon = Sparkles,
  minHeight = 220,
}: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          <span className="shrink-0 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {stage}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center"
          style={{ minHeight }}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icon size={18} />
          </span>
          <p className="text-sm font-medium text-foreground">Coming soon</p>
          <p className="max-w-[26rem] text-xs text-muted-foreground">
            {detail ?? `This section is awaiting backend data (${stage}).`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
