import { KpiMetricType, type KpiMetricDataset } from "@/lib/types/kpi-metric"
import { cn } from "@/lib/utils"

type KpiCardType = "gauge" | "progress"

type ToneStyles = {
  panel: string
  track: string
  indicator: string
  marker: string
  value: string
  pill: string
}

type KpiMetricConfig = {
  label: string
  type: KpiCardType
  valuePrefix?: string
  formatValue: (value: number) => string
  styles: ToneStyles
}

const metricConfig: Record<KpiMetricType, KpiMetricConfig> = {
  [KpiMetricType.ACTUAL_SALES]: {
    label: "Actual Sales",
    type: "gauge",
    valuePrefix: "BDT",
    formatValue: (value) => `${value.toFixed(2)} M`,
    styles: {
      panel: "border-emerald-200 bg-emerald-50/80",
      track: "stroke-emerald-200",
      indicator: "stroke-emerald-500",
      marker: "fill-emerald-500",
      value: "text-emerald-700",
      pill: "border-emerald-200 bg-emerald-100 text-emerald-700",
    },
  },
  [KpiMetricType.PREDICTED_SALES]: {
    label: "Predicted Sales",
    type: "gauge",
    valuePrefix: "BDT",
    formatValue: (value) => `${value.toFixed(2)} M`,
    styles: {
      panel: "border-violet-200 bg-violet-50/80",
      track: "stroke-violet-200",
      indicator: "stroke-violet-500",
      marker: "fill-violet-500",
      value: "text-violet-700",
      pill: "border-violet-200 bg-violet-100 text-violet-700",
    },
  },
  [KpiMetricType.GROWTH_TARGET]: {
    label: "Growth Target",
    type: "progress",
    formatValue: (value) => `${value}%`,
    styles: {
      panel: "border-fuchsia-200 bg-fuchsia-50/80",
      track: "stroke-fuchsia-200",
      indicator: "stroke-fuchsia-500",
      marker: "fill-fuchsia-500",
      value: "text-fuchsia-700",
      pill: "border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700",
    },
  },
  [KpiMetricType.FORECAST_ACCURACY]: {
    label: "Forecast Accuracy",
    type: "gauge",
    formatValue: (value) => `${value}%`,
    styles: {
      panel: "border-sky-200 bg-sky-50/80",
      track: "stroke-sky-200",
      indicator: "stroke-sky-500",
      marker: "fill-sky-500",
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

const clampPercentage = (value: number) => Math.max(0, Math.min(100, value))

function GaugeIndicator({ progressValue, tone }: { progressValue: number; tone: ToneStyles }) {
  const safeProgress = clampPercentage(progressValue)

  return (
    <svg viewBox="0 0 100 56" aria-hidden="true" className="h-20 w-full max-w-[180px]">
      <path
        d="M8 48 A42 42 0 0 1 92 48"
        pathLength={100}
        className={cn("fill-none stroke-[8]", tone.track)}
      />
      <path
        d="M8 48 A42 42 0 0 1 92 48"
        pathLength={100}
        strokeDasharray={`${safeProgress} 100`}
        className={cn("fill-none stroke-[8] stroke-linecap-round", tone.indicator)}
      />
    </svg>
  )
}

function ProgressIndicator({ progressValue, tone }: { progressValue: number; tone: ToneStyles }) {
  const safeProgress = clampPercentage(progressValue)
  const knobX = 8 + safeProgress * 0.84

  return (
    <svg viewBox="0 0 100 14" aria-hidden="true" className="h-6 w-full">
      <line
        x1="8"
        y1="7"
        x2="92"
        y2="7"
        pathLength={100}
        className={cn("stroke-[3] stroke-linecap-round", tone.track)}
      />
      <line
        x1="8"
        y1="7"
        x2="92"
        y2="7"
        pathLength={100}
        strokeDasharray={`${safeProgress} 100`}
        className={cn("stroke-[3] stroke-linecap-round", tone.indicator)}
      />
      <circle cx={knobX} cy="7" r="3" className={tone.marker} />
    </svg>
  )
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
    <article className={cn("flex flex-col rounded-xl border p-4 sm:p-5", styles.panel)}>
      <p className="text-sm font-medium text-slate-700">{config.label}</p>

      <div className="mt-4 flex grow flex-col justify-between">
        <div className="space-y-3">
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
          ) : config.type === "gauge" ? (
            <GaugeIndicator progressValue={metric.progressValue} tone={styles} />
          ) : (
            <ProgressIndicator progressValue={metric.progressValue} tone={styles} />
          )}

          <div className="space-y-1">
            {config.valuePrefix ? (
              <p className="text-xs uppercase tracking-wide text-slate-500">{config.valuePrefix}</p>
            ) : null}
            <p className={cn("text-2xl font-semibold tracking-tight", styles.value)}>
              {config.formatValue(metric.valueText)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
