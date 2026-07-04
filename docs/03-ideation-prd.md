# PRD — WanderFive

### Name
WanderFive

### Elevator pitch
WanderFive turns a single location into 5 curated places worth visiting, presented as clean, polished cards in under a second. It's a zero-config utility for anyone who wants a fast, opinionated shortlist instead of a multi-tab research session.

### Chosen variant
`tier_recommended`

### Tech stack (one-line)
Python 3.12 + FastAPI + Jinja2/HTMX (server-rendered) · bundled design system CSS · no database · self-host / any VPS

### Architectural posture
A monolith, single-process web app — one route renders the search page, one route handles the search submission and returns an HTML fragment (HTMX swap) with the 5 result cards. No background jobs, no realtime, no mobile app — web-first, request/response only. Matches `tier_recommended`'s lean stack family.

**Data shape:** No persisted data at all. The only "data" is the ephemeral request (location string in) and response (5 place objects out) — nothing is stored.

**Integration footprint:** Optionally the Anthropic API (`ANTHROPIC_API_KEY`, only if the operator wants live LLM-generated results for arbitrary locations). No email, SMS, auth, or payment integrations.

**Latency/scale ceiling:** Primary action (submit location → see 5 cards) should feel instant — target under ~1.5s with the built-in generator, or bounded by LLM latency (a few seconds) if a live API key is wired in. Scale ceiling for V1: comfortably handles casual/demo traffic (dozens to low hundreds of concurrent requests) on a single small instance.

**Non-obvious constraint:** Because there's no live places database, results for very obscure or made-up locations will fall back to generic (but honestly labeled) suggestions unless an `ANTHROPIC_API_KEY` is configured — this must be communicated in the UI so users don't mistake generic fallback content for verified local knowledge.

## Stack

### Backend
- **Language + framework:** Python 3.12 + FastAPI 0.115
- **Persistence:** none (stateless; no ORM/DB)
- **Background work:** none
- **Why:** The entire app is one read-and-respond action; a database or queue would be pure overhead.

### Frontend
- **Approach:** HTMX + Jinja server-rendered templates (fastapi golden stack)
- **Styling:** bundled design system CSS, extended with a card-grid layout and a warm accent palette for the result cards
- **Key pages/components:** `/` (search page + results fragment target), result card partial, loading/error partials

### Hosting/deployment
- **Where:** any VPS/container host (Fly.io, Render, Hetzner, etc.) — single Docker image, no managed services required
- **Database hosting:** n/a
- **CI/CD shape:** manual deploy for V1 (small single app)
- **Cost band:** $0–5/mo hosting; LLM cost only incurred if `ANTHROPIC_API_KEY` is set, pay-per-search

### Auth
- **Mechanism:** none — fully public, single-purpose, stateless utility
- **Provider:** n/a

### Skipped on purpose
- Real places API (Google Places) — adds required key + billing, contradicts zero-config goal
- Any database — no entity in this product needs to survive past a single request
- Auth — no user-specific data exists to protect

## Data model summary
No persisted entities. In-memory request/response shapes only:
- `PlaceSuggestion` (transient): `name`, `description` — not stored anywhere, exists only for the duration of a request/response cycle.

## API contract summary
- `GET /` → renders the search page
- `POST /search` → takes `location` (form field), returns an HTML fragment of 5 `PlaceSuggestion` cards (or an error fragment)
- `GET /healthz` → liveness check

### Request/response shape
```
POST /search
  form: location=Paris
→ 200, HTML fragment: 5 <article class="place-card"> blocks

POST /search
  form: location=  (empty)
→ 200, HTML fragment: inline validation error message
```

### Auth requirements
None — every route is public.

### Error shape
Errors render as an HTML fragment (`error` partial) with a human-readable message, styled consistently with the rest of the design system — no raw stack traces, no JSON error envelope needed since this is HTMX/server-rendered, not a JSON API.

## UX

### Pages
```
### /
Purpose: the entire app — search box + results area.
Primary action: type a location, submit, see 5 place cards.
Layout: centered hero with app name/tagline, a single text input + submit
button, and a results grid below that HTMX swaps in place. Loading state
shows a subtle spinner/skeleton in the results area during the request.
Calls: POST /search
```

### User flows
```
**Flow: Search a location**
1. User on / → types a location into the input → clicks "Find places" (or presses Enter)
2. → HTMX POST /search fires, results area shows a loading skeleton
3. → 5 place cards fade in, replacing the skeleton

**Flow: Empty/invalid input**
1. User submits with an empty input
2. → HTMX POST /search fires, backend returns a validation error fragment
3. → Inline message appears under the input: "Enter a location to search."
```

### Component inventory
- `SearchBar` — input + submit button, HTMX attributes wired to `/search`
- `PlaceCard` — name + description, icon/badge accent
- `ResultsGrid` — responsive card grid container
- `LoadingSkeleton` — placeholder shown while HTMX request is in flight
- `ErrorBanner` — inline validation/error message

### Design tokens
Typography: a clean sans-serif system stack, generous heading scale for the hero. Spacing: 8px rhythm. Accent color: a warm terracotta/teal duotone (travel-coded) layered onto the bundled design system's neutral base. Cards use soft shadows + rounded corners for a "polished" feel per the request.

### Empty + error states
- No location entered → inline validation message, no request sent to backend unnecessarily (client-side check) but backend also validates defensively
- Generation failure → friendly "Couldn't find suggestions right now, try again" banner
- Fallback/generic result (no API key, unrecognized location) → small non-alarming label on the results ("General suggestions — add an API key for tailored results") so users aren't misled

## NFR highlights
- **Auth:** none — fully public, single-user-shaped app, no session state
- **Performance:** primary action should resolve in under ~1.5s (local generator) or a few seconds (live LLM call); no DB round-trips to worry about
- **Security baseline:** input is validated/escaped before rendering (avoid template injection); `ANTHROPIC_API_KEY` read only from environment, never logged or echoed to the client
- **Observability:** console logs only for V1; a `/healthz` endpoint for uptime checks
- **Cost-ceiling guardrail:** if `ANTHROPIC_API_KEY` is wired in, cap max tokens per request generously low since the output is just 5 short blurbs — bounds per-search cost

## Open questions
- Does the operator want to wire a live `ANTHROPIC_API_KEY` for dynamic, always-fresh recommendations, or keep it fully offline with the bundled generator? (Default: ship with a strong offline generator covering common destinations + graceful generic fallback for anything else; document the one-line change to call the live API.)
- Any specific color/branding preference beyond "pretty"? (Default: warm travel-themed accent on top of the bundled neutral design system.)

## What's NOT in V1 (deliberate)
- Live places API (ratings, live hours, photos)
- Search history / saved favorites / accounts
- Maps or geolocation
- Multi-language support
- Any backing database
