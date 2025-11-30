# Implementation Review

This review highlights blockers that prevent the landing app from running end-to-end and suggests concrete fixes.

## 1) Supabase dependency currently hard-fails the UI
- `src/lib/appeals.ts`, `src/lib/integrations.ts`, and `src/lib/settings.ts` throw when Supabase is not configured. The landing README calls out that database integration is optional, but these helpers reject immediately, so authenticated pages crash/log errors in demo environments.
- `src/lib/supabase.ts` already warns when credentials are missing, so the client layer is aware of the optional state.

**Suggestion:** Gate each data helper behind `isSupabaseConfigured()` and surface a UX fallback (e.g., demo data, empty states plus setup guidance). That keeps the dashboard usable without a database and matches the documented “graceful fallback” behavior.

## 2) Appeals list cannot submit
- The actions menu in `src/pages/app/AppealsPage.tsx` still has a TODO for “Submit Appeal,” so users cannot advance an appeal from the grid.
- A fully implemented `submitAppeal()` helper already exists in `src/lib/appeals.ts`, but the UI never calls it.

**Suggestion:** Wire the menu action to `submitAppeal` (or a mutation hook) and refresh the table/stats after success. Add error handling that explains when Supabase is not configured.

## 3) Claims table edit action is a dead end
- The overflow action in `src/pages/app/ClaimsPage.tsx` contains a TODO and doesn’t route anywhere. There is no edit route, so the button does nothing and misleads users.

**Suggestion:** Either link the action to `ClaimDetailPage` with an "Edit" mode flag or replace it with a contextual menu that exposes the operations already supported (e.g., status updates, assign, create appeal).

## 4) Linting currently fails CI
- `npm run lint` stops with 48 warnings (missing dependencies in `useEffect`, many `any` types, and React Fast Refresh warnings) because the script enforces `--max-warnings 0`.

**Suggestion:** Triage the warnings into categories and fix them (typing props/events, completing dependency arrays, moving non-component exports). Until then, CI will continue to fail and block deployments.

Addressing the Supabase guards plus the two UI TODOs will unblock critical workflows; the lint cleanup will stabilize the build pipeline.
