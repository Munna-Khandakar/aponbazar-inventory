# Repository Guidelines

## Project Structure & Module Organization
This workspace uses the Next.js App Router: `app/layout.tsx` holds the shared shell while routes under `app/` (currently `app/page.tsx`) manage their own server component trees. Shared primitives live in `components/ui/`, feature composites in `components/`, hooks in `hooks/`, and helpers such as `lib/utils.ts` in `lib/`. Place logos, favicons, and Lottie files inside `public/`. Tailwind tokens sit in `app/globals.css`, and `components.json` keeps shadcn generators aligned with the `@/*` aliases defined in `tsconfig.json`.

## Build, Test, and Development Commands
- `npm run dev` – Launch the hot-reloading dev server at http://localhost:3000.
- `npm run build` – Generate the production bundle; run before every PR to catch type or route regressions.
- `npm run start` – Serve the compiled `.next` output for production parity checks.
- `npm run lint` – Run the TypeScript-aware ESLint config (`eslint.config.mjs`).

## Coding Style & Naming Conventions
Use strict TypeScript with 2-space indentation and keep components small and pure. Component files are PascalCase (`DashboardHero.tsx`); hooks follow `useCamelCase` inside `hooks/`; utilities export lowercase helpers from `lib/`. Import via `@/*` aliases, and compose styling with Tailwind classes plus tokens from `globals.css` (inline styles only for vendor embeds). ESLint and editor-integrated Prettier guard formatting—lint before committing.

## Testing Guidelines
The repo currently lacks tests, so every feature should add coverage where practical. Co-locate React specs as `ComponentName.test.tsx` next to the component or in a sibling `__tests__/` folder, and use Vitest with React Testing Library (add the deps the first time they are needed). Library helpers should receive `.spec.ts` files in `lib/`. Run `npm run lint` and `npm run build` on each change; once Vitest is configured, gate PRs with `npx vitest run`.

## Commit & Pull Request Guidelines
Write short, imperative commit messages scoped by feature (e.g., `feat: add KPI chart card`) and keep diffs focused (~150 LOC). Pull requests must include a summary paragraph, a linked Linear/Jira issue or `Fixes #id`, light/dark screenshots for UI work, and a checklist covering `dev`, `build`, `lint`, and any tests executed. Flag breaking changes explicitly and request review from another contributor before merging.

## Security & Configuration Tips
Store API keys and secrets in `.env.local` (ignored by git) and document any required vars in the PR description. Never commit credentials; rotate and note when tokens change. Wrap third-party embeds with `next/script` and record CSP or configuration updates in the PR when applicable.
