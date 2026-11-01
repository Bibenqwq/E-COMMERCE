# AIR/FORM — Move Different

A minimal Air Max DN product-launch concept built with React, Three.js, GSAP ScrollTrigger, and Lenis. The home page includes a lazy-loaded 3D sneaker, a pinned scroll-rotation tour, five horizontal feature panels, and a working color/size/cart selector.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Project structure

- `src/pages/HomePage.tsx` — launch-page content, colorways, sizing, cart action, and newsletter UI.
- `src/components/launch/SneakerScene.tsx` — lazy-loaded Three.js GLB scene, lighting, contact shadow, and color transitions.
- `src/components/launch/FeatureRunner.tsx` and `RunnerScene.tsx` — lazily loaded running GLB whose position follows the horizontal feature scroll.
- `src/hooks/useLaunchScroll.ts` — GSAP ScrollTrigger timelines for the pinned 360° tour and horizontal feature panels.
- `src/components/Navbar.tsx` — minimal navigation and live cart count.
- `src/App.tsx` — Lenis setup and Lenis/GSAP ticker synchronization.
- `src/index.css` — responsive layout, launch-page styling, and reduced-motion fallbacks.

## Replace the 3D shoe

The home page loads `public/models/free_sneaker_optimized.glb`, a WebP-textured version of the original model. Replace it with another optimized GLB, keeping that filename, or update the preload URL in `HomePage.tsx` and model URL in `SneakerScene.tsx`. The scene clones materials before recoloring, so the shared GLTF cache is not modified.

The horizontal feature section uses the Xbot human character and `run` animation from [Mixamo](https://www.mixamo.com/), served locally from `public/models/human_runner.glb`. The GLB is distributed with the [Three.js Mixamo animation example](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_animation_skinning_additive_blending.html), which credits Mixamo as the model source. Review Mixamo's terms before redistributing the model separately.

## Tune scroll timing

In `src/hooks/useLaunchScroll.ts`, adjust the 360° tour's `end: '+=2400'` to change its scroll length. The horizontal section derives its distance from the track width; change `scrub: 1` on either trigger to tune how closely animation follows scroll.
