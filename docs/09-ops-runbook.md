# Ops Runbook — WanderFive

WanderFive is a stateless, single-container app: no database, no auth, no background jobs. This runbook is scaled to that reality — most of the standard AiNa ops checklist (DB backups, migrations, connection-pool runbooks) doesn't apply and is explicitly called out as such below.

## Quick deploy (any VPS/container host)

```bash
cd app
docker build -t wanderfive .
docker run -d --name wanderfive \
  -p 8000:8000 \
  --restart unless-stopped \
  --env-file .env.production \
  wanderfive
curl -f http://localhost:8000/healthz   # expect "ok"
```

No `docker-compose.yml` is needed — there's no second service (no DB, no cache, no queue). If you want one for consistency with other projects, a single-service compose file works fine but adds nothing functionally.

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `APP_NAME` | No (default "WanderFive") | Displayed in nav/title |
| `APP_TAGLINE` | No | Displayed in footer/meta description |
| `PORT` | No (default 8000) | Port the app listens on |
| `ANTHROPIC_API_KEY` | No | If set, enables live LLM-generated recommendations for any location; if unset, the app uses the curated dataset + generic fallback (see `docs/04-dev-notes.md`) |

## Infrastructure requirements
- **Spec:** Minimal — 1 vCPU / 512MB RAM comfortably handles this workload; there's no DB or heavy compute.
- **Ports:** 8000 inbound (or whatever you map it to) from your reverse proxy; outbound HTTPS to `api.anthropic.com` only if `ANTHROPIC_API_KEY` is set.
- **TLS:** The app doesn't terminate TLS itself — put it behind nginx/Caddy/your platform's edge (Fly, Render, etc. handle this automatically).
- **Backups:** None needed — there is no persistent data anywhere in this app.

## Reverse proxy (nginx snippet)
```nginx
server {
    listen 443 ssl;
    server_name wanderfive.example.com;
    ssl_certificate     /etc/letsencrypt/live/wanderfive.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wanderfive.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Health checks & monitoring
- **`GET /healthz`** — returns `"ok"`, 200. Point an uptime monitor (UptimeRobot, Better Stack, Fly's built-in checks) at this on a 1-minute interval.
- **Key metrics to watch:** request rate, 5xx rate on `POST /search`, p95 latency on `POST /search` (the only endpoint with real work — bounded by LLM latency if `ANTHROPIC_API_KEY` is set, otherwise sub-second).
- **Logging:** console/stdout logs only for V1 (uvicorn's default access + error logs). No PII is ever logged — the only user input is a location string, never stored.
- **SLO targets (appropriate for a personal-scale utility, not enterprise):** 99% availability / 30 days, p95 latency ≤ 2s on `/search`, error rate < 2% / 24h.

## Runbook: app won't start
1. Check the container is actually running: `docker ps` / your platform's process list.
2. Check logs for a stack trace: `docker logs wanderfive --tail 100`.
3. Most likely cause: a bad `PORT` value or a missing `requirements.txt` install — rebuild the image (`docker build --no-cache`).
4. `ANTHROPIC_API_KEY` being unset is NOT a startup failure — the app is designed to run without it.

## Runbook: high error rate on /search
1. Check logs for the specific exception — if it's `anthropic.*Error`, the live-LLM tier is failing (rate limit, invalid key, network) but should be silently falling back to the curated/generic tiers per `recommender.py`'s `try/except`. If users are seeing 502s, that means the *generic* fallback itself raised — check for a template/rendering bug, not an LLM problem.
2. If errors are Jinja `TemplateNotFound` or similar, redeploy — likely a bad build that dropped template files.
3. There is no DB to exhaust connections against, so DB-related root causes don't apply here.

## Rollback
```bash
docker stop wanderfive && docker rm wanderfive
docker run -d --name wanderfive -p 8000:8000 --restart unless-stopped \
  --env-file .env.production wanderfive:<previous-tag>
curl -f http://localhost:8000/healthz
```
Verify by checking `/healthz` returns 200 and doing one manual search in a browser.

## Backup & restore
Not applicable — the app holds no persistent state. "Restoring" WanderFive means redeploying a known-good image; there is nothing to back up.

## Maintenance
No maintenance mode is needed for a stateless app with no migrations — a rolling redeploy (`docker run` a new image, then stop the old one) causes at most a few seconds of downtime with zero data-consistency concerns.

## Go-live checklist
- [ ] VPS/container host provisioned (minimal spec — see Infrastructure requirements)
- [ ] SSL certificate issued, reverse proxy configured (nginx snippet above)
- [ ] DNS pointed at the server
- [ ] `.env.production` created (all vars optional — app runs with none set)
- [ ] `docker build` + `docker run` succeeds, `GET /healthz` returns 200
- [ ] Uptime monitor pointed at `/healthz`
- [ ] Decision made + documented: is `ANTHROPIC_API_KEY` being set for this deployment, or shipping curated/generic-only?
