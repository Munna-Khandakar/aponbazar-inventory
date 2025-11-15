# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router workspace: `app/layout.tsx` defines shared shells, while each route (for now `app/page.tsx`) owns its own server component tree. Shared UI lives in `components/ui/` (shadcn-style primitives such as `button.tsx`, `card.tsx`, `chart.tsx`), and cross-cutting helpers stay in `lib/utils.ts`. Static assets (logos, favicons, Lottie files) belong in `public/`. Tailwind and animation tokens are centralized in `app/globals.css`, driven by `components.json` so that new components generated with `npx shadcn-ui@latest` inherit the same aliases defined in `tsconfig.json` (`@/*`).

## Build, Test, and Development Commands
- `npm run dev` – Starts the Next.js dev server with hot reloading on http://localhost:3000.
- `npm run build` – Creates the production bundle; run locally before pushing to catch type or route errors.
- `npm run start` – Serves the optimized build (useful for verifying Vercel parity).
- `npm run lint` – Runs the Next + TypeScript ESLint config; lint before every PR.

## Coding Style & Naming Conventions
Use TypeScript everywhere (`allowJs` is on only for gradual adoption) and keep `strict` clean. Favor 2-space indentation and small, pure React components. Component files are PascalCase (`SalesChart.tsx`), hooks go in `hooks/` (add the folder if missing) with `useCamelCase` names, and utilities in `lib` export lowercase functions. Compose styling through Tailwind utility classes plus theme tokens defined in `globals.css`; fall back to inline styles only for one-off vendor embeds. Always import via aliases (`@/components/ui/button`).

## Testing Guidelines
The repo does not yet ship automated tests, so new contributions should introduce them alongside features. Co-locate component specs as `ComponentName.test.tsx` next to their source or inside a `__tests__` folder, and use React Testing Library plus Vitest (add the dependency the first time). For data helpers, prefer `.spec.ts` files under `lib/`. Every testable change should at least run `npm run lint` and `npm run build` before submission.

## Commit & Pull Request Guidelines
History currently only shows the scaffold message `Initial commit from Create Next App`; continue using short, imperative messages that mention the scope (e.g., `feat: add KPI chart card`). Bundle related work and keep commits under ~150 lines when possible. PRs must include: a one-paragraph summary, linked Linear/Jira issue or `Fixes #id`, screenshots for UI updates (light/dark), and a checklist of commands executed (`dev`, `build`, `lint`, tests). Label breaking changes clearly and request review from another contributor before merging.
