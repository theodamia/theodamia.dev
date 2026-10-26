# What's ahead — artwork generation record

Created 2026-10-26 with the built-in image_gen tool, following the imagegen skill. Artwork only. No code, configuration, package or existing source artwork was edited, and no commit was made.

## Result and limitations

The five requested PNGs are saved in `raw/ahead/`. These are the best of three image-tool tries per asset (15 calls total). They have the requested final canvas dimensions. The land files are opaque RGB PNGs with magenta sky, as requested, rather than alpha cutouts.

**The strict pixel requirements did not pass.** All land skies look cleanly magenta and contain no surviving sun, sky clouds, stars or moon, but the tool produced subtle colour variation instead of a flat exact #FF00FF fill. The lighting edits retain very close composition, but their silhouettes and painted detail are not identical. The sun contains near-black background pixels rather than perfectly pure #000000 everywhere outside its light. No masks, colour replacement, cleanup, alignment transforms, cropping or repainting were applied to fix these failures.

Only `sun.png` was resized: its selected tool output was 1254 × 1254, resized to exactly 1024 × 1024 with macOS `sips -z 1024 1024`. All land images were returned at 1536 × 1024 and copied byte-for-byte from the selected tool output.

## Inputs

1. `raw/concepts/c1-dawn-ahead.png`: approved composition; sole edit target for every sunrise try; colour reference for every sun try.
2. `raw/ahead/land-sunrise.png`: selected sunrise try 1; first and sole edit target for every alpenglow and predawn try; first edit input for every night try. This file stayed unchanged throughout all lighting attempts.
3. `../scene/style/frames/style-hero-night.png` (repository path `art/scene/style/frames/style-hero-night.png`): second input for night only, used for lighting/style, not terrain or objects.

All calls used `transparent_background: false` and explicit local `referenced_image_paths` in the order above. The model and generation size were controlled by the built-in tool; the desired dimensions were written in each prompt.

## Selected images and how they read

| File               | Selected try | Final dimensions | Reading                                                                                                 |
| ------------------ | -----------: | ---------------- | ------------------------------------------------------------------------------------------------------- |
| land-sunrise.png   |            1 | 1536 × 1024      | Bright warm white-gold snow, peach cloud tops and a sunlit snowy col; closest to the approved frame.    |
| land-alpenglow.png |            2 | 1536 × 1024      | Rose-pink summit faces above soft blue-violet shadow; some summit light covers more than the very tips. |
| land-predawn.png   |            1 | 1536 × 1024      | Deep cool blue/slate, quiet unlit snow and clouds, with a faint pale skyline rim.                       |
| land-night.png     |            3 | 1536 × 1024      | Darker navy shadows and subdued silver-blue snow/clouds, clearly darker than predawn.                   |
| sun.png            |            3 | 1024 × 1024      | Small centred white-gold disc and soft golden glow; no rays, lens flare, clouds or other objects.       |

## Checks

All 15 outputs were visually reviewed. Selected lighting variants were checked in in-memory 50% overlays against sunrise: full frames at reduced display size, plus native-resolution crops of the main summit and foreground rocks. Overall peaks, cloud masses and rocks register closely; small edge shifts and painted-detail changes remain. No diagnostic overlays or analytical masks were saved.

Read-only PNG inspection used the Python standard library to decode RGB pixels. Pillow was unavailable; nothing was installed. Skyline measurements used the first run of three non-magenta pixels in each column, beginning at row 140, with a permissive magenta test (R > 230, G < 25, B > 230). This measures approximate registration, not proof of identical geometry, and can react to stray sky pixels. Mean land brightness is a sampled Rec.709-weighted RGB luma below row 350, not a physical light measurement.

| Selected light | Most frequent sampled top-sky RGB | Mean skyline difference vs sunrise | 95th percentile | Maximum | Mean sampled land luma (0–255) |
| -------------- | --------------------------------- | ---------------------------------: | --------------: | ------: | -----------------------------: |
| sunrise        | (249, 2, 249)                     |                               0 px |            0 px |    0 px |                         166.41 |
| alpenglow      | (248, 3, 248)                     |                           0.396 px |            1 px |   10 px |                          97.01 |
| predawn        | (246, 4, 248)                     |                           0.452 px |            1 px |   10 px |                          78.15 |
| night          | (249, 3, 242)                     |                           1.417 px |            3 px |   11 px |                           66.1 |

No sampled pixel in the upper 140 rows of any land try was exact RGB (255,0,255); every second pixel in both axes was sampled. This alone is sufficient to fail the exact-flat-magenta requirement. Visual skyline checks found crisp overall edges with small near-magenta edge contamination and local shape changes, not a guaranteed clean one-pixel key boundary.

The selected sun's bright-disc width along its centre row is approximately 130 px (all RGB channels >150); its horizontal midpoint is x=511.5. The glow measures approximately 422 px at red >16, or 457 px at red >8, so its faint outer tail extends beyond 420 px. Outside radius 210 px, about 76.34% of pixels are exact black; the maximum channel value there is 21. About 85.62% of border pixels are exact black. Corner RGBs clockwise from top-left are (1,1,0), (1,0,0), (0,1,0), (1,2,1). The exact pure-black requirement therefore fails.

## Every try and complete prompts

The generated originals remain at the tool's default destination:
`/Users/teo/.codex/generated_images/01a177f4-61c5-7a73-b9a6-e9b2a1eea1f5/`.
Only the five selected PNGs were copied into this project. Discarded variants were not added to the artwork directory.

The following sections contain the complete prompt strings actually submitted, including repeated constraints and correction text. Asset order below is grouped for review; the actual call order was: sunrise 1, alpenglow 1, predawn 1, night 1, night 2, sun 1, sunrise 2, sunrise 3, alpenglow 2, predawn 2, night 3, sun 2, alpenglow 3, predawn 3, sun 3.

### land-sunrise.png

Inputs: approved concept only.

#### Try 1 — selected

Original tool file: `exec-a21ef48e-01c5-4a8c-b950-fdabf280a23b.png`.

Selected. Closest preservation of the approved land, with the lowest sampled mean absolute channel difference below y=360 (4.684 versus 6.214 and 5.095 for tries 2 and 3). Sky visually clean and free of sun/high clouds, but not exact flat #FF00FF; land also is not a pixel-identical copy.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (249, 2, 249); exact magenta samples 0; skyline mean/P95/max difference 0/0/0 px; sampled mean land luma 166.41.

```text
Image edit. Keep the far range, the sea of clouds and the near col exactly as they are (every shape, colour, light and place). Replace the whole sky, including the sun, its glow and the high clouds, with flat pure magenta #FF00FF, cut cleanly along the skyline of the peaks. The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Input image 1 is the edit target. Preserve its full framing without cropping, resizing features, or repainting the land.
```

#### Try 2

Original tool file: `exec-ca37da15-56f4-4230-bd93-c5b6874bbbac.png`.

Rejected. Similar warm light, but slightly more land repainting and silhouette drift; sky still near-magenta rather than exact.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (249, 2, 248); exact magenta samples 0; skyline mean/P95/max difference 0.829/3/11 px; sampled mean land luma 164.88.

```text
Image edit. Keep the far range, the sea of clouds and the near col exactly as they are (every shape, colour, light and place). Replace the whole sky, including the sun, its glow and the high clouds, with flat pure magenta #FF00FF, cut cleanly along the skyline of the peaks. The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Input image 1 is the edit target. Preserve its full framing without cropping, resizing features, or repainting the land.
Critical correction: the previous attempt failed because the sky was approximately magenta with noisy pixels around RGB (249,2,249). The ENTIRE sky must be a mathematically uniform solid colour: RGB (255,0,255) / #FF00FF at every sky pixel. Treat it as a flat untextured colour field, with no grain, dithering, shading, texture, compression-like noise, or subtle variation of any kind. This requirement includes all four top corners and the entire area above the exact mountain silhouette. Do not make it purple-pink or near-magenta. Preserve the land's original painting exactly, including every cloud, snowfield, and foreground rock. Return exactly 1536 × 1024.
```

#### Try 3

Original tool file: `exec-769d993f-c6e8-4c6a-bc76-16d961abca5a.png`.

Rejected. Slight geometry changes and a noisier, redder magenta field. Exact background requirement still fails.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (251, 6, 250); exact magenta samples 0; skyline mean/P95/max difference 1.243/4/11 px; sampled mean land luma 167.4.

```text
Image edit. Keep the far range, the sea of clouds and the near col exactly as they are (every shape, colour, light and place). Replace the whole sky, including the sun, its glow and the high clouds, with flat pure magenta #FF00FF, cut cleanly along the skyline of the peaks. The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Input image 1 is the edit target. Preserve its full framing without cropping, resizing features, or repainting the land.
Final correction, priority over aesthetic changes: this is a production chroma-key plate, so the sky is an exact solid RGB(255,0,255) fill. No simulated paint or photographed texture in the sky, no near-magenta pixels, no chromatic noise. Make the fill perfectly uniform, and keep a clean single-pixel transition on the existing summit silhouette. Preserve the original land geometry, all original painted colours and lighting, and the precise registration of every rock and cloud. Canvas is 1536 pixels wide and 1024 pixels high.
```

### land-alpenglow.png

Inputs: selected land-sunrise.png only.

#### Try 1

Original tool file: `exec-285963ea-5803-4413-8e78-7770b577dc08.png`.

Rose-lit summits and convincingly cool shadows. Sky colour fails exactness and some skyline details drift.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (247, 3, 246); exact magenta samples 0; skyline mean/P95/max difference 0.582/1/16 px; sampled mean land luma 101.05.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Just before sunrise: only the highest summits of the far range glow rose-pink with the first sun on their tips; everything below them, the lower slopes, the sea of clouds and the near col, is still in soft cool blue-violet shadow.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky.
```

#### Try 2 — selected

Original tool file: `exec-d094b413-3417-4781-a78b-68fdc021f480.png`.

Selected. Best skyline registration of these three and a clean separation of pink summit light from blue-violet lower slopes, clouds and foreground. Sky remains subtly varied near-magenta.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (248, 3, 248); exact magenta samples 0; skyline mean/P95/max difference 0.396/1/10 px; sampled mean land luma 97.01.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Just before sunrise: only the highest summits of the far range glow rose-pink with the first sun on their tips; everything below them, the lower slopes, the sea of clouds and the near col, is still in soft cool blue-violet shadow.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky.
Critical background correction: all previous approximately magenta fills failed. Every sky pixel must be precisely RGB (255,0,255), a uniform digital colour fill with zero texture, zero noise, zero shading, no variation. Keep the existing skyline crisp. Keep all foreground rocks, snow ripples, ridges, and cloud lobes exactly registered to the first image. No creative reinterpretation or geometry changes.
```

#### Try 3

Original tool file: `exec-9f33bc81-b86c-4199-bb08-60b09414fffe.png`.

Rejected. Pink-violet tint spreads more into the clouds and foreground; weaker magenta accuracy and registration.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (246, 4, 238); exact magenta samples 0; skyline mean/P95/max difference 0.671/2/10 px; sampled mean land luma 100.99.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Just before sunrise: only the highest summits of the far range glow rose-pink with the first sun on their tips; everything below them, the lower slopes, the sea of clouds and the near col, is still in soft cool blue-violet shadow.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky.
Final retry: match the first image's silhouette and internal geometry pixel for pixel, including minor summits on both outer edges, every cloud lobe and all foreground rocks. Apply only the requested relighting. The background is a perfectly flat solid digital key colour #FF00FF (255,0,255), no texture, noise, dithering, gradient or antialiased halo. Do not repaint or redesign the land. Exactly 1536×1024 pixels.
```

### land-predawn.png

Inputs: selected land-sunrise.png only.

#### Try 1 — selected

Original tool file: `exec-2a7c489e-a5a6-48b2-acc8-4e1f0e0ce05e.png`.

Selected. Deep cool blue/slate, no warm direct light, with a restrained pale rim. Best overall blue-hour reading. Small skyline and brushwork differences remain; background not exact.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (246, 4, 248); exact magenta samples 0; skyline mean/P95/max difference 0.452/1/10 px; sampled mean land luma 78.15.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Before dawn, the blue hour: no direct light anywhere, the whole range, the sea of clouds and the near col in deep cool blue and slate, the snow pale blue-grey, quiet and still, a faint lighter rim along the very top of the skyline from the sky behind.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky.
```

#### Try 2

Original tool file: `exec-666874e1-5d3e-4ea8-9dfa-75c18d586c8c.png`.

Rejected. Good registration but brighter, with a more assertive skyline rim than try 1. Background still not exact.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (248, 5, 248); exact magenta samples 0; skyline mean/P95/max difference 0.444/1/9 px; sampled mean land luma 86.43.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Before dawn, the blue hour: no direct light anywhere, the whole range, the sea of clouds and the near col in deep cool blue and slate, the snow pale blue-grey, quiet and still, a faint lighter rim along the very top of the skyline from the sky behind.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky.
Critical background correction: all previous approximately magenta fills failed. Every sky pixel must be precisely RGB (255,0,255), a uniform digital colour fill with zero texture, zero noise, zero shading, no variation. Keep the existing skyline crisp. Keep all foreground rocks, snow ripples, ridges, and cloud lobes exactly registered to the first image. No creative reinterpretation or geometry changes.
```

#### Try 3

Original tool file: `exec-86d9414c-3a66-4a1e-9c5f-db19960341ff.png`.

Rejected. Brighter overall, with small skyline artifacts, including a short left-edge defect detected by the skyline test. Sky still not exact.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (243, 6, 247); exact magenta samples 0; skyline mean/P95/max difference 0.622/1/123 px; sampled mean land luma 84.98.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Before dawn, the blue hour: no direct light anywhere, the whole range, the sea of clouds and the near col in deep cool blue and slate, the snow pale blue-grey, quiet and still, a faint lighter rim along the very top of the skyline from the sky behind.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky.
Final retry: match the first image's silhouette and internal geometry pixel for pixel, including minor summits on both outer edges, every cloud lobe and all foreground rocks. Apply only the requested relighting. The background is a perfectly flat solid digital key colour #FF00FF (255,0,255), no texture, noise, dithering, gradient or antialiased halo. Do not repaint or redesign the land. Exactly 1536×1024 pixels.
```

### land-night.png

Inputs: selected land-sunrise.png first; style-hero-night.png second, lighting/style only.

#### Try 1

Original tool file: `exec-ac413f3c-9ef3-4a12-b679-7a6fb19882ea.png`.

Rejected. Moonlit silver-blue, but brighter overall than predawn, failing the requested light ordering.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (250, 3, 250); exact magenta samples 0; skyline mean/P95/max difference 0.483/1/10 px; sampled mean land luma 89.35.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Calm moonlit night: everything cool and silver-blue under a moon behind the viewer, the snowfields pale blue, the shadows deep navy, the sea of clouds silvery, darker overall than the blue hour.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky. Image 2 is a lighting and painting-style reference only: use its cool silver-blue and deep navy night palette, but do not copy its terrain, sky, moon, buildings, vegetation, or objects.
```

#### Try 2

Original tool file: `exec-fadab8a3-e3da-4814-9b81-eac45b5b875f.png`.

Improvement. Darker than predawn with better registration than try 3, but less convincing deep night.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (248, 4, 248); exact magenta samples 0; skyline mean/P95/max difference 0.564/2/8 px; sampled mean land luma 72.84.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Calm moonlit night: everything cool and silver-blue under a moon behind the viewer, the snowfields pale blue, the shadows deep navy, the sea of clouds silvery, darker overall than the blue hour.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky. Image 2 is a lighting and painting-style reference only: use its cool silver-blue and deep navy night palette, but do not copy its terrain, sky, moon, buildings, vegetation, or objects.
Correction for this try: the previous night result was brighter than the blue hour and therefore failed. Make the land markedly darker overall: deep navy midtones and shadows, restrained dim silver-blue snow and cloud highlights. The moon behind the viewer is weak, with no bright white or luminous cloud tops, and no direct sunrise-like patches. Maintain visible detail. Preserve the first image's exact shapes and flat #FF00FF sky; the magenta stays fully bright and never darkens.
```

#### Try 3 — selected

Original tool file: `exec-0af4e22c-9795-423b-b009-7d98fb801a01.png`.

Selected. Darkest, with navy shadows, subdued silver-blue snow and cloud highlights. Correct light ordering. Small silhouette drift is greater than try 2. Sky still not exact.

Checks: native 1536 × 1024; most frequent sampled top-sky RGB (249, 3, 242); exact magenta samples 0; skyline mean/P95/max difference 1.417/3/11 px; sampled mean land luma 66.1.

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light, as follows: Calm moonlit night: everything cool and silver-blue under a moon behind the viewer, the snowfields pale blue, the shadows deep navy, the sea of clouds silvery, darker overall than the blue hour.
The sky is flat pure magenta #FF00FF: never tint or blend the magenta, no glow, no halo, no haze bleeding into it, no sun or moon, no stars, no clouds in the sky. Everything that is not sky (the far range, the sea of clouds in the valley, the near snowy col along the bottom) is painted fully and solidly, in the soft polished style of the original, with a clean, crisp skyline against the magenta. No text, letters, logos, people or animals.
Output canvas: exactly 1536 × 1024 pixels. Image 1 is the sole geometry and composition source. Relight its existing painted pixels without moving any feature, changing brushwork, or altering its opaque solid magenta sky. Image 2 is a lighting and painting-style reference only: use its cool silver-blue and deep navy night palette, but do not copy its terrain, sky, moon, buildings, vegetation, or objects.
Correction for this try: the previous night result was brighter than the blue hour and therefore failed. Make the land markedly darker overall: deep navy midtones and shadows, restrained dim silver-blue snow and cloud highlights. The moon behind the viewer is weak, with no bright white or luminous cloud tops, and no direct sunrise-like patches. Maintain visible detail. Preserve the first image's exact shapes and flat #FF00FF sky; the magenta stays fully bright and never darkens.
Critical background correction: all previous approximately magenta fills failed. Every sky pixel must be precisely RGB (255,0,255), a uniform digital colour fill with zero texture, zero noise, zero shading, no variation. Keep the existing skyline crisp. Keep all foreground rocks, snow ripples, ridges, and cloud lobes exactly registered to the first image. No creative reinterpretation or geometry changes.
Reduce land brightness further below the blue hour, with dimmer silvery clouds and snow. The magenta remains full brightness.
```

### sun.png

Inputs: approved concept, sun-colour reference only.

#### Try 1

Original tool file: `exec-7196d882-c9e4-4a90-bc9f-a279e2d542f1.png`.

Rejected. Disc much too large, native canvas wrong, background visibly black but numerically noisy near-black.

Checks: native 1254 × 1254; approximate native bright-disc width 242 px. Background exactness failed.

```text
On pure black #000000: a rising sun as in the image, a bright warm white-gold disc about 120 px across in the centre, with a soft warm golden glow fading out around it to about 420 px across, no rays, no lens flare, no clouds, nothing else. Everything that is not light is pure black.
Output canvas: exactly 1024 × 1024 pixels. The input image is a reference for the sun's warm white-gold colour only; exclude its entire landscape and sky. Place the disc centre at (512,512); the disc diameter is about 120 pixels and the entire soft glow about 420 pixels. Keep the remainder of the canvas exactly solid RGB (0,0,0), not dark grey or a background gradient. No text, border, or watermark.
```

#### Try 2

Original tool file: `exec-30c5de7d-03b7-40b1-87a4-ab7917290606.png`.

Rejected. Disc still too large; native canvas and exact background fail.

Checks: native 1254 × 1254; approximate native bright-disc width 216 px. Background exactness failed.

```text
On pure black #000000: a rising sun as in the image, a bright warm white-gold disc about 120 px across in the centre, with a soft warm golden glow fading out around it to about 420 px across, no rays, no lens flare, no clouds, nothing else. Everything that is not light is pure black.
Output canvas: exactly 1024 × 1024 pixels. The input image is a reference for the sun's warm white-gold colour only; exclude its entire landscape and sky. Place the disc centre at (512,512); the disc diameter is about 120 pixels and the entire soft glow about 420 pixels. Keep the remainder of the canvas exactly solid RGB (0,0,0), not dark grey or a background gradient. No text, border, or watermark.
Correction for this try: the previous result failed because the disc and glow were much too large, the canvas was 1254×1254 rather than 1024×1024, and its black contained noise. Required canvas EXACTLY 1024×1024. The disc occupies only 11.7 percent of the image width (diameter 120 px); the glow occupies only 41 percent of the image width (diameter 420 px). Most of the image is empty exact #000000 black, with no noise, grain, texture or near-black colour. Centre the tiny disc. The bright disc is a uniform warm white-gold with a soft golden radial glow that ends by radius 210 pixels, beyond which every pixel is RGB(0,0,0). No rays, rings or flare.
```

#### Try 3 — selected

Original tool file: `exec-90f00e1e-0f5b-40d8-9803-96007f8fa311.png`.

Selected. Best scale after the permitted canvas resize: roughly 130 px bright disc, about 422 px glow at red-channel >16, centred. Background is mostly black but includes near-black variation and faint glow beyond the nominal 420 px diameter.

Checks: native 1254 × 1254; approximate native bright-disc width 160 px. Background exactness failed.

```text
On pure black #000000: a rising sun as in the image, a bright warm white-gold disc about 120 px across in the centre, with a soft warm golden glow fading out around it to about 420 px across, no rays, no lens flare, no clouds, nothing else. Everything that is not light is pure black.
Output exactly 1024 × 1024 pixels. The input is only a colour reference for the sun, not a composition to copy. Make the sun much SMALLER than both earlier tries: a small white-gold disc only 120 pixels in diameter, 11.7% of the canvas width, occupying about 1% of the image area. Disc edges at x452 and x572 and y452 and y572, centred at x512,y512. Faint smooth golden glow ends at radius210, so the outer 302 pixels on all four sides are absolutely empty pure RGB(0,0,0) with no noise, grain, or near-black texture. A small solitary sun in a very large black square, no other objects. Do not enlarge the sun for visual emphasis.
```

## Final file verification

The four land deliverables match their selected originals byte-for-byte. The sun was compared after its sole permitted resize. Final SHA-256:

```text
1e95aee8f8f7064da72b17c629122541b8b1e743f72cd15447d2c68f6750ecbd  land-sunrise.png
10abd70e1fff3118780680d98f64cacc9ebedb7c756ad0b9effb5a6cc5d9d16a  land-alpenglow.png
6b53407013b5cb88527c4500425139383a3abf95205fa77b5b96afab9157c25b  land-predawn.png
872c35812d79ca8a384314acc3fd365b035876157d80709eb263112a62d5bb29  land-night.png
0d40caa70f5b7115687e553925dc910da5cea3a867ad261df007293806e706c8  sun.png
```

## Day

Created 2026-10-26 with the **built-in image_gen tool**, using the imagegen skill. Saved `raw/ahead/land-day.png`, selected **try 2 of 3**. All three outputs were natively **1536 × 1024**. The selected output was copied byte-for-byte: **no resizing or other post-processing**. Only this image and this appended Day section were written in the project; no code, configuration, packages, other artwork or commits were changed.

### Inputs and method

Each call used the same two explicit `referenced_image_paths`, in this order:

1. `art/about/raw/ahead/land-sunrise.png` — edit target; sole geometry/composition source.
2. `art/scene/style/frames/style-hero-day.png` — daylight lighting/style reference only.

All calls used `transparent_background: false`. The model and actual generation size were controlled by the built-in tool; the requested 1536 × 1024 size was specified in every prompt. Every retry started from these original inputs rather than a generated day version.

### Reading and honest limitations

Try 2 reads as fresh, clear, bright morning light: bright white snow and fluffy white clouds, cool blue shadow on predominantly lower-left-facing forms, and warm-grey foreground rock. The sunrise's broad peach/gold cloud and snow lighting is removed. Illumination suggests a high top-right source without a visible sun, sky objects or glow. Natural tan rock and small ochre/moss marks remain; these are material colours rather than the previous broad sunrise tint.

**The strict requirements did not fully pass.** The overall peaks, ridges, snowfields, cloud masses and near col register closely, but small skyline shifts and repainted internal details remain. The clouds and rocks are not pixel-identical shapes. The sky looks cleanly magenta at normal size with a largely crisp edge, but is neither exact flat #FF00FF nor byte-identical to sunrise. Fine near-magenta edge contamination and local silhouette drift remain; this is not a guaranteed exact chroma-key boundary. No corrective mask, recolouring, alignment, cleanup, compositing or repainting was applied.

The source itself also contains a nonuniform near-magenta sky: its most frequent sampled top-sky RGB is (249,2,249), and none of the 53,760 sampled sky pixels was exactly (255,0,255). Thus the requested exact #FF00FF and an untouched source sky cannot both describe the supplied source. The prompts retained the requested exact-magenta constraint; neither source nor output was changed by hand.

### Overlay and numerical checks

All three tries were visually reviewed at full frame, then checked in in-memory **50% overlays against sunrise**, with native-resolution source/result/overlay crops of the main summit, central cloud lobes and foreground rock. Diagnostic images existed only in memory and were displayed for inspection; none was saved. Overlays showed close registration of the main composition, with small local outline/detail changes. Try 2 had the lowest measured mean and maximum skyline deviation and the most neutral foreground rock, so it was retained.

Read-only inspection used Python's standard library PNG decoder; nothing was installed. Top-sky samples were every second pixel in each axis across rows 0–139. Skyline measurement used the first run of three non-magenta pixels in each column from row 140, with the same permissive magenta test as the earlier record (R > 230, G < 25, B > 230). This is an approximate registration check, not proof of identical geometry, and may respond to stray sky/edge pixels.

| Try | Native size | Most frequent sampled sky RGB | Exact #FF00FF samples / 53,760 | Skyline mean / P95 / maximum difference vs sunrise | Decision                                                                     |
| --- | ----------- | ----------------------------- | ------------------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | 1536 × 1024 | (248,4,248)                   | 0                              | 0.6107 / 1 / 12 px                                 | Good daylight; more skyline drift and warmer rock.                           |
| 2   | 1536 × 1024 | (247,3,246)                   | 0                              | 0.4375 / 1 / 9 px                                  | Selected: best mean/max registration, neutral rock and clean white daylight. |
| 3   | 1536 × 1024 | (250,3,244)                   | 0                              | 0.5964 / 1 / 16 px                                 | Good daylight; larger local skyline drift and warmer rock.                   |

### Tool originals and final verification

Generated originals remain in the built-in tool's default directory:
`/Users/teo/.codex/generated_images/01a17832-4546-77d0-a684-334400012a8b/`.

- Try 1: `exec-cc32aad2-97f9-4d90-84fa-581f224abc7b.png`.
- Try 2 — selected: `exec-c1e92543-bf29-4602-92fa-a1c59621486d.png`.
- Try 3: `exec-99f40f8f-c8d8-417f-95c5-3714a9a590b5.png`.

Final `raw/ahead/land-day.png` SHA-256: `d54e6b1965ccbf346fbf73ca892f3272a025a034079524bf168b980362504495`.
The final file was verified byte-for-byte against try 2. The source sunrise SHA-256 remains `1e95aee8f8f7064da72b17c629122541b8b1e743f72cd15447d2c68f6750ecbd`. Existing README content was preserved verbatim before this appended section.

### Complete submitted prompts

#### Try 1

```text
Use case: lighting-weather.
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light: a clear, bright mid-morning, the sun high at the TOP RIGHT, like the second image. The snow bright white with soft cool blue shadows on the lower left of every form, the rock warm grey, the sea of clouds white and fluffy, no gold or rose tints left. Fresh, clean, sunny.
Input image 1 is the edit target and sole source of geometry, composition, outlines, shapes and painted detail. Input image 2 is a daylight lighting/style reference only: do not copy its terrain, sky, sun disc, vegetation, buildings, tents, flags or objects. The high top-right sun is an off-canvas light source; never draw a sun, glow or halo in the sky. Preserve the first image's full framing, every individual cloud lobe, every foreground rock and all internal ridge lines. No additions, removals, crop, feature scaling, redesign, or repositioning. Relight only.
Sky constraint: the whole sky above the existing exact mountain silhouette is a completely uniform solid digital key colour RGB(255,0,255), #FF00FF, with zero texture, noise, dithering, shading, haze, gradients, cloud wisps, halo or colour bleed. Crisp clean mountain skyline against that magenta. All land remains fully painted and opaque in the original soft polished style. No text, logos, people or animals. Output canvas exactly 1536 x 1024 pixels.
```

#### Try 2 — selected

```text
Use case: lighting-weather.
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light: a clear, bright mid-morning, the sun high at the TOP RIGHT, like the second image. The snow bright white with soft cool blue shadows on the lower left of every form, the rock warm grey, the sea of clouds white and fluffy, no gold or rose tints left. Fresh, clean, sunny.
Input image 1 is the edit target and sole source of geometry, composition, outlines, shapes and painted detail. Input image 2 is a daylight lighting/style reference only: do not copy its terrain, sky, sun disc, vegetation, buildings, tents, flags or objects. The high top-right sun is an off-canvas light source; never draw a sun, glow or halo in the sky. Preserve the first image's full framing, every individual cloud lobe, every foreground rock and all internal ridge lines. No additions, removals, crop, feature scaling, redesign, or repositioning. Relight only.
Sky constraint: the whole sky above the existing exact mountain silhouette is a completely uniform solid digital key colour RGB(255,0,255), #FF00FF, with zero texture, noise, dithering, shading, haze, gradients, cloud wisps, halo or colour bleed. Crisp clean mountain skyline against that magenta. All land remains fully painted and opaque in the original soft polished style. No text, logos, people or animals. Output canvas exactly 1536 x 1024 pixels.
Correction for this retry: preserve the original image's precise skyline and all internal terrain/cloud geometry pixel for pixel. The prior try shifted some skyline positions by 1–12 pixels and repainted small rock and cloud details. Do not do that. Apply the daylight illumination to the existing shapes only. The prior sky failed because it was noisy near-magenta (around RGB 248,4,248); every sky pixel must be the exact flat digital fill RGB 255,0,255, without grain, variation or near-magenta edge halos. Maintain the same fresh white daylight with the light source high at top right, cool blue shadows below-left, warm grey rocks, white clouds, zero sunrise gold or pink.
```

#### Try 3

```text
Image edit of the first image. Keep every shape, outline, size and place exactly (every peak, ridge and snowfield, the sea of clouds, the near col), and keep the sky flat pure magenta #FF00FF untouched. Change only the light: a clear, bright mid-morning, the sun high at the TOP RIGHT, like the second image. The snow bright white with soft cool blue shadows on the lower left of every form, the rock warm grey, the sea of clouds white and fluffy, no gold or rose tints left. Fresh, clean, sunny.
This is a precise lighting-weather edit, not a repaint or a new illustration. First input: edit target, exact composition and geometry. Second input: daylight lighting and painterly-style reference only; import no scenery, objects or blue sky. Preserve the silhouette and all internal details of the first input exactly in place. Illuminate existing right/up-facing planes with neutral bright white sunlight from high top right; soft cool blue shadows below-left. Remove all peach, gold and rose sunrise light, including on cloud tops and foreground snow, while keeping warm-grey natural rocks.
Output exactly 1536 by 1024. Do not crop or rescale any feature. The sky is a flat digital chroma-key colour field, exact RGB(255,0,255), no noise or texture, no colour variance. Keep its boundary on the original mountain skyline with no pink fringe, glow, haze, sun, clouds or new marks. Preserve original brushwork, every cloud lobe, every snow ripple and foreground rock. No text or new objects. The sun exists only as illumination, never a visible disc. The sole intended difference from input 1 is daylight illumination.
```
