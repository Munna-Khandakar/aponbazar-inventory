# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` – Start development server at http://localhost:3000 with hot reloading
- `npm run build` – Create production bundle (run before pushing to catch errors)
- `npm run start` – Serve optimized production build
- `npm run lint` – Run ESLint with Next.js + TypeScript config

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: shadcn/ui components (New York style) + Tailwind CSS v4
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Authentication Flow
The app uses a **client-side localStorage-based auth system**:
1. Login credentials are validated by `authService.login()` in `lib/services/auth-service.ts` (currently hardcoded demo credentials)
2. Auth payload (access_token, refresh_token, user) is stored via `lib/auth-storage.ts`
3. Protected routes use `useRequireAuth()` hook which redirects to `/login` if no auth found
4. Dashboard layout (`app/dashboard/layout.tsx`) wraps all dashboard routes with auth checking

**Important**: Auth is currently mock/demo only. When integrating real API:
- Update `authService.login()` to call real endpoint via `apiClient`
- Add token refresh logic
- Implement server-side session validation

### Data Layer Pattern
All data fetching follows this structure:
1. **Service layer** (`lib/services/`) – Contains async functions that return data (currently mock data)
2. **React Query hooks** (`hooks/use-dashboard.ts`) – Wrap services with `useQuery` for caching/state
3. **Components** – Call hooks and render data

Example:
```ts
// Service
dashboardService.getStats() → Promise<{metrics, reminders, insights}>

// Hook
useDashboardStats() → useQuery wrapping the service

// Component
const { data } = useDashboardStats()
```

When adding real API endpoints:
- Keep services in `lib/services/`
- Use `apiClient` from `lib/api-client.ts` (pre-configured Axios instance)
- API base URL configured via `NEXT_PUBLIC_API_BASE_URL` env var

### Routing Structure
- `/` – Landing/home page
- `/login` – Login form (uses `authService`)
- `/dashboard` – Protected dashboard layout with:
  - `/dashboard` (index) – Main metrics/insights view
  - `/dashboard/page1` – Additional tasks view
  - `/dashboard/page2` – Alerts view

Dashboard routes share a layout (`app/dashboard/layout.tsx`) with sticky sidebar navigation.

### Component Organization
- `components/ui/` – Reusable primitives from shadcn/ui (button, card, input, label, chart)
- `components/dashboard/` – Dashboard-specific composed components (metric-card, alert-list, etc.)
- Co-locate domain logic with components when possible

### Path Aliases
All configured in `tsconfig.json` and `components.json`:
- `@/components` → `./components`
- `@/lib` → `./lib`
- `@/hooks` → `./hooks`
- `@/ui` → `./components/ui`

Always use aliases instead of relative imports.

### Styling Approach
- Tailwind utility classes for all styling
- Theme tokens defined in `app/globals.css`
- Use `cn()` utility from `lib/utils.ts` for conditional classes
- Components use `class-variance-authority` for variants (see button.tsx)

### Adding shadcn/ui Components
Run: `npx shadcn@latest add <component-name>`

This uses settings from `components.json` to maintain consistent aliases and style.

## Key Files & Their Purpose

- `app/providers.tsx` – Sets up QueryClientProvider for React Query
- `lib/api-client.ts` – Configured Axios instance for API calls
- `lib/auth-storage.ts` – localStorage helpers for auth persistence
- `hooks/use-auth.ts` – Auth hooks (`useAuth`, `useRequireAuth`)
- `hooks/use-dashboard.ts` – React Query hooks for dashboard data

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` – API endpoint base URL (defaults to "https://placeholder.api")

## Code Style (from AGENTS.md)

- TypeScript everywhere with `strict` mode
- 2-space indentation
- Component files: PascalCase (`SalesChart.tsx`)
- Hooks: `useCamelCase` pattern in `hooks/` directory
- Utilities: lowercase function exports in `lib/`
- Small, pure React components
- Always import via path aliases

## Testing

No test setup currently exists. When adding tests:
- Use React Testing Library + Vitest
- Co-locate as `ComponentName.test.tsx` or in `__tests__/` folders
- Add `.spec.ts` for utility/lib testing

## Commit Conventions

- Use imperative mood with scope: `feat: add KPI chart card`
- Keep commits under ~150 lines when possible
- PRs should include:
  - One-paragraph summary
  - Screenshots for UI changes (light/dark if applicable)
  - Checklist of commands run (`dev`, `build`, `lint`)

## Important Notes

1. **Demo data is hardcoded** in service files – replace with real API calls when backend is ready
2. **Auth is localStorage-based** – no server-side validation currently
3. **No tests exist yet** – add testing infrastructure with first test contribution
4. Run `npm run build` before every PR to catch type/build errors early