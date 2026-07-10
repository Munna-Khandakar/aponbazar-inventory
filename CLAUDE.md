# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` – Start development server at http://localhost:3000 with hot reloading
- `npm run build` – Create production bundle (run before pushing to catch type/build errors)
- `npm run start` – Serve optimized production build
- `npm run lint` – Run ESLint (Next.js + TypeScript config)

There is no test runner configured yet.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **UI**: shadcn/ui (New York style) + Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Server state**: TanStack Query v5 (React Query)
- **Forms**: React Hook Form
- **Charts**: Recharts
- **HTTP**: Axios (single shared instance)
- **Icons**: Lucide React

## Architecture Overview

### Two coexisting architectural patterns

This codebase is mid-migration. New work follows the **feature-module** pattern; the original dashboard still uses the **legacy `lib/services` + `hooks/use-dashboard.ts`** pattern. Know which one you're touching.

**1. Feature modules (`features/<feature>/`) — preferred for all new work.**
Each feature is a self-contained vertical slice:
```
features/<feature>/
  api/          # axios calls → return typed responses (e.g. customer-behavior.api.ts)
  hooks/        # useQuery wrappers, one hook per report/chart
  query-keys/   # centralized query key factory object
  types/        # one type per file (request/response envelopes, row shapes, props)
  utils/        # adapters (API row → view model), formatters
  components/   # feature UI; a *PageContainer.tsx composes the page
  charts/       # (inventory-management) Recharts wrappers
  mocks/        # (inventory-management) static fixtures for mock-api
```
Existing features: `customer-behavior`, `inventory-management`, `pre-computed-analytics`.
Data flow per feature: **api → hook (`useQuery` + `select` to adapt rows) → PageContainer → components**. The route file under `app/dashboard/<route>/page.tsx` just renders the `PageContainer`.

**2. Legacy dashboard (`lib/services/dashboard-service.ts` + `hooks/use-dashboard.ts`).**
Powers the index dashboard and sales-prediction page. `use-dashboard.ts` mixes two kinds of hooks:
- **Real report hooks** (`useSalesForecast`, `useInventoryOverview`, `useStorePerformance`, etc.) — call `dashboardService`, which hits the live API.
- **`createStaticHook(...)` hooks** (`useDashboardStats`, `useCustomerSegments`, `useMonthlyGoals`, etc.) — synchronously return **hardcoded mock data** from `dashboard-service.ts`. These are placeholders still awaiting a real endpoint. Treat any `createStaticHook` hook as mock.

### Backend: the `/api/reports/execute` convention

Most data comes from **one POST endpoint**, `/api/reports/execute`, driven by a `reportName`:
```ts
apiClient.post("/api/reports/execute", {
  reportName,                          // e.g. "customer_topline_overview", "inventory_big_block"
  parameters?,                         // { startDate, endDate, shopName, growthTarget, bigBlock, ... }
  page?, size?,                        // paginated reports (inventory uses size 200 + fetches remaining pages)
})
```
- Legacy report names live in the `SalesReportType` enum (`lib/types/report.ts`); feature report names are string-literal unions inside each feature's `*.api.ts`.
- Responses are **envelopes**: check `data.success` / presence of `data` and `throw new Error(...)` on failure — every api module does this. The unwrapped rows are typically at `data.data.data`.
- Some reports return either a **paginated `data[]` shape or a `series` shape** (see inventory `isInventory*SeriesResponse` type guards + `adaptInventory*` utils that normalize one into the other).
- The **pre-computed** feature is the exception: it uses `GET /api/dashboard/summary`, not `/reports/execute`.
- `inventory-management` also ships a **mock api** (`inventory-management.mock-api.ts` + `simulateApiRequest.ts`) with artificial latency and an injectable error rate (`NEXT_PUBLIC_INVENTORY_MOCK_ERROR_RATE`) for building/testing loading & error states.

### Shared report filters (`hooks/use-report-filters.tsx`)

`ReportFiltersProvider` wraps the dashboard layout and exposes `useReportFilters()`: `startDate`, `endDate`, `dateMode` (preset month ranges or custom), `growthTarget`, `searchTerm`, and `shopName`. **`shopName` is persisted in the URL query string** (`?shopName=...`) via `router.replace`, so it survives navigation and deep-links; everything else is in-memory React state. Data hooks read these filters and fold them into request `parameters` / query keys, so changing a filter refetches. Query keys generally look like `["reports", reportName, parameters, page, size]`; feature modules use their own key factories (e.g. `customerBehaviorQueryKeys`).

Standard query options across the app: `staleTime: 5 min`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`, and `placeholderData: keepPrevious` on filtered report hooks.

### Authentication (mock / client-side only)

- `authService.login()` (`lib/services/auth-service.ts`) validates **hardcoded demo credentials** (`admin@gmail.com` / `qwer@1234`) — no backend call.
- Auth payload persists to `localStorage` via `lib/auth-storage.ts`.
- `useRequireAuth()` (`hooks/use-auth.ts`) guards routes and redirects to `/login`; the dashboard layout gates all `/dashboard/*` routes on it.
- When wiring real auth: replace `authService.login` with an `apiClient` call, add token refresh, and add server-side validation. The `apiClient` currently sends no auth header.

### Routing

- `/` – landing, `/login` – login form
- `/dashboard` (layout-wrapped, auth-gated):
  - `/dashboard` – index metrics/insights (largely legacy + mock hooks)
  - `/dashboard/sales-prediction` – sales forecasting / KPI comparison (legacy report hooks)
  - `/dashboard/inventory-management` – feature module
  - `/dashboard/customer-behavior` – feature module
  - `/dashboard/pre-computed` – feature module (`/api/dashboard/summary`)

The dashboard layout (`app/dashboard/layout.tsx`) renders `DashboardTopbar` + a sticky `DashboardRightSidebar` around the page content, and switches the sidebar's shop-snapshot target by pathname. Navigation links are centralized in `components/dashboard/dashboard-nav.tsx` — update the `links` array when adding a route.

### Component organization

- `components/ui/` – shadcn/ui primitives
- `components/dashboard/` – shared/legacy dashboard components (topbar, sidebar, charts, tables, skeletons)
- Feature-specific components live under `features/<feature>/components/` — keep new feature UI there, not in `components/dashboard/`.

## Conventions

- **Path aliases only** (no relative imports across dirs): `@/components`, `@/lib`, `@/hooks`, `@/ui`, and `@/features/...`. Configured in `tsconfig.json` / `components.json`.
- **One type per file** under `features/<feature>/types/`, named after the type (PascalCase filename).
- API modules always narrow the envelope and `throw new Error` on `!success` / `error` — follow this so React Query surfaces `isError`.
- Adapt API rows to view models inside the hook's `select` (or a `utils/adapt*.ts`), not in components.
- TypeScript strict mode, 2-space indent. Components PascalCase; hooks `useX` in `hooks/` or `features/*/hooks`; lib utilities lowercase exports.
- Use `cn()` (`lib/utils.ts`) for conditional classes; variants via `class-variance-authority`.
- Add shadcn components with `npx shadcn@latest add <name>`.

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` – API base. Default in code is `https://apon-report.duckdns.org`; `.env.local` currently points at the Railway deployment. Override in `.env.local` for local backends.
- `NEXT_PUBLIC_INVENTORY_MOCK_ERROR_RATE` – 0–1 error injection rate for the inventory mock api (default 0).

## Key Files

- `lib/api-client.ts` – shared Axios instance (reads `NEXT_PUBLIC_API_BASE_URL`)
- `lib/types/report.ts` – `SalesReportType` enum + report request/response envelope types
- `app/providers.tsx` – `QueryClientProvider` setup
- `hooks/use-report-filters.tsx` – global report filter context (dates, growthTarget, shopName-in-URL)
- `hooks/use-auth.ts` – `useAuth` / `useRequireAuth`
- `hooks/use-dashboard.ts` – legacy dashboard hooks (mix of live report hooks and `createStaticHook` mocks)

## Commit Conventions

- Imperative mood with scope: `feat: add KPI chart card`
- PRs: one-paragraph summary, screenshots for UI changes, and the commands run (`dev`, `build`, `lint`). Run `npm run build` before every PR to catch type errors.