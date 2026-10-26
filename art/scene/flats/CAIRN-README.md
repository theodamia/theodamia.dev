# The Ascent: cairn artwork

Created 2026-10-25 with the built-in imagegen tool. Artwork only; no commit.

## Deliverables

| File                  | Format                             | Exact size    | Selected generation                                                  |
| --------------------- | ---------------------------------- | ------------- | -------------------------------------------------------------------- |
| `raw/cairn-day.png`   | RGB PNG, opaque magenta background | 1664 × 936 px | Day attempt 3                                                        |
| `raw/cairn-night.png` | RGB PNG, opaque magenta background | 1664 × 936 px | Night attempt 1, with the day silhouette restored as described below |

### Day inputs, in order

1. `art/scene/flats/raw/deepsea-day.png` — rock, snow, and daylight reference.
2. `art/scene/style/frames/style-materials.png` — painterly material reference.

### Night inputs, in order

1. `art/scene/flats/raw/cairn-day.png` — the final, size-corrected and background-normalized day image; edit target.
2. `art/scene/flats/raw/deepsea-night.png` — moonlight reference only.

## Tries and selection

Three generation attempts per image: the initial attempt and two retries. No CLI/API fallback was used.

| Attempt | Assessment                                                                                                                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Day 1   | Five bulky stones; too broad, excessive snow footprint, insufficient bottom clearance. Rejected.                                                                                                                      |
| Day 2   | Cleaner stack and adequate clearance, but five stones instead of the requested six in that retry and broader than desired. Rejected in favor of attempt 3.                                                            |
| Day 3   | Six clearly stacked stones, slightly irregular, narrow tower, small snow patch, and sufficient clear surround. Selected.                                                                                              |
| Night 1 | Best alignment with day; calm cool upper-right light. After resizing and chroma cleanup, 969 foreground-mask pixels differed from day (99.2661% mask intersection-over-union). Selected for final stencil correction. |
| Night 2 | 1,239 mask pixels differed (99.0606% intersection-over-union). Rejected.                                                                                                                                              |
| Night 3 | 1,321 mask pixels differed (98.9977% intersection-over-union). Rejected.                                                                                                                                              |

The image generator did not deliver the exact requested dimensions or a mathematically flat magenta fill. Final technical preparation used FFmpeg: Lanczos resampling to exactly 1664 × 936 and replacement of background-like pixels (R > 180, G < 100, B > 180) with exact RGB(255, 0, 255). Generated stone and snow painting was retained. No reference images were modified.

The generated night edit alone was **not** pixel-identical in outline. The selected night was composited through the final day's exact non-magenta mask. Of the 486 day-only edge pixels, 481 were within one pixel of the generated night foreground and five were within two pixels. Night foreground colors were extended by two 3 × 3 dilation passes only to supply these tiny missing edge slivers; the existing night painting was retained elsewhere inside the shared mask. Night-only protrusions were removed. The background outside that mask is exact #FF00FF. This produces an identical outer silhouette, including the snow patch; it does not imply that the generator preserved every internal brushstroke.

## Final checks

- Both PNG headers and decoded pixels confirm **1664 × 936**.
- Both share the exact foreground bounds **x = 599…1064, y = 172…779**, including the snow patch; total footprint 466 × 608 px.
- Clear magenta margins: left 599 px, right 599 px, top 172 px, bottom 156 px.
- All pixels in the outer 120 px frame are exactly RGB(255, 0, 255); the entire area outside the shared foreground mask is the same exact flat magenta.
- Both contain 131,552 non-magenta foreground pixels.
- **Final day/night foreground masks differ by zero pixels. The final night outline matches day pixel-for-pixel.**
- Both were visually inspected at full size and in downscaled copies with the roughly 600 px cairn reduced to about 50 px tall. The tapered six-stone stack remains recognizable as a cairn in both. Previews were produced in memory, with no additional project files.
- Moonlit planes remain cool and lit from the upper right; no warm light, sky, stars, text, or halo was added.

SHA-256:

- Day: `1f07901e5051a42c355de9478df961d3eeeb3f676342ce6d1b8b03dd2fddbedb`
- Night: `209c438372725f873f7d3d38aadab50f10e4bd7c67d321092c5d027ca0b85db8`

## Complete prompts

The following are the complete prompts sent for every attempt. Retry prompts repeat their full base prompt; input order stayed as listed above.

### Day attempt 1

```text
Use case: stylized-concept.
Asset type: a small clickable cairn sprite for a painted Alpine mountain scene; must read instantly at 50 pixels tall.
Input images in order: Image 1 (deepsea-day.png) is the camp it stands beside: match its rocks and snow. Image 2 (style-materials.png) is the supporting material and painterly style reference. Create a NEW isolated cairn, not a landscape.
Output canvas: exactly 1664 × 936 pixels.
A single small cairn, alone, centred on a flat magenta #FF00FF background: five or six flat, rounded, smooth mountain stones stacked into a little tower, the widest at the base and each one smaller up to a small pebble on top, slightly irregular and leaning a touch, as if built by hand on a path. Painted in the soft polished painterly style of the attached images: big simple stone forms modelled with smooth gradient shading, soft-edged brushwork, gentle texture. Light from the UPPER RIGHT: lit planes up and right in cool pale stone (#bcbeb2 to #d6d6cc), shade lower left in cool blue-grey (#6387a3 to #4e6a86). A light dusting of snow on the top surfaces of the stones (#f3f4f6, shade #bfceef), and a small patch of snow and a soft contact shadow where it stands. The cairn is about 600 px tall and 360 px wide, standing upright, fully inside the canvas with at least 120 px of clear magenta all around. Everything that is not the cairn and its little snow patch is flat magenta #FF00FF: no sky, no ground plane beyond the patch, no glow, no halo, no text.
```

### Day attempt 2

```text
Use case: stylized-concept.
Asset type: a small clickable cairn sprite for a painted Alpine mountain scene; must read instantly at 50 pixels tall.
Input images in order: Image 1 (deepsea-day.png) is the camp it stands beside: match its rocks and snow. Image 2 (style-materials.png) is the supporting material and painterly style reference. Create a NEW isolated cairn, not a landscape.
Output canvas: exactly 1664 × 936 pixels.
A single small cairn, alone, centred on a flat magenta #FF00FF background: five or six flat, rounded, smooth mountain stones stacked into a little tower, the widest at the base and each one smaller up to a small pebble on top, slightly irregular and leaning a touch, as if built by hand on a path. Painted in the soft polished painterly style of the attached images: big simple stone forms modelled with smooth gradient shading, soft-edged brushwork, gentle texture. Light from the UPPER RIGHT: lit planes up and right in cool pale stone (#bcbeb2 to #d6d6cc), shade lower left in cool blue-grey (#6387a3 to #4e6a86). A light dusting of snow on the top surfaces of the stones (#f3f4f6, shade #bfceef), and a small patch of snow and a soft contact shadow where it stands. The cairn is about 600 px tall and 360 px wide, standing upright, fully inside the canvas with at least 120 px of clear magenta all around. Everything that is not the cairn and its little snow patch is flat magenta #FF00FF: no sky, no ground plane beyond the patch, no glow, no halo, no text.
Composition correction for this second attempt: SIX distinctly separate flattened rounded stones, not bulky boulders, stacked vertically with each smaller than the one beneath. Preserve the soft sculpted painted rock style, but use simpler broader shading with less mottling. At the requested 1664 × 936 canvas, the STONE TOWER should occupy approximately x=652..1012 and y=150..750: 360 px wide and 600 px tall. Keep the small shallow snow patch approximately x=612..1052 and y=730..786. Leave at least 150 px empty magenta below it. These bounding boxes are composition guidance only; do not draw any boxes, guides or text. The snow patch must be little, with no extra loose rocks around it. Flat pure solid #FF00FF in every background pixel, no texture/noise in the magenta.
```

### Day attempt 3 — selected

```text
Use case: stylized-concept.
Asset type: a small clickable cairn sprite for a painted Alpine mountain scene; must read instantly at 50 pixels tall.
Input images in order: Image 1 (deepsea-day.png) is the camp it stands beside: match its rocks and snow. Image 2 (style-materials.png) is the supporting material and painterly style reference. Create a NEW isolated cairn, not a landscape.
Output canvas: exactly 1664 × 936 pixels.
A single small cairn, alone, centred on a flat magenta #FF00FF background: five or six flat, rounded, smooth mountain stones stacked into a little tower, the widest at the base and each one smaller up to a small pebble on top, slightly irregular and leaning a touch, as if built by hand on a path. Painted in the soft polished painterly style of the attached images: big simple stone forms modelled with smooth gradient shading, soft-edged brushwork, gentle texture. Light from the UPPER RIGHT: lit planes up and right in cool pale stone (#bcbeb2 to #d6d6cc), shade lower left in cool blue-grey (#6387a3 to #4e6a86). A light dusting of snow on the top surfaces of the stones (#f3f4f6, shade #bfceef), and a small patch of snow and a soft contact shadow where it stands. The cairn is about 600 px tall and 360 px wide, standing upright, fully inside the canvas with at least 120 px of clear magenta all around. Everything that is not the cairn and its little snow patch is flat magenta #FF00FF: no sky, no ground plane beyond the patch, no glow, no halo, no text.
Third attempt. Keep the cairn elegantly narrow, not broad: five flat rounded stacked mountain stones with a little pebble as the sixth stone at the top. Simple soft sculpted painterly forms, not craggy/angular fractured boulders. Frame the cairn at 600 px tall and 360 px maximum stone width, at the centre of the 1664 × 936 landscape canvas, with a little snow patch extending just 30 px to either side of its base. Maintain at least 150 px clear background below the snow patch and above the upper pebble. Background requirement is critical: a perfectly flat digital color fill of exact RGB(255,0,255), with no grain, dithering, gradients, color variation, or lighting whatsoever across the magenta. This magenta is a chroma-key technical background, not part of the painted world. Paint texture belongs on the stones and snow only.
```

### Night attempt 1 — selected

```text
Use case: lighting-weather.
Asset type: moonlit night variant of a painted cairn sprite. Output exactly 1664 × 936 pixels.
Input images, in this order: Image 1 (cairn-day.png) is the EDIT TARGET and its geometry is locked. Image 2 (deepsea-night.png) is only the reference for calm moonlit Alpine night lighting.
Image edit. Keep this cairn exactly as it is: every stone, outline, size and place, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a calm moonlit Alpine night, as in the second image: the moon is high at the TOP RIGHT, so lit planes face up and right in cool silver-blue moonlight (stone #6f86a3 lit, #374d6e shade, snow #b7c8e0 lit, #6c88b2 shade). Same soft painterly rendering. No warm light, no stars, no sky.
Critical invariants: exactly the six existing stones, same stone boundaries, same snow placement and snow-patch contour, same canvas coordinates and scale, no camera or crop changes. Relight existing pixels rather than redraw the subject. The background is a technical digital chroma key fill: exact RGB(255,0,255) everywhere outside the original subject.
```

### Night attempt 2

```text
Use case: lighting-weather.
Asset type: moonlit night variant of a painted cairn sprite. Output exactly 1664 × 936 pixels.
Input images, in this order: Image 1 (cairn-day.png) is the EDIT TARGET and its geometry is locked. Image 2 (deepsea-night.png) is only the reference for calm moonlit Alpine night lighting.
Image edit. Keep this cairn exactly as it is: every stone, outline, size and place, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a calm moonlit Alpine night, as in the second image: the moon is high at the TOP RIGHT, so lit planes face up and right in cool silver-blue moonlight (stone #6f86a3 lit, #374d6e shade, snow #b7c8e0 lit, #6c88b2 shade). Same soft painterly rendering. No warm light, no stars, no sky.
Critical invariants: exactly the six existing stones, same stone boundaries, same snow placement and snow-patch contour, same canvas coordinates and scale, no camera or crop changes. Relight existing pixels rather than redraw the subject. The background is a technical digital chroma key fill: exact RGB(255,0,255) everywhere outside the original subject.
Retry 2: the previous edit moved some outer edge pixels by about one pixel. This must be an exact registered color-only relighting of Image 1, with NO outline movement at all: do not redraw stones or snow. Lock the original silhouette and the exact pixel positions of all contours. Preserve even the little scalloped snow edge and pebble outline exactly. Keep the exact 1664 × 936 dimensions of Image 1. Preserve the clean pure magenta of Image 1 unchanged. Only map the existing stone and snow colors into the specified cool night palette, while keeping the same surface texture and shading direction.
```

### Night attempt 3

```text
Use case: lighting-weather.
Asset type: moonlit night variant of a painted cairn sprite. Output exactly 1664 × 936 pixels.
Input images, in this order: Image 1 (cairn-day.png) is the EDIT TARGET and its geometry is locked. Image 2 (deepsea-night.png) is only the reference for calm moonlit Alpine night lighting.
Image edit. Keep this cairn exactly as it is: every stone, outline, size and place, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a calm moonlit Alpine night, as in the second image: the moon is high at the TOP RIGHT, so lit planes face up and right in cool silver-blue moonlight (stone #6f86a3 lit, #374d6e shade, snow #b7c8e0 lit, #6c88b2 shade). Same soft painterly rendering. No warm light, no stars, no sky.
Critical invariants: exactly the six existing stones, same stone boundaries, same snow placement and snow-patch contour, same canvas coordinates and scale, no camera or crop changes. Relight existing pixels rather than redraw the subject. The background is a technical digital chroma key fill: exact RGB(255,0,255) everywhere outside the original subject.
Final retry, 3 of 3. Treat Image 1 as a locked raster plate with immutable geometry. Apply ONLY a cool blue night color grade inside its existing stone-and-snow silhouette. The entire border between magenta and the subject must remain exactly where it is. Do not generate a new cairn and do not reconstruct any stone shape. Preserve all six stone sizes, tilts, placements, painted details and especially the identical snow-patch edge. Keep all magenta pixels as the original pure #FF00FF. The desired moonlight is a gentle silver-blue color-only relight of this exact artwork; no change in camera, canvas, framing, object scale, snow coverage or shadow footprint.
```
