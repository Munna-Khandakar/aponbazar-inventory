export const preComputedQueryKeys = {
  all: ["pre-computed-analytics"] as const,
  dashboard: (shopName: string) =>
    ["pre-computed-analytics", "dashboard", shopName] as const,
}
