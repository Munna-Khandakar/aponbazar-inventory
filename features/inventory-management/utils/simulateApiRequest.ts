import type { MockApiError } from "@/features/inventory-management/types/MockApiError"
import type { SimulateApiRequestOptions } from "@/features/inventory-management/types/SimulateApiRequestOptions"

const DEFAULT_MIN_DELAY_MS = 2000
const DEFAULT_MAX_DELAY_MS = 3000

const sleep = async (durationMs: number) => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs)
  })
}

const randomBetween = (minValue: number, maxValue: number) => {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export const simulateApiRequest = async <T>(
  payload: T,
  options: SimulateApiRequestOptions = {}
): Promise<T> => {
  const minDelayMs = options.minDelayMs ?? DEFAULT_MIN_DELAY_MS
  const maxDelayMs = options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS
  const errorRate = options.errorRate ?? 0
  const forceError = options.forceError ?? false
  const delayMs = randomBetween(minDelayMs, maxDelayMs)

  await sleep(delayMs)

  if (forceError || Math.random() < errorRate) {
    const error: MockApiError = {
      message: options.errorMessage ?? "Request failed. Please try again.",
      statusCode: 500,
    }

    throw new Error(`${error.statusCode}: ${error.message}`)
  }

  return clone(payload)
}
