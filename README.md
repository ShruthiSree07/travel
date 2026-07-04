# WanderFive

Type a place. Get 5 worth visiting.

A stateless FastAPI + HTMX app: enter any location and get 5 curated places to visit, rendered as polished cards. No accounts, no database, no required API key.

## Contents
- `docs/` — the full document set (braindoc, SOW, PRD, dev notes, marketing, ops runbook)
- `app/` — the working codebase
- `app/marketing.html` — a standalone landing page

## Run it
```bash
cd app
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Visit `http://localhost:8000`. See `docs/04-dev-notes.md` for architecture details and `docs/09-ops-runbook.md` for deployment.

Optionally set `ANTHROPIC_API_KEY` (see `app/.env.example`) to enable live, LLM-generated recommendations for any location instead of the built-in curated dataset + generic fallback.
