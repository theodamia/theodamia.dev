# The Ascent: sky clouds

Artwork only. Generated with the built-in imagegen tool, followed by mechanical sheet sizing, placement, magenta-matte cleanup and silhouette restoration. No code, configuration or packages were changed by this artwork task, and no commit was made.

## Deliverables

| File                   | Size       | Format               | Generated attempts | Selected attempt            |
| ---------------------- | ---------- | -------------------- | ------------------ | --------------------------- |
| `raw/clouds-day.png`   | 1664 × 936 | Opaque 8-bit RGB PNG | 3                  | 3, with normalization below |
| `raw/clouds-night.png` | 1664 × 936 | Opaque 8-bit RGB PNG | 2                  | 2, with normalization below |

## Inputs, in order

Day, for every attempt:

1. `art/scene/flats/raw/far-day.png` — primary cloud painting and palette reference.
2. `art/scene/style/frames/style-hero-day.png` — supporting painting style reference.

Night, for both attempts:

1. `art/scene/flats/raw/clouds-day.png` — finalized day sheet; edit target.
2. `art/scene/flats/raw/far-night.png` — primary moonlit cloud palette reference.
3. `art/scene/style/frames/style-hero-night.png` — supporting night painting style reference.

## Attempts and finishing

Day attempt 1 had good painterly volume, but the horizontal gaps were only about 65 pixels and the output was 1672 × 941. Attempt 2 sprawled farther into the margins. Attempt 3 had a flatter small cloud and was selected as the best source, but still needed precise layout and matte cleanup. All generated day attempts used the two reference inputs in the order above.

Day finishing used FFmpeg and in-memory Node pixel processing; no additional project files or dependencies were created. The selected clouds were cropped individually, resized with Lanczos filtering and placed on a fresh exact RGB(255,0,255) canvas. The final cloud boxes are 600 × 200, 420 × 160 and 300 × 110. Near-magenta background noise was removed; edge pixels contaminated by magenta were replaced with nearby clean cloud colours. Retained cloud colours were constrained to R ≤ G ≤ B to remove pink and warm contamination. This deliberately gives the chroma-key boundary a clean pixel mask rather than blending cloud colour with the magenta. The interior retains the generated painterly shading.

Night attempt 1 preserved most geometry but changed fine wisps: after scaling to the requested canvas, its cloud mask had 96.855% intersection over union with the day mask. Attempt 2 improved this to 96.990% and was selected. Neither raw generated edit had mathematically identical outlines or an exact flat background.

Night finishing resized attempt 2 to 1664 × 936, then applied the exact finalized day cloud mask. All pixels outside that mask were restored to exact #FF00FF. Within the mask, 4,787 pixels with missing or contaminated night colour were restored from the nearest valid night cloud colour, at most 11.41 pixels away. This restores the day outline without leaving pink fringes or day-coloured edge slivers. The rest of the night painting comes from the generated edit.

## Final checks

Both saved PNGs were decoded and inspected visually and numerically.

- Exact canvas: **1664 × 936**, both files.
- Cloud bounds, inclusive coordinates, identical in both files:

| Cloud         | Bounds (x, y)           | Size      |
| ------------- | ----------------------- | --------- |
| Long left     | (80, 368)–(679, 567)    | 600 × 200 |
| Medium centre | (772, 388)–(1191, 547)  | 420 × 160 |
| Small right   | (1284, 413)–(1583, 522) | 300 × 110 |

- Horizontal clear magenta gaps: **92 px and 92 px**.
- Canvas margins: **80 px left, 80 px right, 368 px above and below the tallest cloud**.
- Each cloud bounding box is centred vertically at y = 467.5, the centre of the 936-pixel canvas.
- Each file contains **115,260 cloud pixels** and **1,442,244 exact #FF00FF background pixels**.
- Every background pixel is the same exact RGB value. The day and night background masks are identical.
- Day/night cloud-mask difference: **0 pixels**. The saved night outlines match the saved day outlines exactly, including small detached wisps.
- Pink fringe check: **0 cloud pixels with R > G**, and all cloud pixels also have G ≤ B. No pink pickup is visible in the final cloud edges.
- Mask SHA-256 (one byte per pixel; 1 = cloud, 0 = magenta), both files: `d53c778bf362fe315a8e8d5110f9466b649925ebb1fd143094aa831d0b5dcc1a`.

The exact outline match and flat magenta refer to the finished files, after the documented cleanup; they were not achieved by the generator alone.

## Complete prompts

### Day attempt 1

```text
Use case: stylized-concept.
Asset type: painted sky cloud sprite sheet, exactly 1664 × 936 pixels, opaque RGB.
Input images in order: Image 1 (far-day.png) is the primary reference for the cloud sea's painted rendering and cool palette. Image 2 (style-hero-day.png) is a supporting overall painting style reference. These are references only; paint only the three isolated clouds described below.

Three separate small fair-weather clouds on a flat magenta #FF00FF background, side by side in a row across the canvas, each fully surrounded by magenta with at least 80 px of clear magenta between them and around the canvas edges; none touches another or the edge. From left to right: a long low cumulus about 600 px wide and 200 px tall; a medium one about 420 px wide and 160 px tall; a small wisp about 300 px wide and 110 px tall. Each is vertically centred on the canvas. They are distant clouds seen from a mountain: soft, rounded, gently layered cumulus with flattened bases, broader than tall, painted in the same soft painterly rendering as the cloud sea in the first image, with smooth gradient shading and soft-edged brushwork. Light from the UPPER RIGHT: tops and right sides lit near-white #f3f4f6, undersides and left flanks in cool soft blue #bfceef to #a9bde6, no grey, no warm tint. The edge against the magenta is soft but clean: the cloud's own colour runs right to its edge, never blending into pink or magenta, no halo, no glow, no shadow on the magenta. No sky, no gradient, no mountains, no ground, no sun, no birds, no text.

Exact layout guidance on the 1664 × 936 canvas: left cloud bounds approximately x=80..680, y=368..568; middle x=772..1192, y=388..548; small right x=1284..1584, y=413..523. Keep every bit of cloud paint inside those boxes and all the surrounding canvas exactly solid #FF00FF. Natural irregular cumulus silhouettes, not vector pills.
```

### Day attempt 2

```text
Use case: stylized-concept.
Asset type: painted sky cloud sprite sheet, exactly 1664 × 936 pixels, opaque RGB.
Input images in order: Image 1 (far-day.png) is the primary reference for the cloud sea's painted rendering and cool palette. Image 2 (style-hero-day.png) is a supporting overall painting style reference. These are references only; paint only the three isolated clouds described below.

Three separate small fair-weather clouds on a flat magenta #FF00FF background, side by side in a row across the canvas, each fully surrounded by magenta with at least 80 px of clear magenta between them and around the canvas edges; none touches another or the edge. From left to right: a long low cumulus about 600 px wide and 200 px tall; a medium one about 420 px wide and 160 px tall; a small wisp about 300 px wide and 110 px tall. Each is vertically centred on the canvas. They are distant clouds seen from a mountain: soft, rounded, gently layered cumulus with flattened bases, broader than tall, painted in the same soft painterly rendering as the cloud sea in the first image, with smooth gradient shading and soft-edged brushwork. Light from the UPPER RIGHT: tops and right sides lit near-white #f3f4f6, undersides and left flanks in cool soft blue #bfceef to #a9bde6, no grey, no warm tint. The edge against the magenta is soft but clean: the cloud's own colour runs right to its edge, never blending into pink or magenta, no halo, no glow, no shadow on the magenta. No sky, no gradient, no mountains, no ground, no sun, no birds, no text.

Exact layout guidance on the 1664 × 936 canvas: left cloud bounds approximately x=80..680, y=368..568; middle x=772..1192, y=388..548; small right x=1284..1584, y=413..523. Keep every bit of cloud paint inside those boxes and all the surrounding canvas exactly solid #FF00FF. Natural irregular cumulus silhouettes, not vector pills.
Revision for spacing: the previous attempt made the left cloud too wide and left only about 64 px between clouds. Correct that. Use slightly smaller approximate widths (580, 400, 280 px) so there is abundant clear magenta space. Cloud bounds MUST be entirely within x=90..670, x=782..1182, x=1294..1574 respectively. Make the outermost feather edges stay within those bounds. Leave at least 100 actual clear pixels between clouds, and at least 88 clear pixels at both left and right edges. The small cloud should be a low airy wisp, lower and flatter than the other two. Keep all three bounding-box centres at y=468. Preserve the soft blue and white painterly quality. Deliver exactly 1664 × 936 pixels.
```

### Day attempt 3 — selected source

```text
Use case: stylized-concept.
Asset type: painted sky cloud sprite sheet, exactly 1664 × 936 pixels, opaque RGB.
Input images in order: Image 1 (far-day.png) is the primary reference for the cloud sea's painted rendering and cool palette. Image 2 (style-hero-day.png) is a supporting overall painting style reference. These are references only; paint only the three isolated clouds described below.

Three separate small fair-weather clouds on a flat magenta #FF00FF background, side by side in a row across the canvas, each fully surrounded by magenta with at least 80 px of clear magenta between them and around the canvas edges; none touches another or the edge. From left to right: a long low cumulus about 600 px wide and 200 px tall; a medium one about 420 px wide and 160 px tall; a small wisp about 300 px wide and 110 px tall. Each is vertically centred on the canvas. They are distant clouds seen from a mountain: soft, rounded, gently layered cumulus with flattened bases, broader than tall, painted in the same soft painterly rendering as the cloud sea in the first image, with smooth gradient shading and soft-edged brushwork. Light from the UPPER RIGHT: tops and right sides lit near-white #f3f4f6, undersides and left flanks in cool soft blue #bfceef to #a9bde6, no grey, no warm tint. The edge against the magenta is soft but clean: the cloud's own colour runs right to its edge, never blending into pink or magenta, no halo, no glow, no shadow on the magenta. No sky, no gradient, no mountains, no ground, no sun, no birds, no text.

Exact layout guidance on the 1664 × 936 canvas: left cloud bounds approximately x=80..680, y=368..568; middle x=772..1192, y=388..548; small right x=1284..1584, y=413..523. Keep every bit of cloud paint inside those boxes and all the surrounding canvas exactly solid #FF00FF. Natural irregular cumulus silhouettes, not vector pills.
CRITICAL spacing correction: previous outputs sprawled into the empty margins. Make the clouds distinctly smaller within the canvas. Use three isolated cloud islands occupying only about 30%, 21%, and 15% of canvas width. Their centre points are at 23%, 58%, and 85% of the canvas width, all at 50% canvas height. Keep a broad magenta moat of at least 120 pixels around each cloud. Approximate cloud widths 500, 350, 240 pixels, heights 180, 140, 85 pixels. Empty magenta must dominate the sheet. Do not stretch the clouds to fill their available space. The rightmost cloud is a thin wisp. The background must be pure digital flat RGB(255,0,255), no noise or paper texture or colour variation in the background. Use a soft painted interior but clean unpolluted cool-white/blue edge pixels, never pink antialiasing. Output exactly 1664 by 936.
```

### Night attempt 1

```text
Use case: lighting-weather.
Asset type: painted sky cloud sprite sheet, exactly 1664 × 936 pixels.
Inputs in order: Image 1 (clouds-day.png) is the edit target and its geometry is locked. Image 2 (far-night.png) is the primary night cloud sea lighting/palette reference. Image 3 (style-hero-night.png) is the supporting overall night painting style reference.

Image edit. Keep these three clouds exactly as they are: the same shapes, outlines, sizes and places, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a calm moonlit Alpine night, matching the night cloud sea in the second image: the moon is high at the TOP RIGHT, so the tops and right sides catch a pale silver-blue moonlight (#9fb2d2 to #b7c8e0) and the undersides and left flanks fall into deep slate blue (#34486b to #2a3a5c). Soft painterly rendering as before. No stars, no moon, no sky, no warm light.

Absolute invariants: preserve the exact pixel silhouettes and every little wisp of Image 1. Do not redraw, expand, erode, shift, rescale, add or remove any cloud. Change only the cloud RGB colours. Every magenta pixel must remain exactly RGB(255,0,255). No pink or purple contamination in cloud edge pixels. Maintain the source canvas 1664 × 936.
```

### Night attempt 2 — selected source

```text
Use case: lighting-weather.
Asset type: painted sky cloud sprite sheet, exactly 1664 × 936 pixels.
Inputs in order: Image 1 (clouds-day.png) is the edit target and its geometry is locked. Image 2 (far-night.png) is the primary night cloud sea lighting/palette reference. Image 3 (style-hero-night.png) is the supporting overall night painting style reference.

Image edit. Keep these three clouds exactly as they are: the same shapes, outlines, sizes and places, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a calm moonlit Alpine night, matching the night cloud sea in the second image: the moon is high at the TOP RIGHT, so the tops and right sides catch a pale silver-blue moonlight (#9fb2d2 to #b7c8e0) and the undersides and left flanks fall into deep slate blue (#34486b to #2a3a5c). Soft painterly rendering as before. No stars, no moon, no sky, no warm light.

Absolute invariants: preserve the exact pixel silhouettes and every little wisp of Image 1. Do not redraw, expand, erode, shift, rescale, add or remove any cloud. Change only the cloud RGB colours. Every magenta pixel must remain exactly RGB(255,0,255). No pink or purple contamination in cloud edge pixels. Maintain the source canvas 1664 × 936.
Correction for this retry: an earlier night edit slightly eroded and redrew the finest edge wisps (about 3% of silhouette union). Preserve those pixels and the cloud bases exactly. Treat the first image like a strict selection mask: recolour within the three existing painted shapes only, with zero geometric change. Keep the interior soft and airy rather than stormy, with a little more pale silver-blue on the top-right lobes. Do not give the clouds a surrounding blue halo or a pink edge.
```
