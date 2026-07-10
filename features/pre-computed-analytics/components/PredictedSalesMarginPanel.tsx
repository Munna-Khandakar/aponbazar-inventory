import { PieChart } from "lucide-react"

import { StagePlaceholder } from "./StagePlaceholder"

export function PredictedSalesMarginPanel() {
  return (
    <StagePlaceholder
      title="Predicted Sales & Margin"
      description="Current Month · All Outlets"
      stage="Stage 3"
      icon={PieChart}
      detail="Predicted sales and margin need a cost/COGS source that isn't available yet. This panel will populate in Stage 3."
    />
  )
}
