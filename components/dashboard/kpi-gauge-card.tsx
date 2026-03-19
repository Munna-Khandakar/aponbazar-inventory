import { KpiMetricType, type KpiMetricDataset } from "@/lib/types/kpi-metric"
import { cn } from "@/lib/utils"

type ToneStyles = {
  panel: string
  value: string
  pill: string
}

type KpiMetricConfig = {
  label: string
  valuePrefix?: string
  formatValue: (value: number) => string
  styles: ToneStyles
}

const metricConfig: Record<KpiMetricType, KpiMetricConfig> = {
  [KpiMetricType.ACTUAL_SALES]: {
    label: "Actual Sales",
    valuePrefix: "BDT",
    formatValue: (value) => `${value.toFixed(2)} M`,
    styles: {
      panel: "border-emerald-200 bg-emerald-50/80",
      value: "text-emerald-700",
      pill: "border-emerald-200 bg-emerald-100 text-emerald-700",
    },
  },
  [KpiMetricType.PREDICTED_SALES]: {
    label: "Targeted Sales",
    valuePrefix: "BDT",
    formatValue: (value) => `${value.toFixed(2)} M`,
    styles: {
      panel: "border-violet-200 bg-violet-50/80",
      value: "text-violet-700",
      pill: "border-violet-200 bg-violet-100 text-violet-700",
    },
  },
  [KpiMetricType.GROWTH_TARGET]: {
    label: "Growth Target",
    formatValue: (value) => `${value}%`,
    styles: {
      panel: "border-fuchsia-200 bg-fuchsia-50/80",
      value: "text-fuchsia-700",
      pill: "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700",
    },
  },
  [KpiMetricType.FORECAST_ACCURACY]: {
    label: "Forecast Accuracy",
    formatValue: (value) => `${value}%`,
    styles: {
      panel: "border-sky-200 bg-sky-50/80",
      value: "text-sky-700",
      pill: "border-sky-200 bg-sky-100 text-sky-700",
    },
  },
}

export interface KpiGaugeCardProps {
  metric: KpiMetricDataset
  sliderValue?: number
  onSliderChange?: (value: number) => void
}

export function KpiGaugeCard(props: KpiGaugeCardProps) {
  const { metric, sliderValue, onSliderChange } = props
  const config = metricConfig[metric.metricType]
  const styles = config.styles
  const isGrowthTargetSlider =
    metric.metricType === KpiMetricType.GROWTH_TARGET &&
    sliderValue !== undefined &&
    onSliderChange !== undefined

  return (
    <article className={cn("flex h-full flex-col rounded-xl border p-4 sm:p-5", styles.panel)}>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">{config.label}</p>
          {config.valuePrefix ? (
            <p className="text-xs uppercase tracking-wide text-slate-500">{config.valuePrefix}</p>
          ) : null}
          <p className={cn("text-2xl font-semibold tracking-tight", styles.value)}>
            {config.formatValue(metric.valueText)}
          </p>
        </div>

        {isGrowthTargetSlider ? (
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={sliderValue}
              onChange={(event) => onSliderChange(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-fuchsia-200 accent-fuchsia-500"
              aria-label="Growth Target"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>
        ) : null}

      </div>
    </article>
  )
}
