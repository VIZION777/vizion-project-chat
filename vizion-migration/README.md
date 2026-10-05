# VIZION — preserve-live migration

This branch is a **screen-only migration layer** for the current live design on vizionworkspace.com.

## Rule
Do not redesign the outer VIZION shell. The homepage, deep-space scroll, laptop framing, navigation and case-study choreography remain visually unchanged.

## What changes
Only the content rendered inside the laptop/screens on `/work/*`.

Each project gets seven genuinely different scenes:
1. Opening / live art
2. Structure / UX
3. Motion / key scenes
4. Design system
5. Frontend / build
6. Responsive / QA
7. Final / live presentation

The module is isolated so it can be embedded into the current shell during migration away from Base44.

## Current audit notes
- Current work pages repeat nearly the same mini-site composition across all seven scenes.
- Several portfolio pages rely on empty/low-information figure placeholders.
- Catalog reports 62 concepts while the currently exposed work routes are a smaller selected set; count/index logic needs reconciliation.
- Catalog and /work pages use generic metadata/canonical values and should receive route-specific SEO metadata.
- `sitemap.xml` currently lists core pages but not the selected `/work/*` case studies.
- Contact HTML repeats the same introductory sentence twice.

None of those fixes require changing the visual design.
