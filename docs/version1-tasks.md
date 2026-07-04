# CalcVerse — Version 1 Task Board

Scope: the 11 "Quick win" features from the [competitive audit & roadmap](https://claude.ai/code/artifact/b085a7b0-d1d5-45a5-8f0c-340a3a07be54) (Phase 1 — low effort, high impact). Ordered by priority rank from that audit (highest impact-per-effort first).

## Progress

```
[██████████░░░░░░░░░░] 55% — 6 / 11 tasks done
```

## Tasks

| # | Task | Subtasks | Status |
|---|------|----------|--------|
| 1 | Sitemap + robots.txt | 1.1 ✅ `app/sitemap.ts` listing all calculator routes · 1.2 ✅ `app/robots.ts` | ✅ Done |
| 2 | Accessible labels, focus & error states | 2.1 ✅ Visible focus-ring styles (global `:focus-visible` outline + per-domain rings) · 2.2 ✅ Accessible inline error messaging (`role="alert"`) on all 8 calculators · 2.3 ✅ Audited — labels already wrap inputs (valid implicit association) · 2.4 ✅ Skip-to-content link | ✅ Done |
| 3 | Per-page SEO metadata + Open Graph | 3.1 ✅ Unique `metadata` per calculator (split into server `page.tsx` + client component) · 3.2 ✅ Open Graph + Twitter card tags · 3.3 ✅ Canonical URLs via `metadataBase` | ✅ Done |
| 4 | Privacy-first trust messaging | 4.1 ✅ Trust line moved to shared layout footer — appears on every page, not just home | ✅ Done |
| 5 | Search bar for calculators | 5.1 ✅ Homepage search input filtering by name/keyword · 5.2 ✅ Empty-state messaging · 5.3 ✅ Keyboard accessible (native input + clear button) | ✅ Done |
| 6 | PWA manifest + installable icons | 6.1 ✅ `app/manifest.ts` (name, icons 192/512/maskable, theme_color, standalone) · 6.2 ✅ Generated icon PNGs (192, 512, maskable, apple-touch) · 6.3 ✅ Linked manifest + theme-color + icons in layout | ✅ Done |
| 7 | Manual dark / light toggle | 7.1 Toggle control in header · 7.2 Persist choice in localStorage + `data-theme` attribute · 7.3 Verify Tailwind dark: classes follow manual override | ⬜ Not started |
| 8 | JSON-LD structured data | 8.1 Site-wide `SoftwareApplication` schema · 8.2 Per-calculator structured data | ⬜ Not started |
| 9 | Privacy-respecting analytics | 9.1 Add Vercel Analytics package · 9.2 Verify events in production | ⬜ Not started |
| 10 | Recent / favorite calculators | 10.1 Favorite-star toggle per calculator card · 10.2 Persist favorites in localStorage · 10.3 Track recently used in localStorage · 10.4 Homepage "Favorites/Recent" section | ⬜ Not started |
| 11 | Locale-aware number formatting | 11.1 Shared `Intl`-based formatting utility · 11.2 Replace ad-hoc `toLocaleString()` calls across calculators | ⬜ Not started |

**Status legend:** ⬜ Not started · 🔄 In progress · ✅ Done
