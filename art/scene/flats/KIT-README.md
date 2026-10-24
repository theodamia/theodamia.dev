# The Ascent — day camp kit

Generated on 2026-10-24 with the built-in imagegen tool. Exactly eight image calls, one per image, in the order below. All project outputs are in `art/scene/flats/`. No code, configuration, packages or commits were changed.

## Result and limits

The six camps read as one visual set in their orange/cream/wood/slate materials and painterly forms. Their individual identities remain recognizable. Scale is less consistent than requested: Fedenet, Lead and DeepSea came out oversized. Exact hex colors, flat background fills, original output dimensions and strict preservation outside the camps were not achieved. These are generated paintings with visible drift, not pixel-preserving edits.

The original six day paintings were verified byte-for-byte equal to their existing `raw/v1/` backups before editing. Those backups were left untouched. The original day paintings were 1664×936. All six generated edits are 1672×941. The kit sheet is 1983×793, which is not 16:9. Flag parts are 1672×941, approximately 16:9. Files were copied directly from the generated outputs without subsequent resizing, compositing or color correction.

## Per-image provenance and complete prompts

### 1. art/scene/flats/camp-kit-day.png

- File: `art/scene/flats/camp-kit-day.png`
- Actual size: **1983 × 793 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/flats/raw/fedenet-day.png`
  2. `art/scene/style/inputs/camp-2022.png`
  3. `art/scene/style/inputs/camp-2026.png`
  4. `art/scene/style/inputs/village-1.png`
  5. `art/scene/style/frames/style-materials.png`

Inspection: The six groups read as one coordinated orange/cream/wood/slate family. All six are in one row. Actual canvas is 1983×793 (about 2.50:1), so this does NOT meet the requested 16:9. The blue-grey background varies subtly rather than being a flat exact #E8EEF3. Exact material hex values were supplied as targets; the painted pixels vary. The source kit retains fairly detailed roof tiles and canvas folds.

Complete prompt:

```text
Use case: stylized-concept.
Create The Ascent camp-kit design-system reference sheet, 16:9 landscape, 2560x1440 if possible. Plain uniform pale blue-grey background #E8EEF3, never magenta. No labels, text, lettering, numbers, logos, flags, flagpoles, people, or extra objects.
Inputs in order: 1 landscape fedenet-day.png is the painterly rendering/style reference only; 2 camp-2022.png is bell-tent form reference only; 3 camp-2026.png is dome form reference only; 4 village-1.png is chalet form reference only; 5 style-materials.png is natural materials/style reference. Override all old yellow/teal building and tent colors and old lighting with the palette and lighting below.
Composition: SIX separate camp groups in ONE horizontal row left to right, full objects visible, evenly spaced with clear empty gaps, nothing overlapping, ample pale background above and below. A consistent architectural scale across all six: an imagined person is about two-thirds of a personal tent's height. Cabin modest; cream Lead bell tent widest single tent; dome low and compact. Each camp stands on its own small level patch of trodden ground with soft contact shadow, natural grassy patch for first five, snow patch for sixth. Simple chunky clean readable shapes, few deliberate seams, flap rolls, ties and steps; no clutter, tiny props or decorative clutter.
Left to right exactly:
1 Trailhead village: TWO small Alpine chalets side by side within the first group. Left chalet larger with burnt-orange roof #C4572A, right chalet smaller with slate roof #4B5D6E. Both whitewash #EFE5D2 walls, stone base, wooden gables and shutters, closed wooden doors, slate windows. A blank wooden trailhead signpost on a few stones.
2 Fedenet: small wooden cabin, plank walls #9B7350/dark #6B4E36, burnt-orange roof, stone chimney, ONE slate-glass window, closed wooden door and step, small stack of firewood.
3 Ordereze: small burnt-orange ridge tent seen side-on; wooden crate and one small lantern with slate glass, unlit.
4 Geekbot: burnt-orange A-frame tent in three-quarter view, door tied back to reveal slate opening; small ring of stones with exactly two logs, unlit.
5 Lead: widest camp, CREAM bell tent with conical roof on centre pole, radiating seams, scalloped burnt-orange trim band, small peak cap, slate doorway; exactly THREE burnt-orange backpacks by door and a short blank wooden signpost. No glowing windows.
6 DeepSea: compact LOW ROUND burnt-orange dome with cream cap, darker orange snow skirt, small hooded vent, cream door flap rolled up above slate opening, wooden pegs; on snow.
Exact camp material palette: canvas burnt orange #CF4318, sunlit #E2683A, shade #A5330F; cream canvas #F1E6CF, shade #D8C9AC; wood #9B7350, dark wood #6B4E36; all openings/doorways/window glass deep slate #2B3A48, NEVER lit or yellow. Stone #BCBEB2 lit, #6387A3 shade. Thin cream rope and guy lines. Chalet roof exceptions as specified. Natural grass and snow remain natural.
Rendering: match the landscape's soft painterly forms and smooth gradient shading, restrained texture, no outlines or line art, no glossy highlights. Sun HIGH AT TOP RIGHT: right and top faces lit, left faces cool shaded, soft shadows fall lower-left. All six must clearly belong to ONE designed set.
```

### 2. art/scene/flats/flag-parts.png

- File: `art/scene/flats/flag-parts.png`
- Actual size: **1672 × 941 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/style/inputs/flag.png`
  2. `art/scene/flats/camp-kit-day.png`

Inspection: Pole and pennant are separated, with a pointed orange cap, three stones, orange cloth and cream pole-edge hem. Actual canvas is 1672×941 (approximately 16:9, not exact). Background is visually magenta but is NOT pure flat #FF00FF; corner samples include RGB (241,15,242), (247,16,243), (239,36,239) and (243,30,241).

Complete prompt:

```text
Use case: stylized-concept.
Generate the shared flag as TWO SEPARATE reusable parts, 16:9 landscape canvas, exactly 1792x1008 pixels if possible. The entire background must be pure FLAT solid magenta #FF00FF, with no gradient, vignette or texture. Keep generous empty magenta margins all around both parts.
Inputs in order: image 1 flag.png is the wooden pole/cloth painterly form reference, image 2 camp-kit-day.png is the definitive design-system material, palette and style reference. Replace the reference's old yellow cloth with burnt orange.
On the LEFT: one upright wooden flagpole, wood #9B7350 with dark wood #6B4E36, a SMALL pointed burnt-orange cap on its top. It stands in exactly three or four natural stones (stone #BCBEB2 lit, #6387A3 shade). NO cloth, no rope tassel, no grass or ground patch around this left part.
On the RIGHT, well separated from the pole by a large empty magenta gap: ONLY the loose triangular pennant cloth, horizontally extended with a vertical pole edge on its left and pointed tip on its right, one soft fold, canvas burnt orange #CF4318, sunlit face #E2683A, shaded face #A5330F, a thin cream #F1E6CF hem along its vertical pole edge. No pole, sticks or stones attached to this cloth.
Same soft painterly rendering and smooth gradient shading as the camp kit, chunky readable clean shapes, no outlines, line art or glossy highlights. Sun HIGH AT TOP RIGHT: right/top faces lit and left faces cool shaded. Nothing else. No text, symbols, numbers, logos, extra flags, ground scenery or cast shadows on the magenta. Both objects fully visible and do not overlap. Preserve 16:9 canvas even with empty magenta space.
```

### 3. art/scene/flats/raw/village-day.png

- File: `art/scene/flats/raw/village-day.png`
- Actual size: **1672 × 941 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/flats/raw/village-day.png` — original edit target; pre-edit contents preserved in `art/scene/flats/raw/v1/village-day.png`
  2. `art/scene/flats/camp-kit-day.png`
  3. `art/scene/style/inputs/village-1.png`
  4. `art/scene/style/inputs/village-2.png`

Inspection: Both chalets and the blank sign were replaced in their original general locations. Left chalet is slightly larger than before; roofs read orange and slate, walls cream-white and windows dark. Outside the camp, grass/rock and trail brushwork changed; tree/terrain silhouette edges shifted slightly and magenta pixels changed. Broad trail course and hill form remain recognizable.

Complete prompt:

```text
Use case: precise-object-edit.
Image edit of INPUT IMAGE 1 ONLY. Keep the complete original 1664x936 landscape canvas and 16:9 framing exactly as it is: same landscape, silhouette, hill crest, trail, rocks, trees, grass brushstrokes, light and flat magenta #FF00FF background, untouched. Do not zoom, crop, reframe, change the sky mask, move the trail, repaint vegetation or replace the scene with a reference sheet.
Inputs in order: 1 village-day.png is the EDIT TARGET; 2 camp-kit-day.png is the definitive design/material insert reference; 3 village-1.png and 4 village-2.png are chalet identity/form references only (ignore their old colors, yellow glass, and old light).
Replace ONLY the TWO existing chalets AND existing blank signpost in image 1 with the TRAILHEAD VILLAGE group (leftmost group) from image 2, in exactly their existing positions, standing on the same ledge with a small natural trodden patch and soft contact shadows. Chalets about the SAME size as now: larger left chalet approximately x740–900, y130–235, smaller right chalet approximately x905–1010, y165–240; blank trailhead signpost stays around x1065, y205. Keep existing trees behind and beside chalets and the trail to their right untouched.
Left chalet larger, whitewashed #EFE5D2 walls over stone base, burnt-orange roof #C4572A, wooden gable and shutters. Right chalet smaller, same whitewashed walls and stone base, slate roof #4B5D6E, wooden gable and shutters. Closed wooden doors, all window glass deep slate #2B3A48, NEVER yellow or lit. One blank wooden trailhead signpost standing on a few stones in its original location. Do not add props.
Kit palette: wood #9B7350, dark wood #6B4E36; lit stone #BCBEB2, shaded stone #6387A3; no old teal plank walls. Simple chunky forms readable at this small size, few deliberate details, soft painterly rendering with smooth shading, no outlines, line art or gloss. Match the original scene's rendering. Sun high TOP RIGHT, right/top surfaces lit, left cool shaded.
Do not add a flag or flagpole, people, text, numbers, logos, labels or writing. Change only the chalet/signpost region; preserve every part of the original outside those objects and their immediate contact shadows. Output the edited full scene at exactly 1664x936.
```

### 4. art/scene/flats/raw/fedenet-day.png

- File: `art/scene/flats/raw/fedenet-day.png`
- Actual size: **1672 × 941 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/flats/raw/fedenet-day.png` — original edit target; pre-edit contents preserved in `art/scene/flats/raw/v1/fedenet-day.png`
  2. `art/scene/flats/camp-kit-day.png`
  3. `art/scene/style/inputs/camp-2015.png`

Inspection: Wood cabin, orange roof, slate window, closed door, stone chimney/step and firewood read as the kit cabin. Roof/body is visually about 10% of image width, larger than the requested 7%. Outside the camp, grass, rocks and path details changed, some tree-edge silhouette details shifted, and magenta changed. Broad route and slope composition remain recognizable.

Complete prompt:

```text
Use case: precise-object-edit.
Image edit. INPUT IMAGE 1 is the painting to edit. Keep this painting exactly as it is: the same complete landscape, silhouette, winding trail, all rocks, all trees, grassy slopes, light and flat magenta #FF00FF background, untouched. Preserve original 1664x936 size, 16:9 framing, camera and composition. Do not crop, zoom, reframe, globally redraw, recolor or add scenery.
Inputs in order: 1 fedenet-day.png EDIT TARGET; 2 camp-kit-day.png definitive camp design, material and palette reference; 3 camp-2015.png cabin identity/form reference ONLY, ignoring its old colors, yellow windows and light.
Replace ONLY the existing small cabin near the upper-middle-left (currently approximately x670–790, y145–230) with the FEDENET wooden cabin from the SECOND GROUP in attached camp kit sheet. Keep the same location and ground contact on the same ledge left of the trail, with soft contact shadow, naturally sunk into its small trodden patch. Make the cabin larger than now, about 7% of the image width (approximately 116 pixels wide overall), without moving its ground-contact center around x730,y225. Preserve the adjacent trail outside immediate cabin ground contact.
Cabin: modest simple chunky wooden plank walls in wood #9B7350/dark wood #6B4E36, burnt-orange roof #CF4318 with #E2683A sunlight and #A5330F shade, stone chimney (#BCBEB2 lit/#6387A3 shade), ONE window with deep slate #2B3A48 glass NEVER yellow or lit, closed wooden door and one step; a small stack of firewood beside the cabin as the only accessory. Keep its identity as an existing small wooden mountain cabin. No teal walls.
Use the same soft painterly rendering and smooth gradient shading as the landscape, no outlines, line art or glossy highlights, few deliberate readable details. Sun high TOP RIGHT, top and right surfaces lit, left cool shaded. Match kit materials and the landscape brushwork.
Do not add a flag, flagpole, writing, text, numbers, logos, people or extra props. Replace only cabin and immediate step/firewood/contact shadow. Keep all the rest of the landscape, trail, rocks, trees, hill silhouette and flat magenta background unchanged. Output only the full edited scene, exactly 1664x936 pixels.
```

### 5. art/scene/flats/raw/ordereze-day.png

- File: `art/scene/flats/raw/ordereze-day.png`
- Actual size: **1672 × 941 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/flats/raw/ordereze-day.png` — original edit target; pre-edit contents preserved in `art/scene/flats/raw/v1/ordereze-day.png`
  2. `art/scene/flats/camp-kit-day.png`
  3. `art/scene/style/inputs/camp-2016.png`

Inspection: Orange ridge tent, crate and unlit lantern are present. Tent is visually about 6% of image width, close to the requested 6.5%, though the view remains closer to the original three-quarter view than a fully side-on view. Outside the camp, terrain/rock/grass and trail detail changed; ridge edge shifted slightly and magenta changed. Broad trail course remains recognizable.

Complete prompt:

```text
Use case: precise-object-edit.
Image edit. INPUT IMAGE 1 is the sole edit target. Keep this painting exactly as it is: same landscape, silhouette, trail, rocks, trees, light, grass and flat magenta #FF00FF background, untouched. Preserve the entire 1664x936 16:9 canvas and composition. No crop, zoom, reframe, global repaint or color shift.
Inputs in order: 1 ordereze-day.png EDIT TARGET; 2 camp-kit-day.png definitive camp design and palette reference; 3 camp-2016.png ridge-tent form/identity reference only, ignoring old yellow/teal canvas, old light and glowing lantern.
Replace ONLY the existing tent, crate and lantern near the upper centre (around x930,y195) with the ORDEREZE group (THIRD GROUP from left) of the attached camp kit sheet. Keep the same place and ledge beside the trail, ground-contact center approximately x930,y220, naturally sunk into a small trodden patch and soft contact shadow. Tent body width about 6.5% of the image width, approximately 108 pixels; do not oversize. Keep the original trail and adjacent rocks outside immediate tent ground contact unchanged.
One simple small burnt-orange RIDGE TENT seen SIDE-ON, matching kit third group, not a bell tent or dome. Canvas base #CF4318, sunlit #E2683A, shade #A5330F, slate #2B3A48 opening if visible, thin cream #F1E6CF guy lines, simple wooden pegs. A wooden crate (#9B7350/dark #6B4E36) and one small lantern with deep slate #2B3A48 glass, UNLIT with NO yellow or glow. No other props.
Same soft painterly rendering and smooth gradient shading as image 1, simple chunky clean shapes, a few deliberate seams/ties, no line art, outlines or glossy highlights. Sun HIGH TOP RIGHT, right and top faces lit, left cool shaded. Match the kit's visual family.
Do not add a flag, flagpole, text, writing, numbers, labels, logos or people. Change only tent, crate, lantern and immediate contact shadow. Preserve all of the rest of image 1 including hill silhouette, trail, rocks, vegetation, flat magenta area and image edges. Output the full edited painting at exactly 1664x936.
```

### 6. art/scene/flats/raw/geekbot-day.png

- File: `art/scene/flats/raw/geekbot-day.png`
- Actual size: **1672 × 941 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/flats/raw/geekbot-day.png` — original edit target; pre-edit contents preserved in `art/scene/flats/raw/v1/geekbot-day.png`
  2. `art/scene/flats/camp-kit-day.png`
  3. `art/scene/style/inputs/camp-2018.png`

Inspection: Orange A-frame, tied/open slate entrance and unlit ring with two logs are present. Tent width is visually about 7% of the image width. Outside the camp, terrain, rocks, trees and trail brushwork changed; some tree-edge silhouette details shifted and magenta changed. Broad route and hill form remain recognizable.

Complete prompt:

```text
Use case: precise-object-edit.
Image edit of INPUT IMAGE 1. Keep this painting exactly as it is: the same landscape, silhouette, trail, rocks, trees, grass, light and flat magenta #FF00FF background, untouched. Preserve complete 1664x936 canvas, 16:9 framing, all scene edges and original viewpoint. No zoom, crop, reframe, global redraw or palette changes to the terrain.
Inputs in order: 1 geekbot-day.png is EDIT TARGET; 2 camp-kit-day.png is definitive camp design, material and palette reference; 3 camp-2018.png is tent identity/form reference ONLY, ignoring old yellow/teal canvas, old lighting and the lit fire.
Replace ONLY the existing small tent and its stone fire ring near x720,y185 (tent approximately x655–785,y140–220) with the GEEKBOT camp, FOURTH GROUP from left in attached kit sheet, in exactly the same place, standing naturally on the same grassy ledge beside the original trail with a small level trodden patch and soft contact shadow. Tent body about 7% of image width, approximately 116 pixels. Keep ground-contact center around x720,y215. Ring stays to the tent's left on this ledge, around x630,y215. Do not alter surrounding rocks or trail.
Tent: small burnt-orange A-FRAME in THREE-QUARTER VIEW, tied-back door with a clearly visible deep slate #2B3A48 opening; canvas #CF4318 base, #E2683A sunlit, #A5330F shade; thin cream guy lines #F1E6CF, wooden pegs #9B7350. One small ring of natural stones #BCBEB2 lit/#6387A3 shaded, containing exactly TWO plain wooden logs, completely UNLIT: no flames, glow, embers or smoke. No other props.
Simple chunky readable forms, big clean shapes and a few deliberate seam/tie/flap details, soft painterly rendering with smooth gradient shading matching image 1. Sun HIGH TOP RIGHT, right and top faces lit, left faces cool shaded; no outlines, line art or glossy highlights.
Do not add a flag, flagpole, text, labels, writing, numbers, logos or people. Replace only tent, fire ring and immediate contact shadows; leave every other part of the original landscape, trail, vegetation, rocks, terrain silhouette and flat magenta area unchanged. Output only full edited scene, exactly 1664x936.
```

### 7. art/scene/flats/raw/lead-day.png

- File: `art/scene/flats/raw/lead-day.png`
- Actual size: **1672 × 941 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/flats/raw/lead-day.png` — original edit target; pre-edit contents preserved in `art/scene/flats/raw/v1/lead-day.png`
  2. `art/scene/flats/camp-kit-day.png`
  3. `art/scene/style/inputs/camp-2022.png`

Inspection: Cream bell tent, orange scalloped band, slate doorway, orange backpack group and blank sign are present. The tent is visually about 13% of the image width, larger than the requested 9%; it is the widest camp. Outside the camp, rocks, grass and path details changed; ridge edge shifted slightly and magenta changed. Broad trail course and rocky mountain composition remain recognizable.

Complete prompt:

```text
Use case: precise-object-edit.
Image edit. Keep INPUT IMAGE 1 painting exactly as it is: same mountain landscape, silhouette, winding trail, rocks, shrubs, light and flat magenta #FF00FF background, untouched. Preserve the whole original 1664x936 canvas, 16:9 composition, camera, image edges and terrain. No zoom, crop, reframe or global repaint.
Inputs in order: 1 lead-day.png is EDIT TARGET; 2 camp-kit-day.png is the definitive camp design, material and palette reference; 3 camp-2022.png is bell-tent form/identity reference only, ignoring old window glow, old backpack colors and old light.
Replace ONLY the existing bell tent, backpacks and signpost (upper centre-right around x955,y175, sign around x1075,y195) with the LEAD camp, FIFTH GROUP from left in the attached camp kit sheet. Keep exactly the same place on the same ledge, ground contact center near x955,y223; keep the short blank sign near its existing right-hand position. Stand naturally on a small level trodden patch with soft contact shadow. Tent BODY approximately 9% of image width, about 150 pixels wide, the widest tent in this set. Do not move or alter the trail, adjacent mountain rocks or vegetation outside immediate camp contact.
A CREAM BELL TENT, a conical roof on a centre pole, radiating seams, small peak cap, a scalloped burnt-orange trim band around the eaves. Cream canvas #F1E6CF, shaded #D8C9AC; trim burnt orange #CF4318 with #E2683A sunlit and #A5330F shade. Tied/open entrance showing deep slate #2B3A48 doorway, never lit or yellow. Exactly THREE burnt-orange backpacks grouped by the door. One short BLANK wooden signpost at the right, no writing. Thin cream guy lines; wooden pegs and pole #9B7350/dark #6B4E36. No additional camp props.
Simple chunky clean shapes, deliberate restrained seams, ties and flap details; same soft painterly rendering and smooth gradient shading as the scene, no outlines, line art or glossy highlights. Sun HIGH TOP RIGHT: right/top faces lit, left faces cool shaded. Match the kit family.
Do not add a flag, flagpole, text, writing, logos, numbers, labels, people or glowing windows. Replace only tent/backpacks/signpost and their immediate ground contacts. Everything else, especially hill silhouette, trail geometry, rocks, grass and the flat magenta area, stays unchanged. Output full edited painting exactly 1664x936.
```

### 8. art/scene/flats/raw/deepsea-day.png

- File: `art/scene/flats/raw/deepsea-day.png`
- Actual size: **1672 × 941 pixels**, RGB PNG.
- Inputs, in the exact order supplied:
  1. `art/scene/flats/raw/deepsea-day.png` — original edit target; pre-edit contents preserved in `art/scene/flats/raw/v1/deepsea-day.png`
  2. `art/scene/flats/camp-kit-day.png`
  3. `art/scene/style/inputs/camp-2026.png`

Inspection: Orange round dome, cream cap and rolled cream flap over a slate opening are present. The dome is visually about 9–10% of image width, larger than the requested 6.5%; its snow skirt is not as distinctly dark as requested. Outside the camp, snow/rock/plant and trail brushwork changed; ridge edge shifted slightly and magenta changed. Broad snowy composition and path course remain recognizable.

Complete prompt:

```text
Use case: precise-object-edit.
Image edit. INPUT IMAGE 1 is the sole painting to edit. Keep this painting exactly as it is: same snowy mountain landscape, silhouette, trail, every rock, snow bank, grass patch, light and flat magenta #FF00FF background, untouched. Preserve the complete original 1664x936 16:9 canvas, original framing and camera. No crop, zoom, reframe, global recoloring, new scenery or repaint of terrain.
Inputs in order: 1 deepsea-day.png EDIT TARGET; 2 camp-kit-day.png definitive camp design, material and palette reference; 3 camp-2026.png dome-tent identity/form reference ONLY, ignore its old yellow/teal palette and old lighting.
Replace ONLY the existing yellow/teal dome near upper middle (approximately x680–830,y150–235) with the DEEPSEA camp dome, SIXTH/rightmost GROUP from the attached camp kit sheet, in exactly the same place standing on the same snowy ledge beside the original path. Keep ground contact centered approximately x755,y232, small level packed-snow patch and soft cool contact shadow naturally sunk into existing snow. Make the DOME BODY about 6.5% of the image width, approximately 108 pixels wide: compact, LOW and ROUND. Do not oversize. Keep the trail outside immediate tent ground contact completely unchanged.
Burnt-orange dome canvas #CF4318, sunlit #E2683A, shaded #A5330F, with a CREAM top cap #F1E6CF (shade #D8C9AC), DARKER ORANGE snow skirt #A5330F, one small hooded vent, CREAM door flap ROLLED UP above a deep slate #2B3A48 open doorway, wooden pegs #9B7350/dark #6B4E36 and thin cream guy lines. Simple curved poles and a few deliberate seams, no tiny props or clutter. No yellow canvas, teal skirt or glowing openings. No additional accessories.
Same soft painterly rendering and smooth gradient shading as the original landscape, simple chunky clean readable shapes, no outlines, line art or glossy highlights. Sun HIGH TOP RIGHT, top/right faces lit, left faces cool shaded. Match the same orange/cream/slate family as the attached kit.
Do not add a flag, flagpole, text, numbers, logos, writing, labels, people or props. Change only the dome and its immediate contact shadow; preserve every other part of image 1 including hill silhouette, magenta edge, snowy slope, rocks, plants and trail. Output only the full edited scene, exactly 1664x936 pixels.
```

## Comparison against originals

All six edits changed pixels outside the camp. Visually, the broad hill forms and trail routes remain aligned, but fine terrain and trail brushwork were regenerated. Magenta changed in every edit. Both original and generated backgrounds already contain near-magenta color variation; neither set should be described as exact flat #FF00FF.

Read-only PNG decoding and sampled comparisons were used; no diagnostic images or scripts were written. Since dimensions differ, samples were compared at normalized coordinates using nearest-neighbor lookup in memory. This cannot establish pixel preservation, and resampling contributes to the reported differences. Terrain RGB difference below is the mean absolute channel difference on a 0–255 scale, sampled every four original pixels, excluding generous camp rectangles and magenta. “Changed samples” means at least one channel differed by more than 10 levels (not 10 percent). Silhouette deviations use the first non-magenta pixel in each sampled column, excluding the camp's horizontal span; this includes tree tips and is a heuristic, not an exact mask comparison. Magenta classification for silhouette/background checks was R>180, G<80, B>180. Background means use an eight-pixel sampling grid. These figures support the observed drift; they do not certify an unchanged silhouette or trail.

| Edit     | Terrain mean RGB difference outside camp | Changed terrain samples | Mean / max silhouette deviation, original pixels | Original magenta mean RGB | Edited magenta mean RGB |
| -------- | ---------------------------------------: | ----------------------: | -----------------------------------------------: | ------------------------- | ----------------------- |
| village  |                                     6.62 |                  25.67% |                                     0.42 / 15.06 | 249.71, 3.47, 251.35      | 249.73, 2.07, 249.85    |
| fedenet  |                                     9.96 |                  40.10% |                                     1.67 / 20.45 | 249.47, 2.68, 251.34      | 248.36, 2.53, 251.16    |
| ordereze |                                    12.93 |                  54.34% |                                      1.32 / 4.67 | 248.43, 3.12, 251.41      | 248.92, 2.66, 250.56    |
| geekbot  |                                    10.41 |                  42.62% |                                     1.03 / 13.88 | 247.66, 3.87, 250.40      | 245.10, 3.06, 250.12    |
| lead     |                                     9.81 |                  43.30% |                                      0.78 / 2.66 | 247.54, 4.85, 250.70      | 248.72, 2.59, 248.89    |
| deepsea  |                                     5.89 |                  25.96% |                                      0.44 / 1.43 | 249.84, 4.03, 250.60      | 243.63, 3.11, 247.80    |

All eight outputs were visually inspected. No camp contains an added flag or writing. Width estimates in the image notes are approximate visual measurements of the structure, not guaranteed segmentation measurements. The separate flag background is also near-magenta with visible variation, not the requested pure flat fill. The kit's background sample values vary around pale blue-grey rather than the exact requested solid fill. These limitations remain in the saved artwork.
