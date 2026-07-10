import { Users } from "lucide-react"

import { StagePlaceholder } from "./StagePlaceholder"

/**
 * Stage 2 — the backend currently returns only raw per-customer rows
 * (`customerCluster`). The named 6-segment donut is delivered in Stage 2, so we
 * render a placeholder rather than segmenting the raw rows on the client.
 */
export function CustomerClusterSection() {
  return (
    <StagePlaceholder
      title="Consumer Cluster Definition"
      description="Key Customer Segments"
      stage="Stage 2"
      icon={Users}
      detail="Named customer segments and the total-customers donut are delivered in Stage 2. Raw customer rows are not segmented on the client yet."
    />
  )
}
