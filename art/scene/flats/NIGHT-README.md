# The Ascent — night set

Created 2026-10-24 using the built-in image_gen tool in lighting-weather edit mode. Exactly one image-generation edit call was made for each of the nine assets. Each call supplied the exact original day/parts PNG first, then `art/scene/style/frames/style-hero-night.png` second as a lighting reference. `art/painted/unify/D1-night.png` was also reviewed as the user-supplied mood reference, but was not an additional tool input.

Only the nine new night PNGs and this README were written into the project. Original paintings, code, configuration and packages were not changed. No commit was made.

## Preservation result

**These edits do not meet exact day/night registration or untouched-magenta requirements.** All nine have minor shape/edge/detail drift; none should be represented as a guaranteed perfect circular-reveal pair. The edits retain the main composition, but repaint details. All nine also change background RGB values, despite the explicit prompt constraint. The background still looks magenta, but is not unchanged or exact flat #FF00FF. Geekbot additionally has excessive warm light in its tent doorway.

The source backgrounds themselves contain near-magenta variations rather than a uniform #FF00FF field. This does not excuse changes: the output background also differs from those original values. The RGB comparison below checks against the original background, not merely against ideal #FF00FF.

Far and peak sources are 1664 × 936. All other source paintings, including flag parts, are 1672 × 941. The generated PNGs were 1672 × 941; each was saved to exactly **1664 × 936** using macOS `sips -z 936 1664`, without cropping, padding or a second generative edit. Thus seven outputs also have the requested slight change in pixel dimensions relative to their day sources. For the comparison, coordinates are normalized to the full source framing. No corrective repainting or background restoration was performed.

## Files and checks

Paths are relative to the repository root. All outputs are RGB, 8-bit PNGs, 1664 × 936.

| File                                     | Size (bytes) | Shape/edge drift | Magenta touched |
| ---------------------------------------- | -----------: | ---------------- | --------------- |
| `art/scene/flats/raw/far-night.png`      |    1,891,643 | Yes, minor       | Yes             |
| `art/scene/flats/raw/peak-night.png`     |    1,792,444 | Yes, minor       | Yes             |
| `art/scene/flats/raw/village-night.png`  |    2,244,867 | Yes, minor       | Yes             |
| `art/scene/flats/raw/fedenet-night.png`  |    2,407,225 | Yes, minor       | Yes             |
| `art/scene/flats/raw/ordereze-night.png` |    2,460,049 | Yes, minor       | Yes             |
| `art/scene/flats/raw/geekbot-night.png`  |    2,393,030 | Yes, minor       | Yes             |
| `art/scene/flats/raw/lead-night.png`     |    2,451,809 | Yes, minor       | Yes             |
| `art/scene/flats/raw/deepsea-night.png`  |    2,211,833 | Yes, minor       | Yes             |
| `art/scene/flats/flag-parts-night.png`   |    1,359,797 | Yes, minor       | Yes             |

The background check classifies pixels with R ≥ 230, G ≤ 25 and B ≥ 230 as magenta-like. Interior comparisons exclude an approximate six-source-pixel silhouette margin using four cardinal neighbors. When source dimensions differ, source coordinates are sampled at the nearest pixel center in normalized full-frame coordinates. “Mask disagreement” counts output pixels whose magenta-like classification differs from the corresponding source. It is an edge-preservation diagnostic, not a measured displacement in pixels; lighting and resampling can also affect edge classification. Changed painted details were additionally inspected visually.

| Asset      | Interior background RGB changed / checked | Magenta-mask disagreement (pixels) | Sampled source modal RGB | Sampled output modal RGB |
| ---------- | ----------------------------------------: | ---------------------------------: | ------------------------ | ------------------------ |
| far        |                         297,789 / 297,869 |                              1,221 | (252, 6, 250)            | (249, 4, 250)            |
| peak       |                         497,797 / 497,949 |                              1,522 | (252, 5, 250)            | (250, 5, 248)            |
| village    |                         252,219 / 252,227 |                              2,418 | (250, 2, 250)            | (252, 6, 251)            |
| fedenet    |                         328,152 / 328,592 |                              1,180 | (248, 2, 251)            | (251, 2, 251)            |
| ordereze   |                         334,316 / 345,713 |                              2,440 | (249, 3, 251)            | (248, 3, 250)            |
| geekbot    |                         338,094 / 338,096 |                              2,434 | (245, 3, 250)            | (247, 2, 248)            |
| lead       |                         335,341 / 337,659 |                              2,343 | (249, 2, 249)            | (248, 4, 248)            |
| deepsea    |                         338,188 / 338,193 |                              1,250 | (244, 3, 248)            | (247, 4, 247)            |
| flag-parts |                     1,123,496 / 1,319,900 |                              1,747 | (251, 3, 250)            | (251, 3, 251)            |

No interior background pixel checked was exactly #FF00FF in any final output. Background color modes were sampled every eight pixels within the interior region. These checks establish that magenta preservation failed; they do not certify the alignment of every internal feature.

## Inputs and complete prompts

The following are the complete prompts submitted to image_gen, including the NIGHT block verbatim in each prompt. Input order is significant. Each invocation used `transparent_background: false` and the two local paths in `referenced_image_paths`, in the order listed. Source and output SHA-256 values identify the exact files.

### 1. far-night.png

- Output: `art/scene/flats/raw/far-night.png`
- Size: 1664 × 936; 1,891,643 bytes.
- Input 1 (edit target): `art/scene/flats/raw/far-day.png` — 1664 × 936.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `164c60be6862d67d0327e760fa4e35cdfbb8edb040cea1e3c4eb3236a12b431b`.
- Output SHA-256: `60f147aa1878f2092fa5bfcdbf27a57a822fd80b4637f00027c39ea4f968d2e8`.
- Shape moved/changed: yes, minor drift. Minor ridge-edge drift and repainted cloud contours/details. The major peaks remain in the same composition, but this is not a pixel-registered lighting-only transform. No warm light observed.
- Magenta touched: yes; 297,789 of 297,869 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: the distant ranges moonlit pale blue against magenta, the cloud sea below in soft moonlit blue-grey with gentle highlights on the cloud tops. No warm light.
```

### 2. peak-night.png

- Output: `art/scene/flats/raw/peak-night.png`
- Size: 1664 × 936; 1,792,444 bytes.
- Input 1 (edit target): `art/scene/flats/raw/peak-day.png` — 1664 × 936.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `7c06d021cbdf494c995f916f5a4c2f0b842924688dda6a879442293e3287f91e`.
- Output SHA-256: `e0e1661760c877bc084cc69054922e4842e7810f053d6188bf2ed79646e1fe21`.
- Shape moved/changed: yes, minor drift. Minor summit/ridge-edge drift and repainted cloud contours/details. The central peak and cloud foot remain in the same composition. No warm light observed.
- Magenta touched: yes; 497,797 of 497,949 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: the great peak in moonlight, pale blue snow, the brightest thing in the picture; its foot still in soft cloud. No warm light.
```

### 3. village-night.png

- Output: `art/scene/flats/raw/village-night.png`
- Size: 1664 × 936; 2,244,867 bytes.
- Input 1 (edit target): `art/scene/flats/raw/village-day.png` — 1672 × 941.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `ce417475359b2afc4fe04ecc7a0508b0e9c601ed70b7542ce59c218e1dcfcfbe`.
- Output SHA-256: `4a2dcbe48f00eb3c0981d425c3f3e7e94662f74a0ce75e7f15558574b2a06fa4`.
- Shape moved/changed: yes, minor drift. Minor hill/tree/building-edge and surface-detail drift. Chalet windows glow amber; both doors remain closed and dark and the signpost remains unlit.
- Magenta touched: yes; 252,219 of 252,227 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: warm light in the chalets' windows (each window glass glows amber; doors stay closed and dark). The signpost unlit.
```

### 4. fedenet-night.png

- Output: `art/scene/flats/raw/fedenet-night.png`
- Size: 1664 × 936; 2,407,225 bytes.
- Input 1 (edit target): `art/scene/flats/raw/fedenet-day.png` — 1672 × 941.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `69c93593fbc677dde958c9bdb4937b236cce074fc89f2baeddd97faf5c3c3809`.
- Output SHA-256: `d0894c32d9eba5a7954f73479375a0c0bf88f71d12c8070440d2b9d76e8d64d2`.
- Shape moved/changed: yes, minor drift. Minor hill/tree/rock/cabin-edge and surface-detail drift. The existing single cabin window glows amber; the door remains dark.
- Magenta touched: yes; 328,152 of 328,592 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: warm light in the cabin's one window.
```

### 5. ordereze-night.png

- Output: `art/scene/flats/raw/ordereze-night.png`
- Size: 1664 × 936; 2,460,049 bytes.
- Input 1 (edit target): `art/scene/flats/raw/ordereze-day.png` — 1672 × 941.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `2db419725842eb8cbc27fce3df8fa72334167cd475f3e3d5a2fcad848ceaea06`.
- Output SHA-256: `8d50ce3371706637d8043fad66618d528a9aa4e8d4229c785f89f023c7aa12b7`.
- Shape moved/changed: yes, minor drift. Minor hill/rock/tent-edge and surface-detail drift. The existing lantern glows amber with local spill; the tent canvas retains some muted brown/rust.
- Magenta touched: yes; 334,316 of 345,713 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: the lantern by the tent glows warm.
```

### 6. geekbot-night.png

- Output: `art/scene/flats/raw/geekbot-night.png`
- Size: 1664 × 936; 2,393,030 bytes.
- Input 1 (edit target): `art/scene/flats/raw/geekbot-day.png` — 1672 × 941.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `cc8bd378a3b9efe6b4a0342aa812ae695fac0c3527dfc4104aced05f94b7f9ba`.
- Output SHA-256: `6a4305589cae078f90d44ab3bd6999324e3ffd77a74abe21c8e0ddc6aac53787`.
- Shape moved/changed: yes, minor drift. Minor hill/tree/rock/tent-edge and surface-detail drift. Small flames were added in the existing stone ring as requested. The tent doorway also became conspicuously amber: this exceeds the requested light on the lower tent edge and is a lighting-scope failure.
- Magenta touched: yes; 338,094 of 338,096 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: a small campfire burns in the stone ring (small flames, warm glow on the stones and the tent's lower edge).
```

### 7. lead-night.png

- Output: `art/scene/flats/raw/lead-night.png`
- Size: 1664 × 936; 2,451,809 bytes.
- Input 1 (edit target): `art/scene/flats/raw/lead-day.png` — 1672 × 941.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `a36e07ed364ecbf4e367cbb6b28869cccc39f58f38fc4aad1fe30e78ce18c591`.
- Output SHA-256: `f8ab4bea7b2ff8962dfd1b2079ac16418c2beb54fcfc4be918216d70daa8c457`.
- Shape moved/changed: yes, minor drift. Minor hill/rock/tent-edge and surface-detail drift. The bell tent doorway glows amber from within. The sign remains unlit.
- Magenta touched: yes; 335,341 of 337,659 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: the bell tent's doorway glows warm from inside.
```

### 8. deepsea-night.png

- Output: `art/scene/flats/raw/deepsea-night.png`
- Size: 1664 × 936; 2,211,833 bytes.
- Input 1 (edit target): `art/scene/flats/raw/deepsea-day.png` — 1672 × 941.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `584e522e0f5e3c939640dd702d26e63466f691aa990086b445566bea5bb1f6a6`.
- Output SHA-256: `dc84910d6d39d050e991cf01e91e7d5d29f20f582c02a64b2f5a9f9a05ec348d`.
- Shape moved/changed: yes, minor drift. Minor snow/rock/tent-edge and surface-detail drift. The dome doorway glows amber from within; the existing path remains in the same overall course.
- Magenta touched: yes; 338,188 of 338,193 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: the dome's doorway glows warm from inside.
```

### 9. flag-parts-night.png

- Output: `art/scene/flats/flag-parts-night.png`
- Size: 1664 × 936; 1,359,797 bytes.
- Input 1 (edit target): `art/scene/flats/flag-parts.png` — 1672 × 941.
- Input 2 (lighting reference only): `art/scene/style/frames/style-hero-night.png` — 1664 × 936.
- Input 1 SHA-256: `f1af29779d95edee6e484d9969311748f645027a629d188eaa1d320a448b419d`.
- Output SHA-256: `6de54535488b153a7d25c9c0275f61adae2850c45037fbc51d4f4955689e0eaf`.
- Shape moved/changed: yes, minor drift. Minor pole/stone/pennant-outline and fold-detail drift. The pole and pennant remain separate in the original composition. The pennant is deep muted rust; no emitted warm light was added.
- Magenta touched: yes; 1,123,496 of 1,319,900 checked interior pixels differ in RGB from the normalized source.

Complete prompt:

```text
Use case: lighting-weather.
Input images in order: Image 1 is the exact day painting to edit and is the sole source of composition and geometry. Image 2 is a night lighting and palette reference only; do not borrow its shapes, scenery, sky or objects.
Output: a single PNG at exactly 1664 × 936, with the original framing, no cropping, zoom, camera movement or redesigned details. This is a registered day/night pair for a circular reveal; preserve the day painting's geometry as closely as possible.

Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched (never darken, tint or blend the magenta). Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself (the sky is separate). The only warm colour in the whole picture is the camp's own light listed below: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire, with at most a faint warm spill on the ground right next to it; nothing else is warm.

Specific image: the same pole and pennant, moonlit (the orange becomes a deep muted rust in moonlight), magenta untouched. No warm light. Keep pole and pennant as separate parts in exactly their original locations; do not attach the pennant to the pole.
```
