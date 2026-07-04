# Dev Notes — WanderFive

## Architecture
Single-process FastAPI app, server-rendered with Jinja2 + HTMX (no client build step, no CDN dependency besides the Google Fonts `<link>` and vendored HTMX). No database — every request is stateless.

```
app/
  app/
    main.py          # routes: / , POST /search , /roadmap , /healthz
    recommender.py   # 3-tier place recommendation logic
  templates/
    base.html            # top-nav shell (brand + Search/Roadmap links)
    pages/home.html      # hero + search form + #results target
    pages/roadmap.html   # what's shipped / planned
    partials/results.html  # 5 place-card grid, HTMX-swapped into #results
    partials/error.html    # inline error banner
  static/css/app.css   # bundled design system, extended with hero/searchbar/place-card styles
  static/js/htmx.min.js
  Dockerfile, requirements.txt, .env.example
```

### Recommendation engine (`recommender.py`)
Three tiers, tried in order — the app always returns exactly 5 results and never requires configuration:

1. **Live LLM** — only attempted if `ANTHROPIC_API_KEY` is set. Calls the Anthropic API asking for 5 real, verifiable places as JSON. Any failure (network, bad JSON, no key) silently falls through to tier 2 — never surfaces as a user-facing error.
2. **Curated dataset** — ~25 well-known destinations (Paris, London, NYC, Tokyo, Rome, Kyoto, etc.) with hand-written, factual place names and descriptions, matched by normalized name or common alias (`nyc` → `new york`, `sf` → `san francisco`, etc.) and by substring match for close variants.
3. **Generic template** — always available. Produces 5 category-based suggestions (historic center, main market, top museum, scenic viewpoint, signature eatery) templated with the user's input, so an obscure or made-up location still gets a usable, honest response. These results are flagged `is_generic=True` and the UI shows a small "General suggestions — add an API key for tailored results" badge so users aren't misled into thinking it's verified local knowledge.

### Routes
- `GET /` — renders the hero + search page.
- `POST /search` — form field `location`; returns an HTML fragment (5 place cards, or an inline error) that HTMX swaps into `#results`. Empty input short-circuits to the error partial before calling the recommender.
- `GET /roadmap` — static shipped/planned list.
- `GET /healthz` — liveness check, returns `"ok"`.

### What was changed vs. the seeded starter
The golden starter ships as a sidebar admin-dashboard shell (Dashboard/Items/Roadmap), which doesn't fit a single-purpose consumer search tool. Kept: the CSS design system (tokens, `.card`, `.btn`, `.badge`, HTMX loading conventions), the `/roadmap` page, and the overall "extend, don't replace" approach. Replaced: the sidebar+topbar shell with a simpler top-nav layout, and the Dashboard/Items demo pages with the real Search page — removed `pages/items.html`, `pages/dashboard.html`, and `partials/item_row.html` since they were stub demo content with no role in this product. Added hero/searchbar/place-card styles and a warm terracotta + teal accent duotone on top of the existing neutral tokens.

## How to run
```bash
cd app
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # optional: set ANTHROPIC_API_KEY for live recommendations
uvicorn app.main:app --reload --port 8000
```
Visit `http://localhost:8000`.

## Verification performed
Ran the app locally (`uvicorn app.main:app --port 8123`) and exercised it directly:
- `GET /healthz` → `200`
- `GET /` → `200`, hero renders ("Where to next?")
- `GET /roadmap` → `200`
- `POST /search location=Paris` → 5 curated Paris place cards
- `POST /search location=` (empty) → inline "Enter a location to search." error, no crash
- `POST /search location=Wobbleton Junction` (unknown) → 5 generic fallback cards + the "add an API key" badge
- `POST /search location=nyc` → alias resolves to New York's curated list
- `POST /search location=  ROME  ` → whitespace/case normalized, resolves to Rome's curated list

All passed. `ANTHROPIC_API_KEY` was not set during verification, so the live-LLM tier was not exercised end-to-end against the real API — the code path falls back safely (confirmed via the `try/except` returning `None` on missing key without attempting a network call).

## What's stubbed / left for later
- The live-LLM tier is wired but only exercised against real API credentials by whoever deploys this with a key set — not covered by automated tests here.
- No automated test suite (pytest) was added given the project's scope (tier_recommended, <1 engineer-day) — verification was manual/functional as documented above. Adding `pytest` + `httpx` test client coverage for the three recommender tiers would be the natural next step if this grows.
