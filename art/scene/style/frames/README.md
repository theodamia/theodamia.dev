# The Ascent — painterly style exploration frames

Generated with the built-in imagegen tool, one image call per frame, in the order below. These are exploration outputs, not exact composition approvals. No code, config, packages or existing repository files were changed, and no commit was made.

The built-in tool exposes no explicit size argument. Every prompt requested the largest available landscape output, preferably 3840 × 2160. All five returned 1672 × 941. Each was centre-cropped with macOS `sips --cropToHeightWidth 936 1664` to **1664 × 936 (exactly 16:9)**, without resampling or upscaling. The crop removes 8 pixels across the width and 5 across the height. Only these final crops and this README are saved in this directory. Generated day-frame inputs in subsequent calls are the saved, cropped files.

All input paths below are the exact absolute paths passed to `referenced_image_paths`, in order. Each prompt is reproduced in full, beginning with the user's STYLE block verbatim. Calls used `transparent_background: false`.

## 1. `style-hero-day.png`

- File: [style-hero-day.png](style-hero-day.png)
- Pixel size: 1664 × 936.
- Generated size: 1672 × 941.
- Cropped: yes. Centered crop; removed 8 px horizontally and 5 px vertically; no resampling.
- Ordered input files:

1. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/style-reference.png`
2. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/guide-hero.png`
3. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/D1-hero.png`
4. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/village-1.png`

Assessment: Cool Alpine colours, two recognisable chalets, blank signpost, three receding yellow camps, and a separated snowy peak are present. Layout is not an exact guide match: the peak tip is farther right, the chalets are leftward and lower, the meadow crest is lower, the cloud sea is deeper, and extra conifers, foreground rocks, flowers and grass detail crowd the left title area. Rock and grass rendering remains crisper and more fragmented than the requested large smooth masses.

Complete prompt string:

```text
Rendering: high-end painterly digital illustration, the soft polished style of modern fantasy card-game splash art. Large simple forms modelled with smooth gradient shading and soft-edged brushwork. Rocks and cliffs are big sculpted, rounded-angular masses with smooth planes, soft core shadows, gentle surface texture and clean soft highlights; never noisy, never crumbly. Ground and meadow are smooth painted masses of grass, darker in the troughs and sunlit on the crowns, with only a few crisp blade accents near the bottom edge. Distance is handled with atmospheric perspective: far cliffs and ranges become pale, cool, low-contrast and soft. Conifers are painted shapes with soft lit edges, not individual needles. Clean, calm, readable; detail concentrated near the camps, quiet everywhere else. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no paper texture, no grain, no noise, no heavy detail.
Light and palette: cool, airy, sunny Alpine daylight. The sun is high at the TOP RIGHT and every form is lit from the upper right: lit planes face up and right, core shadows fall to the lower left, shadows are cool blue-green and blue-grey. Sky clear soft blue (#80b4f2 at the top to #d5d8ec, a pale lavender-blue, at the horizon). Snow lit #f3f4f6, snow in shade #bfceef. Stone lit #bcbeb2, stone in shade #6387a3. Meadow lit #9cab62 with sunlit crowns up to #c4c47c, meadow in shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud sea #f1f4fa with #d6ddef shading. Tent yellow #ecb84e, flags #cf4318. NO golden hour, no orange or amber cast on the landscape, no warm haze. The great snowy peak is the brightest value in the picture.
Constraints: scene only. No text, letters, numbers, logos, UI, cards, borders, frames or watermark. No people, animals or creatures. Signposts and flags are blank. Keep the composition of the attached guide exactly.

Use case: stylized-concept. Asset: landscape 16:9 style exploration frame for The Ascent. Use the largest landscape output resolution available, preferably 3840 × 2160; keep the complete 16:9 composition.
Input roles, in order: Image 1 style-reference.png is RENDERING ONLY: take the soft polished sculpted rock, smoothly shaded ground and atmospheric painting quality; exclude its creature, character, clothing, sack/egg, scale, action, composition and golden lighting. Image 2 guide-hero.png is the strict COMPOSITION source: preserve every element's location, approximate size and silhouette, camera, horizon and spacing. Image 3 D1-hero.png is PALETTE and Alpine SUBJECTS ONLY; do not take its composition or flat facets. Image 4 village-1.png is CHALET IDENTITY ONLY, repainted at the small guide scale; exclude the magenta background.

The top of the climb page. The great snowy peak stands centre-right (tip at about 64% across, 7% down), rising out of a level cloud sea that runs across the whole width at about 27–37% of the height, with pale distant ranges above the cloud sea on both sides. In front, a broad sunny green meadow fills the whole width of the lower half and rises gently toward the back. Two small chalets stand on it at about 47–59% across and 58% down (left one ochre-orange roof, right one dark green roof, pale stone and wood walls), and a blank wooden trailhead signpost at about 65% across. An earthen trail leaves the signpost and climbs over the meadow's crest. Beyond the crest, smaller ridge shoulders recede toward the foot of the peak, alternating left and right like switchbacks; on them, tiny camps with a yellow tent and a red flag at about (56% across, 44% down) and (69%, 37%), and an even smaller one near (60%, 32%). Sparse conifers near the left and right edges. The LEFT 40% of the frame stays calm and open (sky, soft far range, cloud sea, smooth meadow): a title will be set there, but do not draw any title or UI.

Paint over the blockout's geometry without moving it: its flat facets are only placeholders for continuous softly sculpted natural landscape. Keep the foreground meadow broad and quiet, with only the guide's sparse rocks and conifers; avoid adding a busy rock border. The snowy peak remains separated from the foreground climb by the horizontal cloud sea, always ahead and far away. Sun disk at the guide position near (79%, 9%).
```

## 2. `style-camp-geekbot-day.png`

- File: [style-camp-geekbot-day.png](style-camp-geekbot-day.png)
- Pixel size: 1664 × 936.
- Generated size: 1672 × 941.
- Cropped: yes. Centered crop; removed 8 px horizontally and 5 px vertically; no resampling.
- Ordered input files:

1. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/style-reference.png`
2. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/guide-camp-geekbot.png`
3. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/camp-2018.png`
4. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/frames/style-hero-day.png`

Assessment: The main A-frame tent, small fire, red flag, ascending trail, two further camps, approximately centred peak and rightward mist are present. The shoulder silhouettes and trail bends differ from the blockout; the foreground trail is wider and rockier, extra vegetation and outcrops increase density, and the right card area retains too much sharp ridge detail. Brushwork is painterly but grass and stone remain more detailed and faceted than requested.

Complete prompt string:

```text
Rendering: high-end painterly digital illustration, the soft polished style of modern fantasy card-game splash art. Large simple forms modelled with smooth gradient shading and soft-edged brushwork. Rocks and cliffs are big sculpted, rounded-angular masses with smooth planes, soft core shadows, gentle surface texture and clean soft highlights; never noisy, never crumbly. Ground and meadow are smooth painted masses of grass, darker in the troughs and sunlit on the crowns, with only a few crisp blade accents near the bottom edge. Distance is handled with atmospheric perspective: far cliffs and ranges become pale, cool, low-contrast and soft. Conifers are painted shapes with soft lit edges, not individual needles. Clean, calm, readable; detail concentrated near the camps, quiet everywhere else. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no paper texture, no grain, no noise, no heavy detail.
Light and palette: cool, airy, sunny Alpine daylight. The sun is high at the TOP RIGHT and every form is lit from the upper right: lit planes face up and right, core shadows fall to the lower left, shadows are cool blue-green and blue-grey. Sky clear soft blue (#80b4f2 at the top to #d5d8ec, a pale lavender-blue, at the horizon). Snow lit #f3f4f6, snow in shade #bfceef. Stone lit #bcbeb2, stone in shade #6387a3. Meadow lit #9cab62 with sunlit crowns up to #c4c47c, meadow in shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud sea #f1f4fa with #d6ddef shading. Tent yellow #ecb84e, flags #cf4318. NO golden hour, no orange or amber cast on the landscape, no warm haze. The great snowy peak is the brightest value in the picture.
Constraints: scene only. No text, letters, numbers, logos, UI, cards, borders, frames or watermark. No people, animals or creatures. Signposts and flags are blank. Keep the composition of the attached guide exactly.

Use case: stylized-concept. Asset: landscape 16:9 style exploration frame for The Ascent. Use the largest landscape output resolution available, preferably 3840 × 2160; keep the complete 16:9 composition.
Input roles, in exact order: Image 1 style-reference.png is RENDERING ONLY: softly modelled sculpted rocks, smooth gradient ground and soft atmospheric distance. Exclude its creature, character, clothing, sack/egg, action, composition and warm lighting. Image 2 guide-camp-geekbot.png is the STRICT COMPOSITION MASTER; the camera, peak tip, level cloud band, every shoulder silhouette, camp size and camp positions must remain as in this image. Image 3 camp-2018.png supplies the yellow A-frame tent and small campfire IDENTITY ONLY; repaint these small at guide scale and exclude the magenta background. Image 4 style-hero-day.png supplies PALETTE, LANDSCAPE MATERIALS and SET CONSISTENCY ONLY. Do not copy its busy grass, crowded conifers, detailed cloud texture or its composition.

The visitor has arrived at a camp in high pasture. A big ridge shoulder comes in from the LEFT and fills the lower-left two-thirds: smooth green high pasture with a few sculpted grey rock outcrops and a small group of conifers at the far left. The camp stands on a small level ledge at about 36% across and 58% down: the yellow A-frame tent with a small campfire and a red flag on a wooden pole, with the slope rising behind it (it never stands on the skyline). The earthen trail comes up from the bottom centre to the camp, then turns right and climbs over the shoulder's crest at about 50% across. Ahead, a rockier spur comes in from the right, and on it a smaller camp with a flag at about (56%, 42%); a tiny third camp further up near (46%, 37%). Behind everything the cloud sea and the great snowy peak, centred, tip near the top (50% across, 9% down). The RIGHT-centre of the frame (about 55–90% across, 32–80% down) stays calm: the ridge there dissolves softly into mist (a card will sit there, but draw no card or UI).

Treat the guide like a locked layout to be painted over. At 1600 × 900 guide coordinates: distant peak tip (800,80), sun (1269,81), main tent top (581,451) and base (581,522), main flagpole from (490,407) to (490,522), level ledge around x479–670 y525, trail entering near (609,900), bending to x584 at y710, arriving at the main camp then cresting at (800,435). The foreground tent is only about 7% of the frame width and 8% of the frame height, not a large close-up subject. Preserve the left shoulder skyline from the guide, with substantial sloping land behind the camp. Retain three camps total and no village. The right slope softly disappears into a pale veil, without distinct trees, sharp cliffs or objects in the card area. Preserve a broad horizontal, quiet cloud sea at about y300–405, not a tall wall of cumulus. Replace the hard polygon interiors with smooth rounded natural form shading, without adding fragmented surface detail.
```

## 3. `style-end-deepsea-day.png`

- File: [style-end-deepsea-day.png](style-end-deepsea-day.png)
- Pixel size: 1664 × 936.
- Generated size: 1672 × 941.
- Cropped: yes. Centered crop; removed 8 px horizontally and 5 px vertically; no resampling.
- Ordered input files:

1. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/style-reference.png`
2. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/guide-end-deepsea.png`
3. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/camp-2026.png`
4. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/frames/style-hero-day.png`

Assessment: The single dome tent, red flag, snowy left shoulder, trail fading over the crest, separated central peak and calm right snowfield follow the intended scene. The tent reads more yellow than orange/cream, the foreground trail and rock distribution differ, extra distant peaks are more pronounced, and the cloud sea is too deep and busy. Snow shading is soft; rocks still have too many hard small planes.

Complete prompt string:

```text
Rendering: high-end painterly digital illustration, the soft polished style of modern fantasy card-game splash art. Large simple forms modelled with smooth gradient shading and soft-edged brushwork. Rocks and cliffs are big sculpted, rounded-angular masses with smooth planes, soft core shadows, gentle surface texture and clean soft highlights; never noisy, never crumbly. Ground and meadow are smooth painted masses of grass, darker in the troughs and sunlit on the crowns, with only a few crisp blade accents near the bottom edge. Distance is handled with atmospheric perspective: far cliffs and ranges become pale, cool, low-contrast and soft. Conifers are painted shapes with soft lit edges, not individual needles. Clean, calm, readable; detail concentrated near the camps, quiet everywhere else. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no paper texture, no grain, no noise, no heavy detail.
Light and palette: cool, airy, sunny Alpine daylight. The sun is high at the TOP RIGHT and every form is lit from the upper right: lit planes face up and right, core shadows fall to the lower left, shadows are cool blue-green and blue-grey. Sky clear soft blue (#80b4f2 at the top to #d5d8ec, a pale lavender-blue, at the horizon). Snow lit #f3f4f6, snow in shade #bfceef. Stone lit #bcbeb2, stone in shade #6387a3. Meadow lit #9cab62 with sunlit crowns up to #c4c47c, meadow in shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud sea #f1f4fa with #d6ddef shading. Tent yellow #ecb84e, flags #cf4318. NO golden hour, no orange or amber cast on the landscape, no warm haze. The great snowy peak is the brightest value in the picture.
Constraints: scene only. No text, letters, numbers, logos, UI, cards, borders, frames or watermark. No people, animals or creatures. Signposts and flags are blank. Keep the composition of the attached guide exactly.

Use case: stylized-concept. Asset: landscape 16:9 style exploration for The Ascent. Request the largest landscape resolution available, preferably 3840 × 2160.
Input roles in order: Image 1 style-reference.png is RENDERING ONLY: softly shaded sculpted stone, large simple forms with smooth planes, gentle texture, soft core shadows; exclude all creatures, characters, clothing, sack/egg, action, composition and warm cast. Image 2 guide-end-deepsea.png is the locked COMPOSITION source: paint this exact layout, camera and silhouettes, with every object at the same location and approximate size. Image 3 camp-2026.png is DOME TENT IDENTITY ONLY: orange and cream fabric, curved crossing poles, darker blue-green base and doorway, repainted at the tiny scene scale; ignore magenta background. Image 4 style-hero-day.png is PALETTE and MATERIAL CONSISTENCY ONLY, never its composition or its dense grass detail.

The last camp: the present. A snowy, rocky shoulder comes in from the LEFT: sculpted pale stone and smooth wind-packed snow, a little thin grass only at its lowest edge. The camp at about 36% across and 58% down: the orange and cream dome tent with a red flag on a wooden pole, on a small level patch, slope rising behind it. The trail comes up from the bottom centre to the camp and then fades out over the crest toward the right: there are no more camps ahead. Beyond, only the cloud sea and the great snowy peak, now much bigger and closer, centred, tip near the top (50% across, 6% down), its base spreading wide into the cloud sea. The peak is still clearly far away across the cloud sea: it is never reached. The right half stays calm (a card will sit there): smooth snow fields dissolving into mist. Do not draw a card or UI.

Guide coordinates on its 1600 × 900 canvas: peak tip (800,50), sun (1269,81); tent footprint centred (580,522), flagpole at x490 from y407 to522, ledge from x479 to670 at y525. Replace only the guide's triangular tent placeholder with the supplied dome identity while preserving its approximate footprint and height. The camp stays small, approximately 7% of canvas width. The trail enters near x609 at the bottom, curves left to x585 at y710 and climbs to the camp, then bends up and right to the crest at (800,435) and disappears. The foreground left shoulder rises behind the camp to about (600,333). Keep the distant cloud sea quiet and horizontal around y340–430, spanning the width behind this shoulder. The great peak's pale broad base ends in that cloud sea, separated from the foreground snowy shoulder. One camp total; no trees, no village, no additional tents or fires. Right half a softly graded pale snow field and mist with minimal surface marks. Large rounded-angular stone masses, smooth shaded snow, sparse detail concentrated at the tent.
```

## 4. `style-hero-night.png`

- File: [style-hero-night.png](style-hero-night.png)
- Pixel size: 1664 × 936.
- Generated size: 1672 × 941.
- Cropped: yes. Centered crop; removed 8 px horizontally and 5 px vertically; no resampling.
- Ordered input files:

1. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/frames/style-hero-day.png`
2. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/D1-night.png`

Assessment: The day hero's large shapes and placements are closely preserved by visual comparison, with navy/blue-green moonlight, an upper-right crescent, small stars and amber chalet/camp lighting. This is not verified pixel-exact geometry preservation; small painted details change and the crescent sits slightly right of the previous sun centre. It inherits the day hero's guide/layout and surface-detail drift.

Complete prompt string:

```text
Rendering: high-end painterly digital illustration, the soft polished style of modern fantasy card-game splash art. Large simple forms modelled with smooth gradient shading and soft-edged brushwork. Rocks and cliffs are big sculpted, rounded-angular masses with smooth planes, soft core shadows, gentle surface texture and clean soft highlights; never noisy, never crumbly. Ground and meadow are smooth painted masses of grass, darker in the troughs and sunlit on the crowns, with only a few crisp blade accents near the bottom edge. Distance is handled with atmospheric perspective: far cliffs and ranges become pale, cool, low-contrast and soft. Conifers are painted shapes with soft lit edges, not individual needles. Clean, calm, readable; detail concentrated near the camps, quiet everywhere else. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no paper texture, no grain, no noise, no heavy detail.
Light and palette: cool, airy, sunny Alpine daylight. The sun is high at the TOP RIGHT and every form is lit from the upper right: lit planes face up and right, core shadows fall to the lower left, shadows are cool blue-green and blue-grey. Sky clear soft blue (#80b4f2 at the top to #d5d8ec, a pale lavender-blue, at the horizon). Snow lit #f3f4f6, snow in shade #bfceef. Stone lit #bcbeb2, stone in shade #6387a3. Meadow lit #9cab62 with sunlit crowns up to #c4c47c, meadow in shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud sea #f1f4fa with #d6ddef shading. Tent yellow #ecb84e, flags #cf4318. NO golden hour, no orange or amber cast on the landscape, no warm haze. The great snowy peak is the brightest value in the picture.
Constraints: scene only. No text, letters, numbers, logos, UI, cards, borders, frames or watermark. No people, animals or creatures. Signposts and flags are blank. Keep the composition of the attached guide exactly.

Use case: lighting-weather EDIT. Asset: landscape 16:9 moonlit version of the supplied day hero. Use the largest landscape output resolution available, preferably 3840 × 2160.
Input roles in order: Image 1 style-hero-day.png is the EDIT TARGET. Preserve its exact camera, framing, all silhouettes, all object shapes, sizes and locations, including every chalet, tent, flag, signpost, conifer, rock, meadow ridge, trail, mountain, far range and cloud. Image 2 D1-night.png is a NIGHT PALETTE reference ONLY; do not copy its composition, mountain size, geometry or faceted rendering.

For this night variant, replace the daylight lighting and sky colours specified in the shared style block with this explicit NIGHT OVERRIDE; retain the shared painterly materials, soft sculpted shading, cool shadows, no text/creatures and all composition constraints. An image EDIT of the day hero: keep every shape, position and silhouette exactly; change only the light to a clear moonlit Alpine night. A thin crescent moon high at the top right exactly where the sun was, a quiet field of small stars in the sky, the landscape in cool navy and blue-green moonlight (lit planes still face up and right), the snowy peak pale moonlit blue and still the brightest large landscape value, the cloud sea a soft pale blue-grey. The chalets' windows and the tiny camps glow warm amber; nothing else is warm.

The three tiny tents glow gently from within and each chalet window glows, with restrained local amber spill only at these sources. The moon is pale cool ivory, without a golden halo. No new objects, no moving objects, no altered trail, no added camps, no regenerated composition. Keep the exact softly painted geometry of Image 1, including its existing imperfect deviations from the guide. Match the day hero edge for edge as a lighting-only edit.
```

## 5. `style-materials.png`

- File: [style-materials.png](style-materials.png)
- Pixel size: 1664 × 936.
- Generated size: 1672 × 941.
- Cropped: yes. Centered crop; removed 8 px horizontally and 5 px vertically; no resampling.
- Ordered input files:

1. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/inputs/style-reference.png`
2. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/frames/style-hero-day.png`
3. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/frames/style-camp-geekbot-day.png`
4. `/Users/teo/Apps/theodamia.dev-painted/art/scene/style/frames/style-end-deepsea-day.png`

Assessment: All six material subjects appear in the requested 3 × 2 order with separated feathered vignettes, pale background and consistent cool daylight. Surface marks, flowers, grass accents and rock planes are too dense and crisp for the smooth target; the conifer vignette includes extra small trees beyond the requested pair, and the snow study has more exposed rock fragments than the quiet snow-line treatment requested.

Complete prompt string:

```text
Rendering: high-end painterly digital illustration, the soft polished style of modern fantasy card-game splash art. Large simple forms modelled with smooth gradient shading and soft-edged brushwork. Rocks and cliffs are big sculpted, rounded-angular masses with smooth planes, soft core shadows, gentle surface texture and clean soft highlights; never noisy, never crumbly. Ground and meadow are smooth painted masses of grass, darker in the troughs and sunlit on the crowns, with only a few crisp blade accents near the bottom edge. Distance is handled with atmospheric perspective: far cliffs and ranges become pale, cool, low-contrast and soft. Conifers are painted shapes with soft lit edges, not individual needles. Clean, calm, readable; detail concentrated near the camps, quiet everywhere else. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no paper texture, no grain, no noise, no heavy detail.
Light and palette: cool, airy, sunny Alpine daylight. The sun is high at the TOP RIGHT and every form is lit from the upper right: lit planes face up and right, core shadows fall to the lower left, shadows are cool blue-green and blue-grey. Sky clear soft blue (#80b4f2 at the top to #d5d8ec, a pale lavender-blue, at the horizon). Snow lit #f3f4f6, snow in shade #bfceef. Stone lit #bcbeb2, stone in shade #6387a3. Meadow lit #9cab62 with sunlit crowns up to #c4c47c, meadow in shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud sea #f1f4fa with #d6ddef shading. Tent yellow #ecb84e, flags #cf4318. NO golden hour, no orange or amber cast on the landscape, no warm haze. The great snowy peak is the brightest value in the picture.
Constraints: scene only. No text, letters, numbers, logos, UI, cards, borders, frames or watermark. No people, animals or creatures. Signposts and flags are blank. Keep the composition of the attached guide exactly.

Use case: stylized-concept. Asset: material study sheet for The Ascent design system, landscape 16:9. Use the largest landscape resolution available, preferably 3840 × 2160.
Input roles in exact order: Image 1 style-reference.png supplies RENDERING QUALITY ONLY: big sculpted rounded-angular stone, smooth modelling with soft brushwork, low surface detail, soft-edged grass masses; exclude creature, character, clothing, sack/egg, action, composition and warm golden lighting. Image 2 style-hero-day.png, Image 3 style-camp-geekbot-day.png, and Image 4 style-end-deepsea-day.png are PALETTE and MATERIAL CONTINUITY references from the same landscape. Use their cool daylight, meadow, stone, conifer, path and snow identities, with smoother and quieter surface treatment as specified in the shared style block. No landscape composition guide applies to this material sheet; the following grid specification controls its composition.

A material study sheet, six square-ish tiles in a 3 × 2 grid on a plain pale blue-grey background (#e8eef3), evenly spaced, no labels. Every tile is a small painted vignette in exactly the same soft polished painterly rendering and upper-right sunlight, cool shadows cast lower-left. Tile centres near (18%,27%), (50%,27%), (82%,27%), (18%,73%), (50%,73%), (82%,73%); each vignette roughly 22% of the frame width, with spacious empty gutters. Every vignette's edges dissolve softly into the background; nothing touches another tile. No drawn tile frames, dividers, labels, headings or hard-edged square boxes.

Reading left to right, top row: (1) a patch of sunlit meadow ground with soft smooth grass masses and only a few crisp blade accents; (2) a group of two or three big sculpted boulders sitting in grass, smooth rounded-angular masses with simple planes and soft core shadows; (3) a cliff face / rock buttress with large smooth planes and gentle surface texture.
Reading left to right, bottom row: (4) the snow line: sparse scree and pale stone meeting smooth wind-packed snow, mostly broad quiet surfaces; (5) a pair of conifers on a grassy knoll, softly painted foliage masses and soft lit edges, never individual needles; (6) a pale earthen trail with a few embedded stones crossing grass, smooth simple grass banks.

Keep all six studies at a comparable visual scale and consistent elevated three-quarter view. Rendering studies only, without tents, chalets, flagpoles, sky scenes or mountains in the background. Do not inherit the generated landscape frames' excessive tiny grass, flowers, fragmented rock facets or busy clouds. Prioritize big smooth sculpted forms, soft gradients, quiet material masses and feathered vignette edges. Background stays a continuous plain #e8eef3.
```
