# The Ascent — first four scene flats

Created with the built-in image_gen tool, one image call per flat (four calls total). No additional image-generation or retouching calls were made.

All four generated PNGs were **1672 × 941**. Each full canvas was resized to **1664 × 936** using macOS `sips -z 936 1664`, with no cropping, padding, or subject repositioning. Only the four deliverable PNGs and this README were written into the project. Existing files were not changed; no commit was made.

## Review and limitations

These are raw first-pass paintings, with the deviations below retained and disclosed. In particular, **none has a truly uniform exact #FF00FF background**: the generator produced small RGB variations throughout the near-magenta region. Resizing did not introduce this defect; it is also present in the native outputs. No background recoloring, silhouette masking, compositing, or other cleanup was performed.

The silhouette figures compare the topmost non-magenta pixel in each column of the final PNG with the corresponding guide. For this read-only check, near-magenta means R ≥ 220, G ≤ 55, B ≥ 220. These figures include trees, buildings, and cloud-edge refinements, and are approximate raster measurements rather than judgments of artistic quality. Every bottom-edge pixel is painted subject, with no magenta gaps. All backgrounds more than 8 px above both measured silhouettes are near-magenta; none of those checked pixels is exactly #FF00FF. Thin antialiased color mixing remains at subject edges.

## far-day.png

- File: [far-day.png](far-day.png)
- Final size: **1664 × 936**
- Resized: **yes**, from **1672 × 941**, whole-frame resize without cropping.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-far.png`
  2. `art/scene/style/frames/style-hero-day.png`
  3. `art/scene/style/frames/style-end-deepsea-day.png`
  4. `art/scene/style/inputs/style-reference.png`

### Framing, silhouette, and magenta review

Framing is close: crest absolute vertical difference from the guide is 2 px median, 9 px at the 95th percentile, 15 px maximum. The main crests and lowered middle remain in place. An uninterrupted painted cloud sea reaches the bottom; no extra land is visible in it. The ranges are more contrasty and detailed than the requested pale distant treatment.
Magenta review: no visible sky, sun, mist, detached subjects or broad halo in the empty background. Small naturalized mountain-edge excursions occupy some guide-magenta pixels. The generated background is slightly variable near-magenta, NOT pure flat #FF00FF; common top-background RGB is (252, 6, 250).

### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the buildings and the trail, quiet everywhere else. Fewer flowers and grass-blade accents than the style frames. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud #f1f4fa with #d6ddef shading. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the subject is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The subject's silhouette against magenta is crisp and clean. Where the guide's subject touches the canvas edge, the painting runs solidly off that edge (it will be faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags (they are added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one whole painted theatre flat for The Ascent, distant snowy ranges and cloud sea.
Output: a single 16:9 landscape PNG, 1664 × 936 pixels.
Input roles, in attached order: image 1 is the exact placement and silhouette guide, NOT a palette reference; images 2 and 3 are the approved rendering/style references only, NOT composition references; image 4 is rendering only, ignore all its subjects.
Treat image 1 as the locked full-canvas layout. Preserve its framing and scale exactly, with no crop, zoom, inset, margin, or reframing. Paint only its non-magenta area. Refine the crests into natural snowy landforms within a few percent of the guide's line.
Distant snowy Alpine ranges seen across a sea of clouds. The ranges' crests follow the guide's jagged line across the full width, pale and hazy with low contrast because they are very far away, lit from the upper right. The middle, behind where a separate main peak will stand, stays lower; do not add a central hero summit. At this 1664 × 936 layout the crest anchors are approximately (0,119), (91,198), (212,115), (333,218), (439,165), (530,241), (636,202), (742,255), (832,265), (938,248), (1044,195), (1150,238), (1256,152), (1361,211), (1482,82), (1603,188), (1664,115). Keep these positions while naturalizing the edges.
Below the ranges, an unbroken sea of soft white-blue clouds fills the WHOLE lower canvas, beginning around y=257, in gentle perspective: thin flat cloud layers near the horizon, larger soft billows toward the bottom. No other mountains, no ridges and no land anywhere in the cloud sea. The only land is the shallow top strip of distant snowy ranges. The clouds are opaque painted masses, solid at the left, right and bottom edges. Above the crests: perfectly flat pure #FF00FF magenta. All haze is within the mountains, never across their silhouette onto magenta. Do not include the sky, sun disk, terrain, buildings, tents, people or flags from the style references.
```

## peak-day.png

- File: [peak-day.png](peak-day.png)
- Final size: **1664 × 936**
- Resized: **yes**, from **1672 × 941**, whole-frame resize without cropping.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-peak.png`
  2. `art/scene/style/frames/style-end-deepsea-day.png`
  3. `art/scene/style/frames/style-camp-geekbot-day.png`
  4. `art/scene/style/inputs/style-reference.png`

### Framing, silhouette, and magenta review

Framing is close overall: silhouette absolute vertical difference from the guide is 3 px median, 19 px at the 95th percentile, 36 px maximum. The summit is near (834, 89), compared with the guide tip near (832, 92). Additional jagged ridge points extend above the guide, especially on the left; the cloud-bank edge is naturally billowed rather than straight. Opaque painted cloud fills the lower canvas, with no foreground land.
Magenta review: no visible sky, sun, mist, detached subjects or broad halo. Extra ridge points and a few cloud scallops occupy guide-magenta space. The generated background is slightly variable near-magenta, NOT pure flat #FF00FF; common top-background RGB is (252, 5, 250).

### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the buildings and the trail, quiet everywhere else. Fewer flowers and grass-blade accents than the style frames. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud #f1f4fa with #d6ddef shading. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the subject is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The subject's silhouette against magenta is crisp and clean. Where the guide's subject touches the canvas edge, the painting runs solidly off that edge (it will be faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags (they are added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one whole painted theatre flat for The Ascent, great snowy summit and opaque cloud foot.
Output: a single 16:9 landscape PNG, 1664 × 936 pixels.
Input roles, in attached order: image 1 is the exact placement and silhouette guide, NOT a palette reference; images 2 and 3 are the approved rendering/style references only, NOT composition references; image 4 is rendering only, ignore all its subjects.
Treat image 1 as the locked full-canvas layout. Preserve its framing and scale exactly, with no crop, zoom, inset, margin, or reframing. Paint only its non-magenta area. Refine the silhouette into natural snowy landforms within a few percent of the guide's line.
The great snowy peak, the brightest thing in the scene: one steep, noble summit pyramid with its tip exactly at approximately (832,94), ridges falling left and right into lower snowy shoulders, merging into an opaque cloud bank at y=401. The left shoulder reaches that level at x=300 and the right at x=1408; from there the cloud bank reaches the left and right canvas edges, as in the guide. Keep the mountain small in the full canvas exactly as the guide, occupying the upper middle rather than filling or enlarging to the frame. Secondary jagged ridge anchors near (690,223), (713,229), (877,119), (930,181), (954,175), with shoulder slopes through (577,297), (496,332), (1047,249), (1186,320).
Sunlit snow faces on the right, cool blue shade faces on the left, a few clean rock buttresses. Bright smooth snow masses with elegant carved ridges, sculpted rather than polygonal or heavily textured. From the guide's pale band at y=401 down to the very bottom of the canvas, the peak's foot disappears into thick soft white cloud: opaque, painted cloud filling the whole bottom of the canvas, no foreground land, no exposed mountain foot or rock islands. Magenta above the exact mountain/cloud silhouette. Clouds stay solid and run off left, right and bottom edges, with no fades. No other mountains. Do not include the sky, sun disk, meadow, buildings, tents, people or flags from the style references.
```

## village-day.png

- File: [village-day.png](village-day.png)
- Final size: **1664 × 936**
- Resized: **yes**, from **1672 × 941**, whole-frame resize without cropping.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-village.png`
  2. `art/scene/style/frames/style-hero-day.png`
  3. `art/scene/style/inputs/village-1.png`
  4. `art/scene/style/frames/style-materials.png`
  5. `art/scene/style/inputs/style-reference.png`

### Framing, silhouette, and magenta review

The broad meadow framing is recognizable, but this is not an exact placement-guide match. Silhouette absolute vertical difference is 8 px median, 21 px at the 95th percentile, 41 px maximum. The chalets are substantially larger than their yellow boxes and sit a little lower overall; the larger chalet roof reaches the skyline. Conifer crowns protrude into the guide's magenta. The trail continues down and right across the foreground instead of remaining the short high curve shown in the guide. The left third has no buildings, trees or boulders, but its grass brushwork is busier than the requested smooth quiet treatment. There are more rock and grass accents than requested.
Magenta review: tree crowns and part of the larger chalet's upper silhouette intrude into space that was magenta in the guide; no visible sky, cloud, mist, detached objects or broad halo. The generated background is slightly variable near-magenta, NOT pure flat #FF00FF; common top-background RGB is (250, 4, 252).

### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the buildings and the trail, quiet everywhere else. Fewer flowers and grass-blade accents than the style frames. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud #f1f4fa with #d6ddef shading. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the subject is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The subject's silhouette against magenta is crisp and clean. Where the guide's subject touches the canvas edge, the painting runs solidly off that edge (it will be faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags (they are added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one whole painted theatre flat for The Ascent, trailhead meadow and two tiny chalets.
Output: a single 16:9 landscape PNG, 1664 × 936 pixels.
Input roles, in attached order: image 1 is the exact placement, scale, silhouette, building and path guide, NOT a palette reference; image 2 is the approved rendering/style reference only, NOT composition; image 3 is the chalet subject/design reference, repainted much smaller in the guide's boxes; image 4 is the approved materials/rendering reference; image 5 is rendering only, ignore all its subjects.
Treat image 1 as the locked full-canvas layout. Preserve its framing and scale exactly, with no crop, zoom, inset, margin, or reframing. The meadow runs solidly off both sides and the bottom. Its broad, gently rising crest follows the guide, from approximately (0,218) through (400,177), (800,136), (1015,128), (1200,136), to (1664,189); softly naturalize this line within a few percent, never replace it with a mountain or high ridge. Above this crest is pure flat #FF00FF magenta.
The trailhead meadow: broad smooth painted Alpine grass masses filling the guide's area. Two SMALL chalets stand INSIDE the two larger yellow boxes, left one bigger at x=766–850, y=152–216 with an ochre-orange roof, right one smaller at x=881–946, y=165–215 with a dark green roof, pale stone bases and wooden walls. Each whole chalet, including roof and chimney, must fit its respective box and stay below the meadow skyline, backed by grass. Use the chalet reference's timber framing, roof, window and door, repainted in the soft approved style; do not reproduce its large framing or warm light. A blank wooden signpost on a few stones occupies the narrow box at x=1032–1045, y=163–215. The tan guide curve becomes a narrow earthen trail: from the signpost around (1018,213), curving right toward (1059,177), then left to climb over the crest near (1018,128). Preserve this short trail high in the scene; do not extend it down through the foreground.
A few conifers in loose groups well left and right of the chalets, mainly in the middle third vertically, with crowns below the meadow crest. A couple of big smooth sculpted boulders in the lower meadow, outside the left third. The LEFT third of the entire canvas, x=0–555, stays calm and simple: smooth painted grass only, no rocks, conifers, flowers or blade accents, because a title will sit over it. The rest is quiet too, with restrained grass/flower marks only around buildings and trail. Cool airy daylight, lit upper right, cool shadows lower left. No background mountains, clouds, sky, sun disk, tents, flags or extra houses. Do not paint the yellow boxes or guide marks.
```

## fedenet-day.png

- File: [fedenet-day.png](fedenet-day.png)
- Final size: **1664 × 936**
- Resized: **yes**, from **1672 × 941**, whole-frame resize without cropping.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-fedenet.png`
  2. `art/scene/style/frames/style-camp-geekbot-day.png`
  3. `art/scene/style/inputs/camp-2015.png`
  4. `art/scene/style/frames/style-materials.png`
  5. `art/scene/style/inputs/style-reference.png`

### Framing, silhouette, and magenta review

The broad ridge framing and right-hand fall follow the guide closely; the small cabin remains backed by rising ground rather than sitting on the skyline. Silhouette absolute vertical difference is 5 px median, 38 px at the 95th percentile, 76 px maximum. Upper-left conifer crowns cause the largest excursions, exceeding the requested few-percent silhouette tolerance. A larger rock outcrop also changes the upper crest locally. The cabin is somewhat larger and shifted right relative to its box. The trail broadly follows the guide but is wider and shifts right near the bottom. The right third stays free of trees and boulders, though its grass brushwork is busier than requested. More rocks and grass accents are present than requested.
Magenta review: upper-left conifers and some crest rocks intrude into the guide's magenta; no visible sky, cloud, mist, detached objects or broad halo. The generated background is slightly variable near-magenta, NOT pure flat #FF00FF; common top-background RGB is (250, 3, 252).

### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the buildings and the trail, quiet everywhere else. Fewer flowers and grass-blade accents than the style frames. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. Cloud #f1f4fa with #d6ddef shading. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the subject is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The subject's silhouette against magenta is crisp and clean. Where the guide's subject touches the canvas edge, the painting runs solidly off that edge (it will be faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags (they are added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one whole painted theatre flat for The Ascent, ridge shoulder at the pine wood with a small wooden cabin.
Output: a single 16:9 landscape PNG, 1664 × 936 pixels.
Input roles, in attached order: image 1 is the exact placement, scale, silhouette, cabin and path guide, NOT a palette reference; image 2 is the approved rendering/style reference only, NOT composition; image 3 is the cabin subject/design reference, repainted much smaller in the guide's box; image 4 is the approved materials/rendering reference; image 5 is rendering only, ignore all its subjects.
Treat image 1 as the locked full-canvas layout. Preserve its framing and scale exactly, with no crop, zoom, inset, margin, or reframing. The ridge runs solidly off both sides and the bottom. A ridge shoulder at the edge of the pine wood, rising from the lower right to its high point at the upper left, exactly along the guide's silhouette. Crest anchors in the 1664 × 936 canvas are approximately (0,278), (166,209), (333,146), (499,100), (632,75), (743,62), (832,88), (918,153), (1082,209), (1181,258), (1664,537). Refine this into soft natural contours within a few percent, keeping its broad profile. Above this crest is pure flat #FF00FF magenta.
At the yellow box, x=657–762, y=160–230, on a small level grassy ledge with the slope rising behind it (NEVER on the skyline): the small wooden cabin from image 3, plank walls, stone chimney, ONE window, door with a step, a small firewood stack. Keep the whole cabin including chimney and roof at this exact small scale, inside the box with its base at y=230. It is a small detail in a large ridge, NOT an enlarged focal building. Repaint its timber, stone base and ochre roof in the soft approved style with cool daylight rather than the reference's warm light.
The earthen trail comes up from the bottom edge near (847,936) along the tan line: curving to (766,640), (734,419), (744,304), (785,230), where a short left branch meets the cabin's door, then turns right and climbs over the crest near (918,153) along the tan line. Preserve this alignment and narrow width, with the slope painted continuously around it.
Groups of conifers on the upper-left part of the ridge, with crowns mainly within the guide's ridge area and at most a small natural silhouette refinement; a few lower down at the left. Two or three smooth sculpted boulders and a small rock outcrop on the left or center. The RIGHT third of the canvas, x=1109–1664, stays calm: broad smooth grass slopes falling away, no rocks, trees or flower/grass-blade clutter, because a card will sit over it. Restrained detail concentrated around the tiny cabin and path. No background mountains, clouds, sky, sun disk, tents, flags, people, animals or extra cabins. Do not paint the yellow box or guide marks.
```

## Remaining four ridge flats — Ordereze, Geekbot, Lead and Deepsea

Created with the built-in image_gen tool: **one image call per ridge, four calls total**, with `fedenet-day.png` attached as image 2 on every call. The four complete prompts below start with the user's STYLE block verbatim. No regeneration, retouching, masking, compositing, recoloring or background cleanup was performed.

All four native outputs were **1672 × 941**. Each entire canvas was resized to **1664 × 936** with macOS `sips -z 936 1664`, without cropping, padding or repositioning. Only the four new PNGs and this appended README section were written into the project. No code, configuration, packages or prior artwork were changed; no commit was made.

The paintings are visually coherent with Fedenet's daylight, brush scale and finish, but they are **not exact guide or specification matches**. In particular, camp scale/position deviates as described below, grass detail is busier than requested, and **all four backgrounds vary slightly around magenta rather than being pure flat #FF00FF**. The native outputs already contain that background variation; it was not caused solely by resizing.

Silhouette measurements use the topmost non-near-magenta pixel in each column. For this read-only check, near-magenta means R ≥ 220, G ≤ 55, B ≥ 220. Numbers include vegetation and rock refinements. Camp bounds below are approximate visual estimates, not pixel-perfect object segmentation. Across all four finals, every bottom-edge pixel is subject, and every checked background pixel more than 8 px above both the guide and painted silhouettes is near-magenta. None of those checked background pixels is exactly #FF00FF. Thin antialiased color mixing remains along the cutout edges.

### ordereze-day.png

- File: [ordereze-day.png](ordereze-day.png)
- Final size: **1664 × 936**, 2,774,039 bytes.
- Resized: **yes**, from **1672 × 941**; whole-frame resize, no crop.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Native generated source: `/Users/teo/.codex/generated_images/01a16ebf-4349-77a3-a27d-a4b6fd26a2ae/exec-b9fd51c5-f3b3-414f-bd6c-e62d297078bb.png`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-ordereze.png`
  2. `art/scene/flats/raw/fedenet-day.png`
  3. `art/scene/style/inputs/camp-2016.png`
  4. `art/scene/style/frames/style-camp-geekbot-day.png`
  5. `art/scene/style/frames/style-materials.png`

#### Silhouette, camp placement and limitations

The broad right-high ridge follows the guide closely. Camp is near the intended location, fully backed by rising pasture, with its base near y=225 versus guide y=228. The tent body is approximately 95–100 px wide, about 80% of the guide's 124 px box width: it does NOT fill the box. Tent plus lantern and crate span more than the box, but that does not satisfy the requested tent width. The tent reads as a three-quarter A-frame rather than a strictly side-on view. Lantern has no visible emitted glow. Two small conifers stay low on the right. There are more boulders, grass strokes and flower accents than requested; the left third has no major props, but remains busier than the desired smooth card area. The trail follows the general mirrored route, with modest widening and displacement toward the bottom. Small grass/rock crest refinements occupy guide-magenta space; no visible detached subjects, sky, mist or broad halo.

Silhouette absolute vertical difference from the guide: **5 px median, 20 px at the 95th percentile, 26 px maximum**. Common checked background RGB: **(249, 3, 252)**, not exact #FF00FF. No visible sky, sun, cloud, detached object, mist or broad glow leaked into the empty background; the incursions are the attached naturalized silhouette features described above.

#### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached fedenet-day painting and style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the camp and the trail, quiet everywhere else. Few flowers and grass-blade accents. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the ridge is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The silhouette against magenta is crisp and clean. Where the guide's ridge touches the canvas edge, the painting runs solidly off that edge (it is faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags or flagpoles (added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one complete ridge theatre flat for The Ascent, part of the same continuous Alpine climb as fedenet-day.
Output: a single landscape 16:9 PNG, exactly 1664 × 936 pixels. Preserve the entire guide canvas: no crop, zoom, margins, inset or reframing.
Input roles, in attached order: image 1 is the locked composition/silhouette/camp-scale/trail placement guide, not a palette reference. Image 2 is fedenet-day, the primary consistency anchor: match its brush scale, paint finish, daylight direction and palette exactly, so this looks painted for the same scene by the same artist. Image 3 is the camp identity reference only: repaint it at the guide's small distant camp size. Images 4 and 5 are supporting style/material references only; do not copy their compositions, skies, sun disks, background mountains, clouds, extra camps or flags.
Paint the guide's green ridge into natural landforms with the same full-width silhouette within a few percent. Replace the yellow rectangle with the actual camp, remove all guide outlines. The camp must fill the yellow box's WIDTH: the tent body itself should be approximately 124 pixels wide at the final canvas size, not a tiny tent floating inside the box, and stay within its height. All of the tent must be backed by rising terrain, never on the skyline. Make a small level patch under the camp. Preserve the tan trail's route, painted as a natural earth footpath widening gently toward the viewer at the bottom, with restrained stones. The ridge runs opaquely off the bottom and both sides wherever the guide does. The empty background is perfectly uniform RGB(255,0,255), not approximate pink or violet, no texture or compression-like variation. No detached objects on magenta.
Alpine pasture, one camp higher than Fedenet: smooth open grass slopes with the first scattered big smooth sculpted boulders, only two or three small conifers LOW on the outer RIGHT side, their crowns below the guide silhouette. No trees elsewhere.
The ridge rises to its high point on the RIGHT and falls away to the left. Guide crest anchors in final pixels: (0,535), (167,443), (333,345), (499,254), (582,208), (745,152), (832,87), (919,62), (1024,75), (1164,102), (1333,145), (1498,211), (1664,278). Naturalize gently without moving these more than a few percent.
Camp: the small SIDE-ON cream/yellow canvas ridge tent with dark teal side and crossed wooden supports from camp-2016, its wooden crate and one lantern with DARK UNLIT glass, no glow. The tent body fills x=858–981, y=147–228, base at y=228, with a level patch and rising green hillside behind the roof. Put the crate and lantern immediately beside the tent without shrinking the tent to fit them.
Trail: enters bottom near (817,936), bends through (884,683), (923,490), (930,363), then climbs to the camp near (875,228), then bends left/up to cross the crest at (745,152). Keep the guide's clear mirrored curve, not the Fedenet route.
The LEFT third, x=0–555, stays calm: smooth painted grass falling away with broad quiet modelling, no rocks, trees or busy flower/blade accents there; a separate card will cover it. Do not include the card.
```

### geekbot-day.png

- File: [geekbot-day.png](geekbot-day.png)
- Final size: **1664 × 936**, 2,575,883 bytes.
- Resized: **yes**, from **1672 × 941**; whole-frame resize, no crop.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Native generated source: `/Users/teo/.codex/generated_images/01a16ebf-4349-77a3-a27d-a4b6fd26a2ae/exec-195ee741-7d0d-4a78-ad6d-2f66ebab5c55.png`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-geekbot.png`
  2. `art/scene/flats/raw/fedenet-day.png`
  3. `art/scene/style/inputs/camp-2018.png`
  4. `art/scene/style/frames/style-camp-geekbot-day.png`
  5. `art/scene/style/frames/style-materials.png`

#### Silhouette, camp placement and limitations

The broad left-high ridge follows the guide closely except for upper-left conifer tips: these exceed the few-percent silhouette tolerance locally. The tent body is approximately 125–130 px wide, close to the 124 px guide box width, so it fills the intended width approximately. However, the tent is shifted about 20–25 px left, with its base about 10 px above the box's bottom, rather than occupying the box exactly. The camp remains backed by rising ground. A small cool stone/log fire ring is present and unlit, with no visible flame, smoke or glow. There are more conifers, boulders and grass accents than requested, and the grass remains lush rather than clearly thinner/cooler. The right third stays free of major props but retains grass texture. The trail follows the upper guide curve; its lower end shifts substantially right. Upper-left tree crowns and a few rocks/grass crests intrude into guide-magenta space; no visible detached subjects, sky, mist or broad halo.

Silhouette absolute vertical difference from the guide: **4 px median, 23 px at the 95th percentile, 56 px maximum**. Common checked background RGB: **(248, 4, 251)**, not exact #FF00FF. No visible sky, sun, cloud, detached object, mist or broad glow leaked into the empty background; the incursions are the attached naturalized silhouette features described above.

#### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached fedenet-day painting and style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the camp and the trail, quiet everywhere else. Few flowers and grass-blade accents. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the ridge is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The silhouette against magenta is crisp and clean. Where the guide's ridge touches the canvas edge, the painting runs solidly off that edge (it is faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags or flagpoles (added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one complete ridge theatre flat for The Ascent, part of the same continuous Alpine climb as fedenet-day.
Output: a single landscape 16:9 PNG, exactly 1664 × 936 pixels. Preserve the entire guide canvas: no crop, zoom, margins, inset or reframing.
Input roles, in attached order: image 1 is the locked composition/silhouette/camp-scale/trail placement guide, not a palette reference. Image 2 is fedenet-day, the primary consistency anchor: match its brush scale, paint finish, daylight direction and palette exactly, so this looks painted for the same scene by the same artist. Image 3 is the camp identity reference only: repaint it at the guide's small distant camp size. Images 4 and 5 are supporting style/material references only; do not copy their compositions, skies, sun disks, background mountains, clouds, extra camps or flags.
Paint the guide's green ridge into natural landforms with the same full-width silhouette within a few percent. Replace the yellow rectangle with the actual camp, remove all guide outlines. The camp must fill the yellow box's WIDTH: the tent body itself should be approximately 124 pixels wide at the final canvas size, not a tiny tent floating inside the box, and stay within its height. All of the tent must be backed by rising terrain, never on the skyline. Make a small level patch under the camp. Preserve the tan trail's route, painted as a natural earth footpath widening gently toward the viewer at the bottom, with restrained stones. The ridge runs opaquely off the bottom and both sides wherever the guide does. The empty background is perfectly uniform RGB(255,0,255), not approximate pink or violet, no texture or compression-like variation. No detached objects on magenta.
High pasture with grey rock, higher and cooler than Ordereze: thinner cooler grass, two or three larger smooth sculpted grey rock outcrops breaking through. Only a few small larches or conifers at the far LEFT, their crowns kept below the ridge silhouette. Restrained grass and tiny flower accents only near trail and camp.
The ridge rises to its high point on the LEFT and falls away to the right. Guide crest anchors in final pixels: (0,278), (166,211), (331,145), (500,102), (640,75), (745,62), (832,87), (919,152), (1082,208), (1165,254), (1331,345), (1497,443), (1664,535). Naturalize gently without moving these more than a few percent.
Camp: the yellow A-frame tent with crossed wooden supports and dark doorway from camp-2018, plus a small stone fire ring beside it. The fire is UNLIT: only cool logs and stones, no flame, ember, smoke or glow. The tent body fills x=683–806, y=147–228, base at y=228, on a small level patch backed by rising meadow and rock. Keep the tent full box width; do not shrink it to fit the fire ring.
Trail: enters bottom near (847,936), bends through (780,683), (741,490), (734,363), then climbs to the camp near (789,228), then bends right/up to cross the crest at (919,152).
The RIGHT third, x=1109–1664, stays calm: broad quiet smooth grass with cooler shading and no trees or large rocks or busy grass/flower accents there. A separate card will cover it; do not include the card.
```

### lead-day.png

- File: [lead-day.png](lead-day.png)
- Final size: **1664 × 936**, 2,712,980 bytes.
- Resized: **yes**, from **1672 × 941**; whole-frame resize, no crop.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Native generated source: `/Users/teo/.codex/generated_images/01a16ebf-4349-77a3-a27d-a4b6fd26a2ae/exec-e6c7b250-6c8f-401a-bc3b-6485b0f36197.png`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-lead.png`
  2. `art/scene/flats/raw/fedenet-day.png`
  3. `art/scene/style/inputs/camp-2022.png`
  4. `art/scene/style/frames/style-end-deepsea-day.png`
  5. `art/scene/style/frames/style-materials.png`

#### Silhouette, camp placement and limitations

The right-high rocky shoulder is recognizable, but large naturalized rock crests raise and reshape parts of the silhouette, locally by about 4% of canvas height. The cream bell tent is fully backed by the rocky slope but is oversized and shifted right: approximately 170–175 px wide against the 124 px box, about 140% of its width, with its center roughly 35 px too far right and its apex about 40 px too high. It fills and exceeds the intended box rather than fitting it. Doorway is dark and unlit, orange scalloped trim and a blank wooden sign are visible. Only two backpacks are clearly distinguishable; a requested third is not reliably readable. No trees. Much more grass remains than the requested last patches in hollows; the left third contains substantial detailed rock masses and is not the requested quiet area. The trail broadly follows the intended route but widens and shifts right toward the foreground. Extra rock crest forms occupy guide-magenta space; no visible detached subjects, sky, mist or broad halo.

Silhouette absolute vertical difference from the guide: **10 px median, 34 px at the 95th percentile, 37 px maximum**. Common checked background RGB: **(248, 5, 251)**, not exact #FF00FF. No visible sky, sun, cloud, detached object, mist or broad glow leaked into the empty background; the incursions are the attached naturalized silhouette features described above.

#### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached fedenet-day painting and style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the camp and the trail, quiet everywhere else. Few flowers and grass-blade accents. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the ridge is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The silhouette against magenta is crisp and clean. Where the guide's ridge touches the canvas edge, the painting runs solidly off that edge (it is faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags or flagpoles (added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one complete ridge theatre flat for The Ascent, part of the same continuous Alpine climb as fedenet-day.
Output: a single landscape 16:9 PNG, exactly 1664 × 936 pixels. Preserve the entire guide canvas: no crop, zoom, margins, inset or reframing.
Input roles, in attached order: image 1 is the locked composition/silhouette/camp-scale/trail placement guide, not a palette reference. Image 2 is fedenet-day, the primary consistency anchor: match its brush scale, paint finish, daylight direction and palette exactly, so this looks painted for the same scene by the same artist. Image 3 is the camp identity reference only: repaint it at the guide's small distant camp size. Images 4 and 5 are supporting style/material references only; do not copy their compositions, skies, sun disks, background mountains, clouds, extra camps or flags.
Paint the guide's green ridge into natural landforms with the same full-width silhouette within a few percent. Replace the yellow rectangle with the actual camp, remove all guide outlines. The camp must fill the yellow box's WIDTH: the tent body itself should be approximately 124 pixels wide at the final canvas size, not a tiny tent floating inside the box, and stay within its height. All of the tent must be backed by rising terrain, never on the skyline. Make a small level patch under the camp. Preserve the tan trail's route, painted as a natural earth footpath widening gently toward the viewer at the bottom, with restrained stones. The ridge runs opaquely off the bottom and both sides wherever the guide does. The empty background is perfectly uniform RGB(255,0,255), not approximate pink or violet, no texture or compression-like variation. No detached objects on magenta.
A rocky shoulder above the pasture: pale sculpted stone and restrained scree, only the last patches of cool green grass in hollows, NO TREES. Rocks are large smooth modelled forms, not sharp vector facets or a dense pebble field; quiet areas remain broad and simple.
The ridge rises to its high point on the RIGHT and falls away to the left. Guide crest anchors in final pixels: (0,535), (167,443), (333,345), (499,254), (582,208), (745,152), (832,87), (919,62), (1024,75), (1164,102), (1333,145), (1498,211), (1664,278). Naturalize gently without moving these more than a few percent.
Camp: the CREAM BELL TENT from camp-2022, recognizable cone roof, scalloped ORANGE trim, THREE small backpacks by the door and a SHORT BLANK WOODEN SIGNPOST nearby. Doorway and windows DARK, UNLIT, no amber glow. The tent body fills x=858–981, y=147–228, base at y=228, on a small level stony patch with the rocky hillside rising behind its whole roof. Keep the tent full box width; do not shrink it to make room for the backpacks and signpost.
Trail: enters bottom near (817,936), bends through (884,683), (923,490), (930,363), then climbs to the camp near (875,228), then bends left/up to cross the crest at (745,152). Natural pale earth and scree footpath.
The LEFT third, x=0–555, stays calm: broad smooth stone planes and subdued scree masses, no foreground crags or busy pebble details; a separate card will cover it. Do not include the card.
```

### deepsea-day.png

- File: [deepsea-day.png](deepsea-day.png)
- Final size: **1664 × 936**, 2,287,142 bytes.
- Resized: **yes**, from **1672 × 941**; whole-frame resize, no crop.
- Generation: one built-in image_gen call; `transparent_background: false`.
- Native generated source: `/Users/teo/.codex/generated_images/01a16ebf-4349-77a3-a27d-a4b6fd26a2ae/exec-fb33758d-05f8-4793-bc92-e039e5477c0f.png`.
- Inputs, in exact tool order:
  1. `art/scene/flats/guides/guide-deepsea.png`
  2. `art/scene/flats/raw/fedenet-day.png`
  3. `art/scene/style/inputs/camp-2026.png`
  4. `art/scene/style/frames/style-end-deepsea-day.png`
  5. `art/scene/style/frames/style-materials.png`

#### Silhouette, camp placement and limitations

The broad left-high snow ridge follows the guide, with added rocky summit shapes shifting portions of the crest by up to 44 px (about 4.7% of canvas height). The dome tent remains backed by the slope on a trodden patch. It is approximately 150–155 px wide against the 124 px box, about 125% of its width, so it fills and exceeds the box. Its center is roughly 10 px right and its base roughly 10 px low. The cream cap and curved pole structure are recognizable; the fabric reads yellow-ochre rather than strongly orange, and the rolled door flap and individual wooden pegs are not clearly resolved at this scale. No trees or wind spinner. Snow and smooth blue shading dominate, and the right third is the calmest card area of this set. More grass is exposed across the lower-left area than the requested tiny lowest-edge patch. The upper trail remains distinctly visible all the way to the crest rather than fading out as requested, and its bottom end shifts right. Rock/snow crest refinements occupy guide-magenta space; no visible detached subjects, sky, mist or broad halo.

Silhouette absolute vertical difference from the guide: **8 px median, 34 px at the 95th percentile, 44 px maximum**. Common checked background RGB: **(250, 4, 251)**, not exact #FF00FF. No visible sky, sun, cloud, detached object, mist or broad glow leaked into the empty background; the incursions are the attached naturalized silhouette features described above.

#### Complete prompt

```text
Rendering: high-end painterly digital illustration in the soft polished style of the attached fedenet-day painting and style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the camp and the trail, quiet everywhere else. Few flowers and grass-blade accents. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the ridge is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The silhouette against magenta is crisp and clean. Where the guide's ridge touches the canvas edge, the painting runs solidly off that edge (it is faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags or flagpoles (added separately). Signposts are blank.

Use case: stylized-concept.
Asset type: one complete ridge theatre flat for The Ascent, part of the same continuous Alpine climb as fedenet-day.
Output: a single landscape 16:9 PNG, exactly 1664 × 936 pixels. Preserve the entire guide canvas: no crop, zoom, margins, inset or reframing.
Input roles, in attached order: image 1 is the locked composition/silhouette/camp-scale/trail placement guide, not a palette reference. Image 2 is fedenet-day, the primary consistency anchor: match its brush scale, paint finish, daylight direction and palette exactly, so this looks painted for the same scene by the same artist. Image 3 is the camp identity reference only: repaint it at the guide's small distant camp size. Images 4 and 5 are supporting style/material references only; do not copy their compositions, skies, sun disks, background mountains, clouds, extra camps or flags.
Paint the guide's green ridge into natural landforms with the same full-width silhouette within a few percent. Replace the yellow rectangle with the actual camp, remove all guide outlines. The camp must fill the yellow box's WIDTH: the tent body itself should be approximately 124 pixels wide at the final canvas size, not a tiny tent floating inside the box, and stay within its height. All of the tent must be backed by rising terrain, never on the skyline. Make a small level patch under the camp. Preserve the tan trail's route, painted as a natural earth footpath widening gently toward the viewer at the bottom, with restrained stones. The ridge runs opaquely off the bottom and both sides wherever the guide does. The empty background is perfectly uniform RGB(255,0,255), not approximate pink or violet, no texture or compression-like variation. No detached objects on magenta.
The snow line, the highest and last camp: smooth WIND-PACKED SNOW draped over sculpted pale stone. Only a little thin grass at the LOWEST LEFT edge, NO TREES. Broad snow masses modelled gently with the specified cool blue shades, a few large smoothly sculpted exposed rocks, no falling snow, no glitter/noise.
The ridge rises to its high point on the LEFT and falls away to the right. Guide crest anchors in final pixels: (0,278), (166,211), (331,145), (500,102), (640,75), (745,62), (832,87), (919,152), (1082,208), (1165,254), (1331,345), (1497,443), (1664,535). Naturalize gently without moving these more than a few percent.
Camp: the ORANGE AND CREAM low ROUND DOME tent from camp-2026, cream cap, rolled door flap and wooden pegs; retain recognizable curved pole structure and dark teal lower panels. NO WIND SPINNER. The tent body fills x=683–806, y=147–228, base at y=228, on a small level trodden patch backed by rising snow-covered ground, never on the skyline. The orange is the tent fabric only, with cool daylight on the whole scene.
Trail: enters bottom near (847,936), bends through (780,683), (741,490), (734,363), then climbs to the camp near (789,228), then bends right/up toward (919,152), FADING OUT naturally into the snow as it crosses the crest beyond the camp: this is the last camp, no continuation into another scene or camp.
The RIGHT third, x=1109–1664, stays calm: broad smooth wind-packed snow fields, no busy rock or footprint marks there. A separate card will cover it; do not include the card.
```
