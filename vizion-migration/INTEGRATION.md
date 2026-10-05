# VIZION GitHub-only integration

## Goal
Continue all development without Base44 while preserving the current public design 1:1.

## Architecture
- **Outer shell**: existing VIZION visual system and deep-space/laptop choreography.
- **Screen renderer**: `vizion-migration/screen.html` embedded only inside laptop/screen frames.
- **Project data**: `vizion-migration/projects.js`.
- **Scene engine**: `vizion-migration/engine.js`.
- **Screen styles**: `vizion-migration/screens.css`.
- **SEO route data**: `vizion-migration/route-meta.js` + `seo-runtime.js`.

## No-design-change rule
Do not change:
- homepage deep-space composition,
- logo,
- typography scale of the outer shell,
- navigation,
- laptop/device framing,
- scroll choreography,
- catalog ordering unless fixing a factual/count issue.

## Screen-only upgrade
Each project is rendered with 7 visually different scenes:
1. Live hero / art
2. UX structure
3. Motion / key scene
4. Design system
5. Frontend build
6. Responsive QA
7. Final live presentation

## Embed contract
The outer work-page only needs to render the screen URL inside its existing laptop viewport:

```html
<iframe
  src="/vizion-migration/screen.html?project=noir-space&scene=1"
  title="Noir Space — scene 1"
  loading="lazy">
</iframe>
```

Change only `project` and `scene`. The renderer has its own isolated CSS and cannot alter the outer VIZION design.

## Migration order
1. Recreate current outer shell 1:1 in GitHub.
2. Drop the screen iframe into the existing device viewport.
3. Compare current domain and GitHub build visually.
4. Fix technical issues: metadata, sitemap, duplicate contact copy, media loading.
5. Deploy GitHub build to staging.
6. Switch `vizionworkspace.com` only after visual parity is confirmed.
