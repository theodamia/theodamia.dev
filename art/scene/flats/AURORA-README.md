# Aurora paintings for The Ascent

Created 2026-10-25 with the built-in imagegen tool. Artwork only; no application code, configuration, package files, or commits were changed by this task.

## Deliverables

| File               | Final size    | Format         | Selected try |
| ------------------ | ------------- | -------------- | ------------ |
| `raw/aurora-1.png` | 1664 × 936 px | Opaque RGB PNG | 3 of 3       |
| `raw/aurora-2.png` | 1664 × 936 px | Opaque RGB PNG | 3 of 3       |

The first painting is the broad ascending main curtain with folds and taller middle rays. The second is a thinner, dimmer descending companion arc, concentrated near the upper half.

## Inputs

Every generation used these two local reference images, in this exact order:

1. `art/scene/style/frames/style-hero-night.png` — reference for painted style and night palette.
2. `art/scene/flats/raw/far-night.png` — reference for the same painted world and atmosphere. Its magenta backdrop was explicitly excluded.

These were reference images, not edit targets. Each try was a separate generation from the same two references. All calls used `transparent_background: false`. No CLI/API fallback was used.

## Validation and remaining failure

**The background is not pure black everywhere.** All three generated tries for each painting contained scattered near-black background values. The selected outputs still contain those values inside the image area. They do **not** completely satisfy the requirement that every non-aurora pixel be exactly #000000. They are the best retained versions after three generation tries per painting.

The exact output dimensions and outer margins do pass:

| Check on final saved PNGs                             | aurora-1                            | aurora-2                            |
| ----------------------------------------------------- | ----------------------------------- | ----------------------------------- |
| Dimensions                                            | 1664 × 936                          | 1664 × 936                          |
| Four corner RGB samples                               | all (0,0,0)                         | all (0,0,0)                         |
| Nonblack pixels on the outermost edges                | 0                                   | 0                                   |
| Nonblack pixels in the complete 60 px perimeter strip | 0 of 297,600                        | 0 of 297,600                        |
| Minimum guaranteed solid-black margins                | left/right 120 px; top/bottom 68 px | left/right 120 px; top/bottom 68 px |
| Any part touching the canvas border                   | No                                  | No                                  |
| Stars, landscape, moon, text                          | None visible                        | None visible                        |
| Pure black throughout all non-aurora areas            | **Fail**                            | **Fail**                            |

Validation decoded the PNG pixels losslessly using Python standard-library PNG/zlib inspection; that inspection did not modify the paintings. The 60 px strips were checked exhaustively, not only sampled.

For a concrete counterexample to an all-black background, the visibly empty interior strip x=120..1543, y=820..867 contains 8,460 nonblack pixels in aurora-1 and 6,933 in aurora-2. These are faint generated residue, not aurora. For aurora-1, the blank-background sample at (832,800) is RGB (1,0,0).

The bounding boxes of pixels whose brightest channel exceeds 8/255 are x=182..1492, y=172..742 for aurora-1, and x=185..1486, y=156..475 for aurora-2 (inclusive, zero-based). This threshold describes the visible light, not a proof of a clean background. The second arc's faint glow reaches about 8 px below the horizontal midpoint.

## Export

The generator returned slightly oversized canvases despite the exact-size prompt. The selected third tries were both 1672 × 941 px. For final export, macOS `sips` resized each complete generated canvas to 1424 × 800, then centered it on a solid #000000 1664 × 936 canvas. This creates the verified black margins without clipping the aurora. An earlier direct crop was superseded by this padded export; the delivered files are the padded versions.

No procedural painting, threshold cleanup, brightness-to-alpha conversion, or application integration was performed. The final PNGs remain opaque black-backed paintings.

SHA-256:

- `raw/aurora-1.png`: `f55907aa15554da4652ba8d7bbd5dbcb65d823957782855d2f47bc6f74bc6b93`
- `raw/aurora-2.png`: `c367e0f865521b3fe27463ab23ec98b0fc74e2dba997f46cb0f7cbdcf66fe4a2`

## Tries

The following measurements describe the generated canvases before final export.

| Painting | Try | Generated size | Nonblack pixels in 60 px border | Assessment                                                                                   |
| -------- | --- | -------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| aurora-1 | 1   | 1672 × 941     | 49,733                          | Broad ascending folds; violet too strong; near-black background and insufficient margins.    |
| aurora-1 | 2   | 1672 × 941     | 45,138                          | Less violet; background and margins still fail.                                              |
| aurora-1 | 3   | 1672 × 941     | 39,481                          | Selected: softer, calmer colour and best margins of its three tries; background still fails. |
| aurora-2 | 1   | 1672 × 941     | 43,531                          | Descending arc extends too low; too much violet; background fails.                           |
| aurora-2 | 2   | 1673 × 940     | 38,895                          | Thinner and higher; background and margins still fail.                                       |
| aurora-2 | 3   | 1672 × 941     | 33,913                          | Selected: thinnest, faintest and calmest companion; background still fails.                  |

Three tries were made per painting; the third try of each was retained. No additional generation was performed after that limit.

## Complete prompts

These are the full prompt strings sent to the built-in tool, including the cumulative revisions. Both references above were supplied on every call.

### aurora-1, try 1

```text
Use case: stylized-concept.
Asset type: isolated aurora painting for a brightness-to-opacity website overlay.
Generate one standalone opaque RGB PNG painting, exactly 1664 × 936 pixels, landscape 16:9. Pure solid black #000000 background, NOT transparent.
Input images, in order: Image 1 (style-hero-night.png) is a reference for the soft painted night world's style and palette only. Image 2 (far-night.png) is a reference for the same world's mountains and atmosphere only. Do not copy any objects or backgrounds from either reference. Ignore the second reference's magenta entirely.
Primary request: A broad aurora band sweeping across the whole width in a long, gentle S-curve, its bright lower edge running from the lower left third up to the upper right, curtains folding two or three times along its length, rays tallest in the middle. It fills roughly the middle 70% of the canvas height.
Painterly aurora borealis on a pure black #000000 background, in the soft painted style of the attached night scene: smooth gradient shading and soft-edged brushwork, no photo realism, no noise or grain, no hard neon. Curtains of light with fine vertical rays, hanging from a bright, sharper lower edge and fading softly upward. Colour: luminous green (#5fe0a0 to #3cc98a) at the lower edge and the body, a cool teal (#3fb6b0) where it is faint, and only a faint violet-rose (#9a7ad6, #c48ad0) high at the top of the tallest rays; no yellow, no orange, no white blow-out. Every edge of the aurora dissolves softly into the black, and nothing touches the canvas border: at least 60 px of pure black on every side. Everything that is not aurora is pure black #000000.
No stars, no sky gradient, no mountains, no ground, no clouds, no moon, no text, no frame or watermark. No tiny specks of light separate from the aurora. Outside the aurora and all along the canvas edges, every pixel must be exactly RGB (0,0,0), not dark gray, not tinted blue. Leave a generous black safety margin, preferably 90 px or more, so the softest glow fades completely to exact black before the mandatory 60 px border.
```

### aurora-1, try 2

```text
Use case: stylized-concept.
Asset type: isolated aurora painting for a brightness-to-opacity website overlay.
Generate one standalone opaque RGB PNG painting, exactly 1664 × 936 pixels, landscape 16:9. Pure solid black #000000 background, NOT transparent.
Input images, in order: Image 1 (style-hero-night.png) is a reference for the soft painted night world's style and palette only. Image 2 (far-night.png) is a reference for the same world's mountains and atmosphere only. Do not copy any objects or backgrounds from either reference. Ignore the second reference's magenta entirely.
Primary request: A broad aurora band sweeping across the whole width in a long, gentle S-curve, its bright lower edge running from the lower left third up to the upper right, curtains folding two or three times along its length, rays tallest in the middle. It fills roughly the middle 70% of the canvas height.
Painterly aurora borealis on a pure black #000000 background, in the soft painted style of the attached night scene: smooth gradient shading and soft-edged brushwork, no photo realism, no noise or grain, no hard neon. Curtains of light with fine vertical rays, hanging from a bright, sharper lower edge and fading softly upward. Colour: luminous green (#5fe0a0 to #3cc98a) at the lower edge and the body, a cool teal (#3fb6b0) where it is faint, and only a faint violet-rose (#9a7ad6, #c48ad0) high at the top of the tallest rays; no yellow, no orange, no white blow-out. Every edge of the aurora dissolves softly into the black, and nothing touches the canvas border: at least 60 px of pure black on every side. Everything that is not aurora is pure black #000000.
No stars, no sky gradient, no mountains, no ground, no clouds, no moon, no text, no frame or watermark. No tiny specks of light separate from the aurora. Outside the aurora and all along the canvas edges, every pixel must be exactly RGB (0,0,0), not dark gray, not tinted blue. Leave a generous black safety margin, preferably 90 px or more, so the softest glow fades completely to exact black before the mandatory 60 px border.
Revision for attempt 2: Restrain the violet so it is only a very faint trace at the tallest ray tips; green and teal must dominate. Keep the overall feel softer, calmer, more painterly. Confine ALL aurora including its faint glow within x=110..1554 and y=130..800 on the 1664x936 canvas; there must be at least 100px absolutely solid pure black on every side. Explicitly render the black background as mathematically pure RGB 0,0,0 with no noise, no dithering, no texture, no dark coloured haze. Deliver exactly 1664x936.
```

### aurora-1, try 3 (selected)

```text
Use case: stylized-concept.
Asset type: isolated aurora painting for a brightness-to-opacity website overlay.
Generate one standalone opaque RGB PNG painting, exactly 1664 × 936 pixels, landscape 16:9. Pure solid black #000000 background, NOT transparent.
Input images, in order: Image 1 (style-hero-night.png) is a reference for the soft painted night world's style and palette only. Image 2 (far-night.png) is a reference for the same world's mountains and atmosphere only. Do not copy any objects or backgrounds from either reference. Ignore the second reference's magenta entirely.
Primary request: A broad aurora band sweeping across the whole width in a long, gentle S-curve, its bright lower edge running from the lower left third up to the upper right, curtains folding two or three times along its length, rays tallest in the middle. It fills roughly the middle 70% of the canvas height.
Painterly aurora borealis on a pure black #000000 background, in the soft painted style of the attached night scene: smooth gradient shading and soft-edged brushwork, no photo realism, no noise or grain, no hard neon. Curtains of light with fine vertical rays, hanging from a bright, sharper lower edge and fading softly upward. Colour: luminous green (#5fe0a0 to #3cc98a) at the lower edge and the body, a cool teal (#3fb6b0) where it is faint, and only a faint violet-rose (#9a7ad6, #c48ad0) high at the top of the tallest rays; no yellow, no orange, no white blow-out. Every edge of the aurora dissolves softly into the black, and nothing touches the canvas border: at least 60 px of pure black on every side. Everything that is not aurora is pure black #000000.
No stars, no sky gradient, no mountains, no ground, no clouds, no moon, no text, no frame or watermark. No tiny specks of light separate from the aurora. Outside the aurora and all along the canvas edges, every pixel must be exactly RGB (0,0,0), not dark gray, not tinted blue. Leave a generous black safety margin, preferably 90 px or more, so the softest glow fades completely to exact black before the mandatory 60 px border.
Revision for attempt 2: Restrain the violet so it is only a very faint trace at the tallest ray tips; green and teal must dominate. Keep the overall feel softer, calmer, more painterly. Confine ALL aurora including its faint glow within x=110..1554 and y=130..800 on the 1664x936 canvas; there must be at least 100px absolutely solid pure black on every side. Explicitly render the black background as mathematically pure RGB 0,0,0 with no noise, no dithering, no texture, no dark coloured haze. Deliver exactly 1664x936.
Final attempt, critical technical requirements: Use a flat digital RGB (0,0,0) canvas, with no global effects or simulated grain. Paint only the aurora. ALL the surrounding background pixels, all four corners, every edge and a full 100px margin must be exactly #000000, with absolutely no near-black values such as (1,1,1) or (1,0,0). The glow must completely cease before that margin. Avoid any light scattered outside the curtain. Make this feel like a calm hand-painted fantasy illustration with smooth, broad brushwork and fine soft vertical rays rather than sharp luminous streaks. Limit violet to extremely subtle, desaturated traces on the tips only.
```

### aurora-2, try 1

```text
Use case: stylized-concept.
Asset type: isolated aurora painting for a brightness-to-opacity website overlay.
Generate one standalone opaque RGB PNG painting, exactly 1664 × 936 pixels, landscape 16:9. Pure solid black #000000 background, NOT transparent.
Input images, in order: Image 1 (style-hero-night.png) is a reference for the soft painted night world's style and palette only. Image 2 (far-night.png) is a reference for the same world's mountains and atmosphere only. Do not copy any objects or backgrounds from either reference. Ignore the second reference's magenta entirely.
Primary request: A thinner, fainter aurora arc: one long ribbon of curtain across most of the width, higher and calmer than a main display, gently curving the opposite way (bright lower edge from the upper left down toward the right), with short rays, mostly green and teal and only a breath of violet at its top. It sits in the upper half of the canvas.
Painterly aurora borealis on a pure black #000000 background, in the soft painted style of the attached night scene: smooth gradient shading and soft-edged brushwork, no photo realism, no noise or grain, no hard neon. Curtains of light with fine vertical rays, hanging from a bright, sharper lower edge and fading softly upward. Colour: luminous green (#5fe0a0 to #3cc98a) at the lower edge and the body, a cool teal (#3fb6b0) where it is faint, and only a faint violet-rose (#9a7ad6, #c48ad0) high at the top of the tallest rays; no yellow, no orange, no white blow-out. Every edge of the aurora dissolves softly into the black, and nothing touches the canvas border: at least 60 px of pure black on every side. Everything that is not aurora is pure black #000000.
No stars, no sky gradient, no mountains, no ground, no clouds, no moon, no text, no frame or watermark. No tiny specks of light separate from the aurora. Outside the aurora and all along the canvas edges, every pixel must be exactly RGB (0,0,0), not dark gray, not tinted blue. Leave a generous black safety margin, preferably 90 px or more, so the softest glow fades completely to exact black before the mandatory 60 px border.
This is the fainter companion layer; keep it airy and restrained, with its entire visible ribbon in the upper half, and pure black throughout the lower half.
```

### aurora-2, try 2

```text
Use case: stylized-concept.
Asset type: isolated aurora painting for a brightness-to-opacity website overlay.
Generate one standalone opaque RGB PNG painting, exactly 1664 × 936 pixels, landscape 16:9. Pure solid black #000000 background, NOT transparent.
Input images, in order: Image 1 (style-hero-night.png) is a reference for the soft painted night world's style and palette only. Image 2 (far-night.png) is a reference for the same world's mountains and atmosphere only. Do not copy any objects or backgrounds from either reference. Ignore the second reference's magenta entirely.
Primary request: A thinner, fainter aurora arc: one long ribbon of curtain across most of the width, higher and calmer than a main display, gently curving the opposite way (bright lower edge from the upper left down toward the right), with short rays, mostly green and teal and only a breath of violet at its top. It sits in the upper half of the canvas.
Painterly aurora borealis on a pure black #000000 background, in the soft painted style of the attached night scene: smooth gradient shading and soft-edged brushwork, no photo realism, no noise or grain, no hard neon. Curtains of light with fine vertical rays, hanging from a bright, sharper lower edge and fading softly upward. Colour: luminous green (#5fe0a0 to #3cc98a) at the lower edge and the body, a cool teal (#3fb6b0) where it is faint, and only a faint violet-rose (#9a7ad6, #c48ad0) high at the top of the tallest rays; no yellow, no orange, no white blow-out. Every edge of the aurora dissolves softly into the black, and nothing touches the canvas border: at least 60 px of pure black on every side. Everything that is not aurora is pure black #000000.
No stars, no sky gradient, no mountains, no ground, no clouds, no moon, no text, no frame or watermark. No tiny specks of light separate from the aurora. Outside the aurora and all along the canvas edges, every pixel must be exactly RGB (0,0,0), not dark gray, not tinted blue. Leave a generous black safety margin, preferably 90 px or more, so the softest glow fades completely to exact black before the mandatory 60 px border.
This is the fainter companion layer; keep it airy and restrained, with its entire visible ribbon in the upper half, and pure black throughout the lower half.
Revision for attempt 2: Make the ribbon distinctly dimmer than a main display, thin, calm and green-teal, with negligible violet. Confine ALL aurora including its faint glow to x=110..1554 and y=110..450 on the 1664x936 canvas; the entire lower half must be absolutely solid pure black. Rays are short, softly painted and smoothly shaded. Explicitly render the black background as mathematically pure RGB 0,0,0 with no noise, no dithering, no texture, no dark coloured haze. Deliver exactly 1664x936.
```

### aurora-2, try 3 (selected)

```text
Use case: stylized-concept.
Asset type: isolated aurora painting for a brightness-to-opacity website overlay.
Generate one standalone opaque RGB PNG painting, exactly 1664 × 936 pixels, landscape 16:9. Pure solid black #000000 background, NOT transparent.
Input images, in order: Image 1 (style-hero-night.png) is a reference for the soft painted night world's style and palette only. Image 2 (far-night.png) is a reference for the same world's mountains and atmosphere only. Do not copy any objects or backgrounds from either reference. Ignore the second reference's magenta entirely.
Primary request: A thinner, fainter aurora arc: one long ribbon of curtain across most of the width, higher and calmer than a main display, gently curving the opposite way (bright lower edge from the upper left down toward the right), with short rays, mostly green and teal and only a breath of violet at its top. It sits in the upper half of the canvas.
Painterly aurora borealis on a pure black #000000 background, in the soft painted style of the attached night scene: smooth gradient shading and soft-edged brushwork, no photo realism, no noise or grain, no hard neon. Curtains of light with fine vertical rays, hanging from a bright, sharper lower edge and fading softly upward. Colour: luminous green (#5fe0a0 to #3cc98a) at the lower edge and the body, a cool teal (#3fb6b0) where it is faint, and only a faint violet-rose (#9a7ad6, #c48ad0) high at the top of the tallest rays; no yellow, no orange, no white blow-out. Every edge of the aurora dissolves softly into the black, and nothing touches the canvas border: at least 60 px of pure black on every side. Everything that is not aurora is pure black #000000.
No stars, no sky gradient, no mountains, no ground, no clouds, no moon, no text, no frame or watermark. No tiny specks of light separate from the aurora. Outside the aurora and all along the canvas edges, every pixel must be exactly RGB (0,0,0), not dark gray, not tinted blue. Leave a generous black safety margin, preferably 90 px or more, so the softest glow fades completely to exact black before the mandatory 60 px border.
This is the fainter companion layer; keep it airy and restrained, with its entire visible ribbon in the upper half, and pure black throughout the lower half.
Revision for attempt 2: Make the ribbon distinctly dimmer than a main display, thin, calm and green-teal, with negligible violet. Confine ALL aurora including its faint glow to x=110..1554 and y=110..450 on the 1664x936 canvas; the entire lower half must be absolutely solid pure black. Rays are short, softly painted and smoothly shaded. Explicitly render the black background as mathematically pure RGB 0,0,0 with no noise, no dithering, no texture, no dark coloured haze. Deliver exactly 1664x936.
Final attempt, critical technical requirements: Use a flat digital RGB (0,0,0) canvas, with no global effects or simulated grain. Paint only the aurora. ALL the surrounding background pixels, all four corners, every edge and a full 100px margin must be exactly #000000, with absolutely no near-black values such as (1,1,1) or (1,0,0). The glow must completely cease before that margin. Avoid any light scattered outside the curtain. Make this feel like a calm hand-painted fantasy illustration with smooth, broad brushwork and fine soft vertical rays rather than sharp luminous streaks. Limit violet to extremely subtle, desaturated traces on the tips only.
```
