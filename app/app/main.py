"""WanderFive — FastAPI + HTMX app.

Type a location, get 5 curated places to visit, rendered as polished cards.
Server-rendered (Jinja2), styled with the bundled design system, interactive
via vendored HTMX. No database, no accounts, no required API key — see
app/recommender.py for the tiered recommendation logic.

Run locally:  uvicorn app.main:app --reload --port 8000
"""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.recommender import get_places

APP_NAME = os.environ.get("APP_NAME", "WanderFive")
APP_TAGLINE = os.environ.get("APP_TAGLINE", "Type a place. Get 5 worth visiting.")

BASE_DIR = Path(__file__).resolve().parent.parent
app = FastAPI(title=APP_NAME)
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

NAV = [
    {"key": "home", "label": "Search", "href": "/"},
    {"key": "roadmap", "label": "Roadmap", "href": "/roadmap"},
]

ROADMAP = [
    {"title": "Location search → 5 curated places", "state": "done", "note": "Shipped in v0.1"},
    {"title": "Live LLM recommendations (any location)", "state": "done", "note": "Active when ANTHROPIC_API_KEY is set"},
    {"title": "Real places API (live hours, ratings, photos)", "state": "planned", "note": "V2 if needed"},
    {"title": "Saved searches / favorites", "state": "planned", "note": "Backlog"},
]


def ctx(request: Request, active: str, **extra):
    return {
        "request": request,
        "app_name": APP_NAME,
        "app_tagline": APP_TAGLINE,
        "nav": NAV,
        "active": active,
        **extra,
    }


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request, "pages/home.html", ctx(request, "home"))


_NO_STORE = {"Cache-Control": "no-store"}


@app.post("/search", response_class=HTMLResponse)
def search(request: Request, location: str = Form("")):
    location = location.strip()
    if not location:
        html = templates.get_template("partials/error.html").render(
            ctx(request, "home", message="Enter a location to search.")
        )
        return HTMLResponse(html, headers=_NO_STORE)

    try:
        places = get_places(location)
    except Exception:
        html = templates.get_template("partials/error.html").render(
            ctx(request, "home", message="Couldn't find suggestions right now — try again.")
        )
        return HTMLResponse(html, status_code=502, headers=_NO_STORE)

    html = templates.get_template("partials/results.html").render(
        ctx(request, "home", location=location, places=places)
    )
    return HTMLResponse(html, headers=_NO_STORE)


@app.get("/roadmap", response_class=HTMLResponse)
def roadmap_page(request: Request):
    return templates.TemplateResponse(request, "pages/roadmap.html", ctx(request, "roadmap", roadmap=ROADMAP))


@app.get("/healthz", response_class=PlainTextResponse)
def healthz():
    return "ok"
