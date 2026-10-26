# /about: the saucer

The saucer of the page's easter egg is the top-left piece of `raw/ufo-day.png` and `raw/ufo-night.png`. Both sheets were painted with the built-in `image_gen` tool on 2026-10-25, as part of a kit for an earlier design of /about (a camp with a cow the saucer visited); only the saucer ships. The day sheet is a new painting, the night an edit of the selected day. `pnpm about` (`scripts/process-about.mjs`) cuts the saucer out, keys it, gives the night the day's outline and finds its running lights.

The tool's sheets are oversized against the brief (the saucer about 540 px wide rather than 420) and their magenta is near, not exact, #FF00FF; the processing keys it either way. The inputs named below other than this folder's own are local reference paintings.

## Day

#### ufo-day — try 1

Inputs in order: `art/cv/raw/frame-04-day.png`, `art/about/raw/camp-frame-day.png`, `art/scene/style/frames/style-materials.png`.

Tool output: `/Users/teo/.codex/generated_images/01a174c4-444e-7f50-9574-22800b232f62/exec-a1752c95-efbf-47b9-a2a9-6893af30077e.png`.

Assessment: Four readable disconnected pieces; saucer/cows/bell oversized and insufficient cell inset. Retry. **Not selected.**

Empty-corner check: 149 colors, 0/40000 exact magenta pixels.

```text
Use case: illustration-story. Output exactly 1536 × 1024 pixels.
Inputs in order: 1 frame-04-day.png, approved UFO and cow STYLE/identity reference only; 2 camp-frame-day.png, painterly style reference; 3 style-materials.png, supporting material reference. Create a NEW sprite sheet, not a scene.
A cut-out on pure flat magenta #FF00FF: never tint, darken or blend the magenta, and never let pink or purple reflect into anything. No sky, no background scenery, no glow, no halo, no cast shadow onto the magenta. Same soft polished painterly rendering as the approved frame, light from the TOP RIGHT. No text, letters, numbers, logos, borders or watermark. The backdrop must be the single perfectly uniform RGB (255,0,255) digital color field without noise or texture. Opaque, not transparent.
A sheet of four separate pieces on a grid of 2 columns x 2 rows, each centred in its cell with at least 80 px of magenta around it, in the soft storybook style of the first image (whimsical, never scary):
(1) top-left: a classic flying saucer, about 420 px wide: slate-blue domed hull, cream underside, a ring of small warm orange running lights round its rim, seen slightly from below, level;
(2) top-right: an Alpine cow (Simmental: cream with muted red-brown patches) grazing, head down to the grass, seen from the side, about 380 px wide, wearing only a leather collar (no bell), standing on nothing;
(3) bottom-left: the same cow floating up, calm, legs dangling softly, a tuft of grass in its mouth, slightly tilted, about 360 px wide, no collar bell;
(4) bottom-right: a small brass cow bell on its leather strap lying on a little tuft of alpine grass, about 140 px wide.
No beam in this sheet. No glow outside the saucer lights; no ground below the cows. No sky or scenery. Do not paint the reference fence or bucket. The two cows must look like the same individual in two poses. Cell centres (384,256),(1152,256),(384,768),(1152,768), and keep all art within 80 px inset of each cell. No grid lines or labels.
```

#### ufo-day — try 2

Inputs in order: `art/cv/raw/frame-04-day.png`, `art/about/raw/camp-frame-day.png`, `art/scene/style/frames/style-materials.png`.

Tool output: `/Users/teo/.codex/generated_images/01a174c4-444e-7f50-9574-22800b232f62/exec-66c93fd6-ebd9-4f37-aee9-2781ba4119e8.png`.

Assessment: Four good isolated pieces, improved sizes, saucer still ~565 px and inset <80 px. Bell still oversized. Retry. **Not selected.**

Empty-corner check: 140 colors, 0/40000 exact magenta pixels.

```text
Use case: illustration-story. Output exactly 1536 × 1024 pixels.
Inputs in order: 1 frame-04-day.png, approved UFO and cow STYLE/identity reference only; 2 camp-frame-day.png, painterly style reference; 3 style-materials.png, supporting material reference. Create a NEW sprite sheet, not a scene.
A cut-out on pure flat magenta #FF00FF: never tint, darken or blend the magenta, and never let pink or purple reflect into anything. No sky, no background scenery, no glow, no halo, no cast shadow onto the magenta. Same soft polished painterly rendering as the approved frame, light from the TOP RIGHT. No text, letters, numbers, logos, borders or watermark. The backdrop must be the single perfectly uniform RGB (255,0,255) digital color field without noise or texture. Opaque, not transparent.
A sheet of four separate pieces on a grid of 2 columns x 2 rows, each centred in its cell with at least 80 px of magenta around it, in the soft storybook style of the first image (whimsical, never scary):
(1) top-left: a classic flying saucer, about 420 px wide: slate-blue domed hull, cream underside, a ring of small warm orange running lights round its rim, seen slightly from below, level;
(2) top-right: an Alpine cow (Simmental: cream with muted red-brown patches) grazing, head down to the grass, seen from the side, about 380 px wide, wearing only a leather collar (no bell), standing on nothing;
(3) bottom-left: the same cow floating up, calm, legs dangling softly, a tuft of grass in its mouth, slightly tilted, about 360 px wide, no collar bell;
(4) bottom-right: a small brass cow bell on its leather strap lying on a little tuft of alpine grass, about 140 px wide.
No beam in this sheet. No glow outside the saucer lights; no ground below the cows. No sky or scenery. Do not paint the reference fence or bucket. The two cows must look like the same individual in two poses. Cell centres (384,256),(1152,256),(384,768),(1152,768), and keep all art within 80 px inset of each cell. No grid lines or labels.
RETRY PRIORITY: These are SMALL separate sprites on a LARGE empty magenta field. Prior output made everything much too big. Saucer maximum bounds x174–594, y160–352 (420 px wide). Grazing cow maximum bounds x962–1342, y126–386 (380 px wide). Floating cow maximum bounds x204–564, y638–898 (360 px wide). Bell with strap and grass maximum bounds x1082–1222, y708–828 (140 px total width). Leave generous empty magenta around each sprite and all through the sheet; no grid lines. Every sprite fully inside its cell, minimum 80 px clearance. Pale cream and muted red-brown cow, not orange. No bell on either cow. Perfect uniform RGB 255,0,255 backdrop.
```

#### ufo-day — try 3 (selected)

Inputs in order: `art/cv/raw/frame-04-day.png`, `art/about/raw/camp-frame-day.png`, `art/scene/style/frames/style-materials.png`.

Tool output: `/Users/teo/.codex/generated_images/01a174c4-444e-7f50-9574-22800b232f62/exec-2d12d681-815a-4635-9497-82b5b405833f.png`.

Assessment: Best of three: four appealing separate pieces, same cow look and no bells on collars. Saucer ~540 px, cows ~470/~420 px, bell/grass ~300 px; requested sizes/insets not fully met; slight halo on saucer dome. **Selected.**

Empty-corner check: 157 colors, 0/40000 exact magenta pixels.

```text
Use case: illustration-story. NEW sprite sheet, exactly 1536 x 1024 pixels. Input 1 frame-04-day.png: approved whimsical UFO and Simmental cow identity/look reference only. Input 2 camp-frame-day.png: painterly rendering reference only. Input 3 style-materials.png: supporting style reference only.
A cut-out on pure flat magenta #FF00FF: never tint, darken or blend the magenta, and never let pink or purple reflect into anything. No sky, no background scenery, no glow, no halo, no cast shadow onto the magenta. Same soft polished painterly rendering as the approved frame, light from the TOP RIGHT. No text, letters, numbers, logos, borders or watermark. The backdrop must be the single perfectly uniform RGB (255,0,255) digital color field without noise or texture. Opaque, not transparent.
A sparse 2 x 2 sprite sheet of four SMALL disconnected pieces, each centred within its cell with at least 80 pixels empty magenta inset from every cell edge. Most of canvas is empty magenta. Top-left (centre384,256): level classic slate-blue domed flying saucer, cream underside, small orange rim lights, slightly from below, only 420 pixels WIDE total. No halo or glow beyond its silhouette. Top-right (centre1152,256): side-view Alpine Simmental cow grazing, head lowered, cream with MUTED red-brown patches, leather collar with NO BELL, only 380 pixels WIDE total, standing on nothing. Bottom-left (centre384,768): SAME individual cow floating, calm, legs dangling softly, slight tilt, tuft of grass in mouth, leather collar NO BELL, only 360 pixels WIDE total. Bottom-right (centre1152,768): SMALL brass cow bell on leather strap lying on a LITTLE tuft of alpine grass, only 140 pixels WIDE TOTAL including grass.
Do NOT enlarge the pieces to fill the cells: substantial empty background around all sprites, even the saucer. No beam, no grazing ground patch, no bell on cows. No reference fence/bucket. Soft polished painterly forms, top-right daylight. No grid lines. Background exactly one uniform RGB255,0,255 color, no noisy near-magenta. Correct relative scale: bell/strap/grass is one-third the saucer width.
```

## Night

#### ufo-night — try 1

Inputs in order: `art/about/raw/ufo-day.png`, `art/about/raw/camp-frame-night.png`, `art/scene/style/frames/style-hero-night.png`.

Tool output: `/Users/teo/.codex/generated_images/01a174c4-444e-7f50-9574-22800b232f62/exec-3b6e1d61-3e54-4ccc-8e5a-7da8bf659915.png`.

Assessment: Four cool moonlit sprites, orange running lights stay bright, no added scenery. Near-day shapes visually. **Not selected.**

Empty-corner check: 145 colors, 0/40000 exact magenta pixels. Day/night silhouette IoU 97.523%; mean top-contour delta 0.861 px, maximum 24 px.

```text
Use case: lighting-weather. Exactly 1536 × 1024 pixels.
Input 1 is the EDIT TARGET, the new selected DAY asset. Input 2 camp-frame-night.png is the approved NIGHT LIGHTING reference only. Input 3 style-hero-night.png is supporting NIGHT LIGHTING reference only; do not add its scenery.
Image edit of the first image. Keep every shape, outline, size and place exactly, and the flat magenta #FF00FF untouched. Change only the time to the calm moonlit night of the second image: the moon high at the TOP RIGHT, everything cool and moonlit, lit edges silver-blue, shadows deep blue, the snow pale blue. On the hut, the small window glows a soft warm lamplight; on the saucer, its small orange running lights stay bright; nothing else is warm. No glow outside those, no stars, no sky, no purple or magenta tints.
The moon is off-canvas, do not paint a moon. No new objects, scenery, text, logos, border or watermark. Do not add the reference hut into a shelf-only asset, stones sheet or UFO sheet. Preserve every separate component and every empty cell. Background is a protected uniform opaque digital RGB255,0,255 color field, no noise or texture; never dim it for night. This is a lighting-only edit: no camera, cropping, scaling, shifts, reshaping, pose changes or repainting of detail. The output must overlay the day at exactly the same pixel coordinates.
Asset-specific: all four pieces in their original cells. Cows' cream and muted red-brown patches are cool moonlit, not warm. Cow poses unchanged. Bell and grass also cool; no warmth except the small orange saucer running lights. No beam; no external halo or glow on magenta. No cow collar bells.
```

#### ufo-night — try 2

Inputs in order: `art/about/raw/ufo-day.png`, `art/about/raw/camp-frame-night.png`, `art/scene/style/frames/style-hero-night.png`.

Tool output: `/Users/teo/.codex/generated_images/01a174c4-444e-7f50-9574-22800b232f62/exec-45e53f52-a19f-4e96-bf9c-b2525aec5b0a.png`.

Assessment: Cool four-piece sheet, slightly brighter saucer underside, no exact background fix. **Not selected.**

Empty-corner check: 201 colors, 0/40000 exact magenta pixels. Day/night silhouette IoU 98.200%; mean top-contour delta 0.534 px, maximum 95 px.

```text
Use case: lighting-weather. Exactly 1536 × 1024 pixels.
Input 1 is the EDIT TARGET, the new selected DAY asset. Input 2 camp-frame-night.png is the approved NIGHT LIGHTING reference only. Input 3 style-hero-night.png is supporting NIGHT LIGHTING reference only; do not add its scenery.
Image edit of the first image. Keep every shape, outline, size and place exactly, and the flat magenta #FF00FF untouched. Change only the time to the calm moonlit night of the second image: the moon high at the TOP RIGHT, everything cool and moonlit, lit edges silver-blue, shadows deep blue, the snow pale blue. On the hut, the small window glows a soft warm lamplight; on the saucer, its small orange running lights stay bright; nothing else is warm. No glow outside those, no stars, no sky, no purple or magenta tints.
The moon is off-canvas, do not paint a moon. No new objects, scenery, text, logos, border or watermark. Do not add the reference hut into a shelf-only asset, stones sheet or UFO sheet. Preserve every separate component and every empty cell. Background is a protected uniform opaque digital RGB255,0,255 color field, no noise or texture; never dim it for night. This is a lighting-only edit: no camera, cropping, scaling, shifts, reshaping, pose changes or repainting of detail. The output must overlay the day at exactly the same pixel coordinates.
Asset-specific: all four pieces in their original cells. Cows' cream and muted red-brown patches are cool moonlit, not warm. Cow poses unchanged. Bell and grass also cool; no warmth except the small orange saucer running lights. No beam; no external halo or glow on magenta. No cow collar bells.
Retry correction: treat this strictly as a recoloring of the existing day pixels, never redraw. Preserve exact outlines, including tiny grass tips, stone edges, cow tails, horns, feet, straps and flowers. Keep all interior boundaries in place. All empty background pixels must be a single absolutely uniform RGB(255,0,255), #FF00FF, with zero texture, noise, gradient or color drift. Do not render the background as a painted surface. Keep the calm deep-blue approved night lighting, not overbright white rim light. No halo or cast shadow on the background.
```

#### ufo-night — try 3 (selected)

Inputs in order: `art/about/raw/ufo-day.png`, `art/about/raw/camp-frame-night.png`, `art/scene/style/frames/style-hero-night.png`.

Tool output: `/Users/teo/.codex/generated_images/01a174c4-444e-7f50-9574-22800b232f62/exec-c78613b5-1bd2-452d-9393-99131d3bcdcb.png`.

Assessment: Cool four-piece night sheet; orange lights retained; no new scenery. Compare geometry. **Selected.**

Empty-corner check: 172 colors, 0/40000 exact magenta pixels. Day/night silhouette IoU 98.405%; mean top-contour delta 0.438 px, maximum 6 px.

```text
Use case: lighting-weather. Exactly 1536 × 1024 pixels.
Input 1 is the EDIT TARGET, the new selected DAY asset. Input 2 camp-frame-night.png is the approved NIGHT LIGHTING reference only. Input 3 style-hero-night.png is supporting NIGHT LIGHTING reference only; do not add its scenery.
Image edit of the first image. Keep every shape, outline, size and place exactly, and the flat magenta #FF00FF untouched. Change only the time to the calm moonlit night of the second image: the moon high at the TOP RIGHT, everything cool and moonlit, lit edges silver-blue, shadows deep blue, the snow pale blue. On the hut, the small window glows a soft warm lamplight; on the saucer, its small orange running lights stay bright; nothing else is warm. No glow outside those, no stars, no sky, no purple or magenta tints.
The moon is off-canvas, do not paint a moon. No new objects, scenery, text, logos, border or watermark. Do not add the reference hut into a shelf-only asset, stones sheet or UFO sheet. Preserve every separate component and every empty cell. Background is a protected uniform opaque digital RGB255,0,255 color field, no noise or texture; never dim it for night. This is a lighting-only edit: no camera, cropping, scaling, shifts, reshaping, pose changes or repainting of detail. The output must overlay the day at exactly the same pixel coordinates.
Asset-specific: all four pieces in their original cells. Cows' cream and muted red-brown patches are cool moonlit, not warm. Cow poses unchanged. Bell and grass also cool; no warmth except the small orange saucer running lights. No beam; no external halo or glow on magenta. No cow collar bells.
Retry correction: treat this strictly as a recoloring of the existing day pixels, never redraw. Preserve exact outlines, including tiny grass tips, stone edges, cow tails, horns, feet, straps and flowers. Keep all interior boundaries in place. All empty background pixels must be a single absolutely uniform RGB(255,0,255), #FF00FF, with zero texture, noise, gradient or color drift. Do not render the background as a painted surface. Keep the calm deep-blue approved night lighting, not overbright white rim light. No halo or cast shadow on the background.
Final precision correction: protect the entire magenta field as a single flat #FF00FF digital color, every empty pixel equal RGB255,0,255, with no texture or near-magenta speckle. Keep Image 1's precise geometry without any re-interpretation. Do not alter its edge positions, fine protrusions, internal joints, flowers or material boundaries. Only recolor existing surfaces with the approved cool moonlight; keep details soft, no new heavy texture, no added bright rim halos. Exact day/night overlay alignment is the priority.
```
