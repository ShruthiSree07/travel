# Database Details — CalcVerse

**There is no database in this app.**

CalcVerse is fully stateless: every calculator (`lib/domains.ts` lists all 8) computes its result client-side from whatever the user types into the form on that page. No data is persisted, sent to a server, or stored between visits — not in a SQL/NoSQL database, not in cookies, not in `localStorage`.

## Why

- Every calculation is a pure function of its inputs (see `app/*/**/page.tsx` — each uses `useMemo` to derive results from local `useState` form fields).
- There's no user account, no saved history, no server-side API route in this app at all.
- This was a deliberate scope decision, not an oversight — see the roadmap audit (`/code/artifact/b085a7b0-d1d5-45a5-8f0c-340a3a07be54`) which lists "recent/favorite calculators via localStorage" as a proposed **future** feature. If that ships, it would be the first persistence layer this app has — client-side only (`localStorage`), still no server-side database.

## If persistence is added later

Any future data layer should be documented here with: engine (e.g. Postgres/SQLite/localStorage), schema/tables, where it's hosted, and backup strategy — following the same shape used for the earlier WanderFive project's ops runbook. As of this writing, none of that applies because there is nothing to persist.
