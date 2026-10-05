# VIZION staging — GitHub-only

This staging folder is the migration target for the current live VIZION website.

## Non-negotiable rule
The live design direction is preserved. This is not a redesign.

## Purpose
- reproduce the current deep-space → principles → selected-work flow outside Base44,
- keep the catalog on the same site,
- upgrade only the content rendered inside laptop screens,
- verify everything before the domain is switched.

## Preview
- `index.html` — home + selected catalog
- `work.html?project=noir-space` — seven-scene case study
- laptop iframes load `../screen.html?project=<slug>&scene=<1..7>`

## Final routing on Netlify
- `/work/:slug` → `work.html?project=:slug`
- `/about` → `about.html`

## Live domain
Do not point `vizionworkspace.com` here until the staging build is visually approved.
