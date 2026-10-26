# Option B — Chapter scenes

Created 2026-10-26 with the built-in image_gen tool, using the imagegen skill. Artwork only; no code, configuration, package changes or commits.

## Deliverables

- [b-hut-day.png](raw/options/b-hut-day.png): selected hut try2.
- [b-cairn-day.png](raw/options/b-cairn-day.png): selected cairn try3; **six stones, not seven**.
- [b-pack-day.png](raw/options/b-pack-day.png): selected pack try3; **axe and a little of the map extend outside the safe right55% crop; GPS is tilted upright**.
- [b-meadow-day.png](raw/options/b-meadow-day.png): meadow try1.
- [b-hut-night.png](raw/options/b-hut-night.png): night try1, editing the selected hut day.

Every final is a native **1536 ×1024 RGB opaque PNG**, copied byte-for-byte from the selected image-tool output. No resizing, post-processing, masks, compositing, colour correction or retouching was applied to the delivered PNGs. No rejected variants were copied into this repository. All calls used `transparent_background: false` and the input paths recorded below; no model or resolution parameter is exposed in this built-in tool, so exact dimensions were requested in the prompts and checked in the PNG headers.

Only the five named b-_ PNGs and this README were written in the project. Files named a-_ and art/about/ABOUT-README.md were not touched.

## Input roles

- `art/about/raw/camp-frame-day.png`: exact hut identity, granite, alpine ground and painting style.
- `art/about/raw/cairn-day.png`: seven separate granite stone shapes/material reference; new stack composition required.
- `art/skills/raw/pack-frame-day.png`: pack identity, six gear groups and granite surface.
- `art/skills/raw/pack-open-day.png`: same open pack.
- `art/cv/raw/frame-04-day.png`: Simmental cow identity, meadow and fence post; UFO, beam and bucket excluded.
- `art/scene/style/frames/style-end-deepsea-day.png`: snowy summit, ranges, sea of clouds and polished painterly style; tent, flag and visible sun excluded.
- `art/cv/raw/grove-summer-day.png`: close foreground scale, meadow materials and brushwork; trees excluded.
- `art/about/raw/camp-frame-night.png`: cool moonlit palette and warm window, not geometry.
- `art/scene/style/frames/style-hero-night.png`: night sky, stars, top-right moon, distant blue mountains/clouds.
- Selected generated images used as edit targets are identified in each try below.

## Review

The four day scenes share pale granite, short alpine grass, flowers, snow remnants, clouds and a closely matched polished storybook finish. Upper/right surfaces are lit warmly, with cooler lower/left shadows. Ground continues off the intended edges and bottom. The distant mountains are somewhat crisper and busier than the requested quiet background, and their exact silhouette/scale varies between viewpoints.

The hut and cow read clearly in their intended edge-anchored crops. The cairn also reads clearly, with separated stones, but the seven-stone count failed in every try. The pack's six groups are separate in the complete painting: ice axe, map with compass, orange carabiners, helmet, GPS and coiled rope. The pack crop and GPS pose requirements remain unsatisfied after three tries. These are retained as the best available tool outputs, not described as full passes.

The night was checked against day with an actual 50% overlay rendered **in memory only**, at original canvas dimensions using macOS AppKit; no overlay file or other inspection image was written. A compressed in-memory preview was used for visual inspection. Main silhouettes align closely; minor brush-detail changes cannot be ruled out.

There were **10 generation/edit calls**: hut2, cairn3, pack3, meadow1, night1. Three total tries were the limit used for each failing scene. Exact visual placement and sizes below are approximate observations, not automated segmentation measurements.

## Complete prompts and generation log

The following blocks contain the entire prompt sent on every call, including fully expanded shared instructions. Input paths are listed in the same order passed to the tool. Relative paths resolve from the repository root. Generated-output paths identify the original tool outputs outside the project.

### Hut day — try 1

Inputs, in order:

- `art/about/raw/camp-frame-day.png`
- `art/scene/style/frames/style-end-deepsea-day.png`
- `art/cv/raw/grove-summer-day.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-5b5068fb-cd2b-4a37-bf83-187bace88832.png`

Assessment: Not selected. Whole hut in the right 55%, but about 360px tall, smaller than the requested 430px; doorstep also too high.

Complete prompt:

```text
Use case: illustration-story.
Asset type: a complete chapter painting for a mountain-climb portfolio /about page.
Rendering: high-end painterly digital illustration in the soft polished storybook style of the supplied style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail on the subject, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.
Canvas: exactly 1536 x 1024 pixels, landscape, one complete opaque painting edge to edge with its blue sky and distant scenery. Nothing cut out, no magenta background.
Light: a clear high-mountain afternoon, the sun high at the TOP RIGHT outside the picture, every form lit from the upper right, core shadows lower left in cool blue-grey. Do not paint the sun.
The ground: weathered pale granite, short tough alpine grass, cushions of small white and yellow alpine flowers, a few lichen-spotted boulders and patches of old snow, the same materials as the supplied hut and grove references.
Behind: the climb's great snowy summit and its lower ranges above a sea of clouds, as in the supplied snowy-mountain reference, soft with distance.
Nothing else: no people, no text, letters, numbers, logos, borders or watermark.
All four chapters are nearby places just below the same summit on the same clear afternoon. Preserve the softly polished brushwork and simple modelling of the reference paintings. Paint the foreground close and big. This is a continuous landscape, never an isolated island or cutout.

Inputs: Image 1 is the hut identity and foreground-material reference (camp-frame-day.png). Image 2 is the snowy summit, sea of clouds and painterly-style reference (style-end-deepsea-day.png); omit its tent, flag and visible sun. Image 3 is the large foreground scale, meadow materials and brushwork reference (grove-summer-day.png); omit its trees.
Composition: window anchored RIGHT; the outer right 55% (x=691 through 1535) must contain the whole main subject. The stone hut from Image 1, the SAME hut, close and big on its alpine ledge: its centre at about 72% of the width, its doorstep at about 74% of the height, about 430 px tall, whole, with nothing of the hut within 60 px of the right edge. Thick fitted granite walls, a steep dark slate roof, a squat stone chimney with NO SMOKE, a heavy wooden door, one deep-set small window with shutters. The ledge runs off the right, left and bottom edges. The summit rises behind at the right-centre, its top at about 14% of the height. The left 40% is open sky, sea of clouds and plain ledge.
```

### Hut day — try 2

Inputs, in order:

- `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-5b5068fb-cd2b-4a37-bf83-187bace88832.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-bc60bdb0-c89c-487a-abcb-aaf033b7fdfa.png`

Assessment: SELECTED as b-hut-day.png. Larger, whole hut approximately x=720..1470 and y=265..735 (about 470px tall). Strong close foreground, right-edge safety margin about 65px. Slightly larger than the requested 430px; summit peak is around y=85 rather than y=143. Doorstep is slightly higher than the requested y=758.

Complete prompt:

```text
Use case: precise-object-edit.
Edit target: the supplied hut chapter painting.
Make one composition adjustment: enlarge the SAME stone hut by about 18% so it is about 430px tall from chimney top to doorstep, keeping it whole in the right 55% of the canvas with at least 60px right margin. Place its centre at about72% width and its doorstep at about74% height (y=758). Preserve its identity: fitted granite walls, steep dark slate roof, squat stone chimney with no smoke, heavy wooden door, one deep-set shuttered window. Do not change architecture or add anything.
Keep the surrounding terrain continuous off the left, right and bottom, same granite, grass, small white and yellow alpine flowers and patches of snow. Keep the snowy summit at right-centre and the sea of clouds. Keep the left40% quiet. Preserve the high-end softly polished painterly illustration and light from high TOP RIGHT with cool blue-grey lower-left shadows. No visible sun, no people, no text, no grain, no noise. Exactly1536x1024 landscape, opaque complete scene.
```

### Cairn day — try 1

Inputs, in order:

- `art/about/raw/cairn-day.png`
- `art/scene/style/frames/style-end-deepsea-day.png`
- `art/cv/raw/grove-summer-day.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-afbb7a0b-77d9-4dcb-9437-3b66d28b5216.png`

Assessment: Not selected. Six stones, not seven, and the stack is about 570px tall. Whole and well inside the left 55%; slabs separate clearly.

Complete prompt:

```text
Use case: illustration-story.
Asset type: a complete chapter painting for a mountain-climb portfolio /about page.
Rendering: high-end painterly digital illustration in the soft polished storybook style of the supplied style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail on the subject, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.
Canvas: exactly 1536 x 1024 pixels, landscape, one complete opaque painting edge to edge with its blue sky and distant scenery. Nothing cut out, no magenta background.
Light: a clear high-mountain afternoon, the sun high at the TOP RIGHT outside the picture, every form lit from the upper right, core shadows lower left in cool blue-grey. Do not paint the sun.
The ground: weathered pale granite, short tough alpine grass, cushions of small white and yellow alpine flowers, a few lichen-spotted boulders and patches of old snow, the same materials as the supplied hut and grove references.
Behind: the climb's great snowy summit and its lower ranges above a sea of clouds, as in the supplied snowy-mountain reference, soft with distance.
Nothing else: no people, no text, letters, numbers, logos, borders or watermark.
All four chapters are nearby places just below the same summit on the same clear afternoon. Preserve the softly polished brushwork and simple modelling of the reference paintings. Paint the foreground close and big. This is a continuous landscape, never an isolated island or cutout.

Inputs: Image 1 is the seven separate granite stones as a material and shape reference (cairn-day.png): stack these in the new scene, do not copy the reference's scattered layout or magenta. Image 2 is the snowy summit, sea of clouds and painterly-style reference (style-end-deepsea-day.png); omit its tent, flag and visible sun. Image 3 is the close foreground scale and alpine meadow brushwork reference (grove-summer-day.png); omit its trees.
Composition: window anchored LEFT; the outer left 55% (x=0 through 844) must contain the whole main subject. A tall trail cairn, close and big, on a rocky ridge just below the summit: EXACTLY SEVEN stacked stones of the pale lichen-spotted granite in Image 1, from a wide flat base slab up through five smaller slabs to ONE small upright capstone. Count from bottom to top: 1 wide base slab, 2 smaller slab, 3 smaller slab, 4 smaller slab, 5 smaller slab, 6 smaller slab, 7 small upright capstone. Each stone clearly separate and resting on the one below, slightly offset like a hand-built stack, visible seams and distinct silhouettes, no fused stones, no floating stones. The whole cairn about 470 px tall, its base centre at about 28% of the width and 78% of the height, whole with nothing within 60 px of the left edge or the top. A faint footpath passes beside it and winds away to the right. The ridge runs off the left, right and bottom edges. The summit rises behind at the left-centre. The right 40% is open sky and sea of clouds.
```

### Cairn day — try 2

Inputs, in order:

- `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-afbb7a0b-77d9-4dcb-9437-3b66d28b5216.png`
- `art/about/raw/cairn-day.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-41254262-7c57-46b7-9527-e834aaf09b8e.png`

Assessment: Not selected. The requested correction did not add a stone: still six. Similar oversized composition.

Complete prompt:

```text
Use case: precise-object-edit.
Edit target: Image 1 is the first cairn chapter painting. Image 2 is the reference for the seven individual pale lichen-spotted granite stones.
Correct ONLY the cairn: it currently contains six stones and needs EXACTLY SEVEN. Rebuild the stack within x=220..640, y=330..800, with its base centre at x=430,y=800, total height about 470 pixels. Keep the perspective, material, polished soft painterly brushwork and upper-right sunlight. The ordered stack MUST be: one wide flat base slab, FIVE successively smaller separate flat slabs, and ONE small upright capstone. That is SIX flat stones below the upright capstone, SEVEN total. Count seven distinct silhouettes with visible contact seams. No floating pieces or fused stones. Slight hand-built offsets.
Keep the landscape, sky, clouds, summit, path, all ground and the lighting unchanged outside the cairn. Continuous edge-to-edge painting, exactly 1536x1024, opaque. All of the cairn remains within the outer LEFT 55%, at least 60 pixels from the left edge. No text, numbers, labels, people or outlines.
```

### Cairn day — try 3

Inputs, in order:

- `art/about/raw/cairn-day.png`
- `art/scene/style/frames/style-end-deepsea-day.png`
- `art/cv/raw/grove-summer-day.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-e13d0e3b-e48f-4fc9-9bd2-0336dc97107b.png`

Assessment: SELECTED as b-cairn-day.png. Best scale, about 490px tall and entirely in the left 55%. STILL SIX stones: five flat slabs plus one upright capstone. The exact seven-stone requirement FAILED after three total tries. Stones have clear seams and contact; no floating pieces. Stack is slightly right of its requested centre (about x=470 rather than430), with base around y=745 rather than800. Trail and continuous ridge read well.

Complete prompt:

```text
Use case: illustration-story.
Asset type: a complete chapter painting for a mountain-climb portfolio /about page.
Rendering: high-end painterly digital illustration in the soft polished storybook style of the supplied style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail on the subject, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.
Canvas: exactly 1536 x 1024 pixels, landscape, one complete opaque painting edge to edge with its blue sky and distant scenery. Nothing cut out, no magenta background.
Light: a clear high-mountain afternoon, the sun high at the TOP RIGHT outside the picture, every form lit from the upper right, core shadows lower left in cool blue-grey. Do not paint the sun.
The ground: weathered pale granite, short tough alpine grass, cushions of small white and yellow alpine flowers, a few lichen-spotted boulders and patches of old snow, the same materials as the supplied hut and grove references.
Behind: the climb's great snowy summit and its lower ranges above a sea of clouds, as in the supplied snowy-mountain reference, soft with distance.
Nothing else: no people, no text, letters, numbers, logos, borders or watermark.
All four chapters are nearby places just below the same summit on the same clear afternoon. Preserve the softly polished brushwork and simple modelling of the reference paintings. Paint the foreground close and big. This is a continuous landscape, never an isolated island or cutout.

Inputs: Image 1 is the seven separate granite stones as a material and shape reference (cairn-day.png): stack these in the new scene, do not copy the reference's scattered layout or magenta. Image 2 is the snowy summit, sea of clouds and painterly-style reference (style-end-deepsea-day.png); omit its tent, flag and visible sun. Image 3 is the close foreground scale and alpine meadow brushwork reference (grove-summer-day.png); omit its trees.
Composition: window anchored LEFT; the outer left 55% (x=0 through 844) must contain the whole main subject. A tall trail cairn, close and big, on a rocky ridge just below the summit: EXACTLY SEVEN stacked stones of the pale lichen-spotted granite in Image 1, from a wide flat base slab up through five smaller slabs to ONE small upright capstone. Count from bottom to top: 1 wide base slab, 2 smaller slab, 3 smaller slab, 4 smaller slab, 5 smaller slab, 6 smaller slab, 7 small upright capstone. Each stone clearly separate and resting on the one below, slightly offset like a hand-built stack, visible seams and distinct silhouettes, no fused stones, no floating stones. The whole cairn about 470 px tall, its base centre at about 28% of the width and 78% of the height, whole with nothing within 60 px of the left edge or the top. A faint footpath passes beside it and winds away to the right. The ridge runs off the left, right and bottom edges. The summit rises behind at the left-centre. The right 40% is open sky and sea of clouds.

Final composition priority: paint a NEW composition from these references. There MUST be seven rocks, not six. The top capstone is SHORT, only 65px high, NOT a giant egg-shaped boulder. Under it, paint SIX clearly separate horizontal granite slabs, each one with its own rounded outline and contact shadow. Count the stack before finishing. The base occupies roughly y=730..800; next slab y=650..725; next slab y=575..645; next slab y=510..570; next slab y=450..505; next slab y=400..445; upright capstone y=330..395. Together these are exactly seven separate stones from y=330 to800. The cairn is approximately x=230..630 and centred at x=430. Do not print these coordinates or counts into the painting.
```

### Pack day — try 1

Inputs, in order:

- `art/skills/raw/pack-frame-day.png`
- `art/skills/raw/pack-open-day.png`
- `art/scene/style/frames/style-end-deepsea-day.png`
- `art/cv/raw/grove-summer-day.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-530efd70-e6ac-4b05-b44d-edfb826c60fa.png`

Assessment: Not selected. Six identifiable gear groups with rock gaps; pack oversized, ice axe extends left of x=691 and rope nearly reaches the right edge. GPS tilted upright rather than lying flat.

Complete prompt:

```text
Use case: illustration-story.
Asset type: a complete chapter painting for a mountain-climb portfolio /about page.
Rendering: high-end painterly digital illustration in the soft polished storybook style of the supplied style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail on the subject, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.
Canvas: exactly 1536 x 1024 pixels, landscape, one complete opaque painting edge to edge with its blue sky and distant scenery. Nothing cut out, no magenta background.
Light: a clear high-mountain afternoon, the sun high at the TOP RIGHT outside the picture, every form lit from the upper right, core shadows lower left in cool blue-grey. Do not paint the sun.
The ground: weathered pale granite, short tough alpine grass, cushions of small white and yellow alpine flowers, a few lichen-spotted boulders and patches of old snow, the same materials as the supplied hut and grove references.
Behind: the climb's great snowy summit and its lower ranges above a sea of clouds, as in the supplied snowy-mountain reference, soft with distance.
Nothing else: no people, no text, letters, numbers, logos, borders or watermark.
All four chapters are nearby places just below the same summit on the same clear afternoon. Preserve the softly polished brushwork and simple modelling of the reference paintings. Paint the foreground close and big. This is a continuous landscape, never an isolated island or cutout.

Inputs: Image 1 is the identity reference for the SAME pack, six gear groups and granite rock (pack-frame-day.png). Image 2 is the SAME open pack identity reference (pack-open-day.png). Image 3 is the snowy summit, sea of clouds and painterly-style reference (style-end-deepsea-day.png); omit its tent, flag and visible sun. Image 4 is the close foreground scale and alpine meadow brushwork reference (grove-summer-day.png); omit its trees.
Composition: window anchored RIGHT; the outer right 55% (x=691 through 1535) must contain the whole pack AND all six gear groups. A wide flat-topped granite boulder beside the trail, close and big, its top at about 66% of the height, running off the right and bottom edges. On it, at about 70% of the width, stands the open hiking pack from Images 1 and 2 (slate-blue with tan and orange straps, its lid thrown back, the mouth open), about 300 px tall. Laid out around it on the flat top of the rock, each clearly separate with visible bare rock showing between them, NEVER touching each other or the pack: (1) an ice axe, (2) a folded paper map with a brass compass ON the map, (3) a small cluster of orange carabiners, (4) a climbing helmet, (5) a handheld GPS LYING FLAT, and (6) a coiled blue rope. Six identifiable gear groups, each with breathing room, no extra gear. Use a slightly elevated view of the broad rock top so all six groups can be clearly seen below and beside the pack without overlap, and stay at least 60px inside the right edge. The summit rises behind at the right-centre. The left 40% is open sky, sea of clouds and the trail.
```

### Pack day — try 2

Inputs, in order:

- `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-530efd70-e6ac-4b05-b44d-edfb826c60fa.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-86f04f85-ba9e-48db-ab1b-bdca55ae65e2.png`

Assessment: Not selected. The edit preserved separation, but did not sufficiently fix the axe position, pack scale or GPS pose; rope remains too close to the right edge.

Complete prompt:

```text
Use case: precise-object-edit.
Image 1 is the edit target: the pack chapter painting. Recompose ONLY the foreground boulder, pack and six gear groups so every item fits whole inside the RIGHT 55% of the image, x=691 through1535. Preserve the identity of the same slate-blue pack with tan/orange straps, all six gear identities, the summit, sky, sea of clouds, left trail, soft polished painterly brushwork, materials and TOP RIGHT afternoon sunlight.
Make the pack about 300px tall, bounding box approximately x=1000..1220, y=365..675. Lid thrown back, mouth open as before.
The broad flat-topped boulder has its back top edge around y=670 and fills the lower right, running off the right and bottom canvas edges. View its surface from slightly above to display the equipment clearly.
Crucial: the six gear groups must ALL be whole inside x=720..1460, with bare rock visible BETWEEN every pair and between them and the pack. Arrange:
1. The entire ice axe diagonally at x=735..960,y=710..825. It must no longer reach into the left 45%.
2. The folded map with brass compass on it at x=760..950,y=855..960.
3. Orange carabiner cluster at x=990..1110,y=820..900.
4. Helmet at x=1150..1300,y=865..970.
5. Handheld GPS LYING FLAT on the rock at x=1240..1320,y=710..785.
6. Coiled blue rope at x=1350..1460,y=775..870. Leave at least 75 pixels of clear margin from the canvas right edge. No rope clipping.
One pack plus exactly these six separate gear groups, no additions. No touching or overlapping gear, except the compass intentionally sits on its map. This is a continuous landscape, no isolated rock island.
Exact canvas1536x1024. No people, visible sun, text, letters, numbers, logos, watermark, outlines, grain or noise.
```

### Pack day — try 3

Inputs, in order:

- `art/skills/raw/pack-frame-day.png`
- `art/skills/raw/pack-open-day.png`
- `art/scene/style/frames/style-end-deepsea-day.png`
- `art/cv/raw/grove-summer-day.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-635faf61-f657-4923-a9bc-9a2e554b87ed.png`

Assessment: SELECTED as b-pack-day.png. Six clearly separate gear groups, whole pack and rope; best rope margin of the three tries. STILL OFF-BRIEF: ice axe handle extends to about x=585, outside the safe right55% beginning at x=691; the map's left edge is also slightly outside that crop (about x=675). A strict right55% crop clips these. GPS still tilted upright, not flat. Pack about380px tall instead of300; boulder back top around y=580 instead of675. No object is clipped by the full canvas.

Complete prompt:

```text
Use case: illustration-story.
Asset type: a complete chapter painting for a mountain-climb portfolio /about page.
Rendering: high-end painterly digital illustration in the soft polished storybook style of the supplied style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail on the subject, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.
Canvas: exactly 1536 x 1024 pixels, landscape, one complete opaque painting edge to edge with its blue sky and distant scenery. Nothing cut out, no magenta background.
Light: a clear high-mountain afternoon, the sun high at the TOP RIGHT outside the picture, every form lit from the upper right, core shadows lower left in cool blue-grey. Do not paint the sun.
The ground: weathered pale granite, short tough alpine grass, cushions of small white and yellow alpine flowers, a few lichen-spotted boulders and patches of old snow, the same materials as the supplied hut and grove references.
Behind: the climb's great snowy summit and its lower ranges above a sea of clouds, as in the supplied snowy-mountain reference, soft with distance.
Nothing else: no people, no text, letters, numbers, logos, borders or watermark.
All four chapters are nearby places just below the same summit on the same clear afternoon. Preserve the softly polished brushwork and simple modelling of the reference paintings. Paint the foreground close and big. This is a continuous landscape, never an isolated island or cutout.

Inputs: Image 1 supplies ONLY the identity of the slate-blue/tan/orange pack, granite and six gear groups. Image 2 supplies the open pack identity. Image 3 supplies the distant snowy summit and clouds, omitting tent, flag and sun. Image 4 supplies the foreground meadow material and polished painterly style, omitting trees.
Paint a NEW composition, not the layout of Image 1. The entire pack-and-gear arrangement must fit in the outer RIGHT HALF, close to the right but with generous safe margins. No object crosses x=720 or x=1460. The left 40% shows quiet sky, sea of clouds and a path only.
A broad pale granite boulder fills the lower right corner and runs off the right and bottom edges, its back top at y=675. It has a wide flat surface seen slightly from above, with grass, alpine flowers and snow around its base. The open slate-blue hiking pack, exactly the same pack as the inputs with tan trim and orange straps, is 300px tall including its lid thrown back. Its mouth is open. It stands at x=1090,y=675 (base), with its top at y=375, centre at 71% of canvas width.
LAYOUT PRIORITY: all six gear groups sit well within the right half. Scale the objects down enough to fit, with clearly visible bare rock separating every group and the pack. The six groups are:
- An entire small ice axe lying almost HORIZONTAL across the rock at x=745..980,y=720..780, its handle does NOT extend to the left side.
- A folded paper map with its brass compass on the paper, at x=755..975,y=845..945.
- Three orange carabiners as one small cluster at x=1020..1120,y=825..890.
- A climbing helmet at x=1160..1300,y=860..965.
- A handheld GPS lying FLAT at x=1245..1330,y=715..785.
- A small neatly coiled blue rope at x=1350..1450,y=815..900, completely visible with over 85px right margin.
Exactly those six groups and one pack, no touching, no overlap except compass on map. All groups are on the boulder's flat top. Strong separate silhouettes. The snowy summit rises behind at right-centre above lower ranges and a sea of clouds, softly distant. Keep the common sun high TOP RIGHT outside the picture. Maintain the smooth modelled soft polished storybook rendering of the input paintings. Exact 1536x1024 landscape. Never paint numbers, coordinate guides, labels or text.
```

### Meadow day — try 1

Inputs, in order:

- `art/cv/raw/frame-04-day.png`
- `art/scene/style/frames/style-end-deepsea-day.png`
- `art/cv/raw/grove-summer-day.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-f091983a-dd4e-4b3e-8a6b-4d567c5f7ffd.png`

Assessment: SELECTED as b-meadow-day.png. Grazing cow about300px long, head down, grounded and whole in the left55%; no bell, UFO or bucket. Fence post also within the left55%. Upper-left and centre sky open and plain. Cow centre around x=335 (22% rather than26%); post around x=660 (43% rather than46%). The meadow slopes more steeply than the requested brow. Summit is on the far right but more prominent than a small distant peak.

Complete prompt:

```text
Use case: illustration-story.
Asset type: a complete chapter painting for a mountain-climb portfolio /about page.
Rendering: high-end painterly digital illustration in the soft polished storybook style of the supplied style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail on the subject, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.
Canvas: exactly 1536 x 1024 pixels, landscape, one complete opaque painting edge to edge with its blue sky and distant scenery. Nothing cut out, no magenta background.
Light: a clear high-mountain afternoon, the sun high at the TOP RIGHT outside the picture, every form lit from the upper right, core shadows lower left in cool blue-grey. Do not paint the sun.
The ground: weathered pale granite, short tough alpine grass, cushions of small white and yellow alpine flowers, a few lichen-spotted boulders and patches of old snow, the same materials as the supplied hut and grove references.
Behind: the climb's great snowy summit and its lower ranges above a sea of clouds, as in the supplied snowy-mountain reference, soft with distance.
Nothing else: no people, no text, letters, numbers, logos, borders or watermark.
All four chapters are nearby places just below the same summit on the same clear afternoon. Preserve the softly polished brushwork and simple modelling of the reference paintings. Paint the foreground close and big. This is a continuous landscape, never an isolated island or cutout.

Inputs: Image 1 is the cow identity, meadow and weathered fence-post reference (frame-04-day.png). Use the same cream and muted red-brown Simmental cow, but grazing on the ground; omit the UFO, its beam and lights, the floating pose and the bucket. Image 2 is the snowy summit, sea of clouds and painterly-style reference (style-end-deepsea-day.png); omit its tent, flag and visible sun. Image 3 is the close foreground alpine meadow brushwork reference (grove-summer-day.png); omit its trees.
Composition: window anchored LEFT; the outer left 55% (x=0 through 844) must contain the whole cow and the fence post. A high alpine meadow at the edge of the sea of clouds, close and big, its grassy brow at about 70% of the height, running off the left, right and bottom edges, with ONE weathered wooden fence post and a sagging wire at about 46% of the width. ONE Alpine cow (Simmental: cream with muted red-brown patches, as in Image 1), about 300 px long, grazes on the brow at about 26% of the width, seen from the side, head down to the grass, all four feet standing naturally on the meadow; no bell on her collar. Above her the sky is wide and quiet: keep the upper left and centre of the sky open and plain for a later animation, no object there. The summit rises far behind at the right, small with distance.
```

### Hut night — try 1

Inputs, in order:

- `art/about/raw/options/b-hut-day.png`
- `art/about/raw/camp-frame-night.png`
- `art/scene/style/frames/style-hero-night.png`

Original tool output: `/Users/teo/.codex/generated_images/01a176ed-5c24-7df0-917f-55033b506091/exec-6c30c456-b8b2-4092-b778-fffe08b327b6.png`

Assessment: SELECTED as b-hut-night.png. Moon high top-right, small stars, cool blue moonlight, one softly glowing warm window, dark closed door, no smoke. A50% day/night overlay inspected in memory shows close alignment of the hut outline, chimney, roof, door, summit and major rocks, without obvious doubled silhouettes. This is a visual alignment check, not a guarantee of pixel-identical geometry or brush detail.

Complete prompt:

```text
Use case: lighting-weather.
Input images: Image 1 is the EDIT TARGET, the chosen b-hut-day.png chapter painting. Image 2 (camp-frame-night.png) supplies ONLY the calm cool moonlit palette, silver-blue lighting and warm small window reference; ignore its magenta background and do not copy its geometry. Image 3 (style-hero-night.png) supplies ONLY the softly painted night sky, small stars, high top-right moon and distant blue mountain/cloud atmosphere; ignore its extra buildings, trees, tents and flags.
Image edit of the FIRST image. Keep EVERY shape, outline, size and place EXACTLY. Preserve the exact framing, hut roof and chimney silhouette, fitted wall stones, heavy wooden door, shuttered window, all terrain and flower silhouettes, all rock positions, the summit silhouette, ranges and cloud shapes. Do not move, resize, add, remove or redraw scene objects. This must overlay its day painting perfectly, with no camera movement and no composition change.
Change ONLY the time to the calm moonlit night of the second image: the moon high at the TOP RIGHT, a sky of small stars, everything cool and moonlit, lit edges silver-blue, shadows deep blue, the snow pale blue. The hut's ONE small window glows a soft warm lamplight, the ONLY warm light. The door stays dark and closed. No smoke. Keep the same upper-right lighting direction. No other warm highlights. Preserve the polished soft storybook brushwork, smooth modelled forms and delicate detail. No outlines, no grain or noise, no people, no text, letters, numbers, logos or watermark.
Exact canvas 1536x1024 pixels, complete opaque edge-to-edge painting with sky.
```
