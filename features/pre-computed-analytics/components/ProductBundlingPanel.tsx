import { Package } from "lucide-react"

import { StagePlaceholder } from "./StagePlaceholder"

export function ProductBundlingPanel() {
  return (
    <StagePlaceholder
      title="Product Bundling / Discounting Insights"
      description="Top Bundles with Potential Lift"
      stage="Stage 4"
      icon={Package}
      detail="Bundle and discount recommendations are planned for Stage 4."
    />
  )
}
