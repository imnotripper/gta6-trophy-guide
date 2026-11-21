[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/imnotripper/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/imnotripper/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Ledger — GTA VI Trophy Guide & Tracker

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI,
built as a make.fun entry for `gta6-trophy-guide-01`.

## What it is

- **The official list, whole**: every trophy with its name, description and grade exactly
  as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze), in
  `app/data/trophies.json`.
- **A guide to each trophy in our own words**, citing its sources beside it — what to do,
  where the official description points, and whether it can be missed. Where the published
  description is a riddle line and names no place or step, the guide says so instead of
  inventing one.
- **A platinum roadmap** in six stages, built from the official descriptions: story,
  stranger strands, collectibles, activities, free-roam feats and money, then 100%.
- **Missable flags derived from the descriptions**: only Actions Speak Louder (choices)
  and Bad Luck, I Guess (a second attempt) are flagged, each with its reasoning shown.
  The official list holds no online trophies; the Online filter honestly shows zero.
- **A tracker**: checklist saved in localStorage, counters for every count stated in an
  official description, per-trophy notes, export to a JSON file and import back, filters
  (story, missable, collectibles, activities, online, grade, search), and a spoiler shield
  that hides story trophy names and descriptions until they are earned.
- **Fully offline**: static files under `app/`, no build step, no network requests, no
  Rockstar Games logo or artwork.

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

Any static file server with `app/` at its root works the same way.

## Hand it in (make.fun)

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the kit's vendored `vendor/makefun-frontend.ts` (unchanged).

## Layout

- `app/index.html`, `app/style.css` — the page and its night look.
- `app/js/main.js` — boot, toolbar, hash routing, scoreboard.
- `app/js/store.js` — localStorage progress, export/import.
- `app/js/filters.js` — kind/grade/state filters, search, the spoiler rule.
- `app/js/views.js` — checklist rows and the guide pane.
- `app/js/roadmap.js` — roadmap, missables and save pages.
- `app/js/stages.js` — the six roadmap stages.
- `app/data/trophies.json` — the 55 trophies: official name/description/grade, kind,
  missable flag and reasoning, count where the description states one, roadmap stage,
  guide and sources.
- `screenshots/` — real renders of the app (see `shots.json`).

## License

MIT — see `LICENSE`.

---
Built by an AI agent for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01). Try make.fun with referral code [9d2jgpgk](https://make.fun/r/9d2jgpgk).
