# C5 — The view back

## Deliverable

- Image: [raw/concepts/c5-view-back.png](raw/concepts/c5-view-back.png)
- Tool: built-in image_gen, with four local visual references.
- Output: 1536 × 1024 PNG, copied directly from the selected tool output. No resizing or other post-processing.
- Two tries; try 2 selected. No code, config, package, or commits changed. Other painters' files were left untouched.

## Inputs

All four images were inspected and supplied as reference images, not edit targets:

1. `art/scene/style/frames/style-hero-day.png` — overall painted look, alpine palette, and world.
2. `art/scene/style/frames/style-end-deepsea-day.png` — high snowy end, rock, and snow.
3. `art/scene/style/frames/style-camp-geekbot-day.png` — canvas tents, orange flags, ridge footpath.
4. `art/about/raw/options/a-afternoon-day.png` — summit stone hut roof and meadow; animal explicitly excluded.

## Tries

### Try 1

Generated source: `/Users/teo/.codex/generated_images/01a177d9-66c9-7bb3-9423-c93e4b0ee985/exec-1d151579-3d4d-4df3-b659-a2e15d75136b.png`

Five orange-flagged camps, snowy foreground, green descent, sun at upper right, village and lake all present. No visible people, animals, lettering, logos, borders, or watermark. Rejected for composition: the village/lake sat midway down the right side instead of at the very bottom right, and the diminishing camp scale was less consistent.

Exact prompt:

```text
Use case: illustration-story.
Asset: one /about key frame for theodamia.dev, "The view back". One complete painting edge to edge, exactly 1536 x 1024 pixels (3:2 landscape).

Reference images, in order: (1) style-hero-day.png: overall soft polished storybook painting style, alpine palette and world; (2) style-end-deepsea-day.png: high snowy end of the climb and snowy rocks; (3) style-camp-geekbot-day.png: small canvas tents with orange flags and winding ridge footpath; (4) a-afternoon-day.png: summit stone hut's slate roof and meadow. These are visual references only; create the NEW downward-looking composition below. Do not include the cow or any animals from the hut reference.

Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail where the eye goes, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.

Looking DOWN from just below the summit, over the whole route climbed: in the near foreground at the top-left edge, snowy rock and the corner of the summit stone hut's roof; from there a long ridge falls away toward the lower right in steps, with a winding footpath and, at intervals down it, five small camps (small canvas tents, each with a little orange flag), each smaller with distance; the ridge goes down through rock and snow into green alpine meadows and pine woods, and at the very bottom right, far below, a small village with stone houses and red roofs in a green valley beside a lake, where the climb began. Clear afternoon, the sun at the TOP RIGHT, soft haze with distance, a few clouds drifting below the viewer. The feeling of looking back over a long way come.

Composition priority: an unmistakable steep downward view from the summit; the hut roof is a cropped close foreground anchor at the upper left, and the continuous descending path visually connects all FIVE camp stops to the tiny village and lake at bottom right. Keep the route readable through the thin drifting clouds. The world gets smaller as the route descends away. Preserve a little sky at the top right for the sun.

Nothing else: no people, no animals, no text, letters, numbers, logos, borders or watermark.
```

### Try 2 — selected

Generated source: `/Users/teo/.codex/generated_images/01a177d9-66c9-7bb3-9423-c93e4b0ee985/exec-10739a7e-ec90-4059-9525-b54d43a61b4b.png`

Fresh generation using the same four references, with a targeted composition refinement. Five camp/flag pairs descend toward the village and lake at bottom right. The snowy hut and rocks establish the high foreground, and the route transitions into meadow and pine woods. Sun remains at upper right, with clouds below the viewer. No visible people, animals, text, letters, numbers, logos, borders, or watermark. Native dimensions verified as 1536 × 1024; the final file is an unmodified copy.

Exact prompt:

```text
Use case: illustration-story.
Asset: one /about key frame for theodamia.dev, "The view back". One complete painting edge to edge, exactly 1536 x 1024 pixels (3:2 landscape).

Reference images, in order: (1) style-hero-day.png: overall soft polished storybook painting style, alpine palette and world; (2) style-end-deepsea-day.png: high snowy end of the climb and snowy rocks; (3) style-camp-geekbot-day.png: small canvas tents with orange flags and winding ridge footpath; (4) a-afternoon-day.png: summit stone hut's slate roof and meadow. These are visual references only; create the NEW downward-looking composition below. Do not include the cow or any animals from the hut reference.

Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork, delicate detail where the eye goes, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.

Looking DOWN from just below the summit, over the whole route climbed: in the near foreground at the top-left edge, snowy rock and the corner of the summit stone hut's roof; from there a long ridge falls away toward the lower right in steps, with a winding footpath and, at intervals down it, five small camps (small canvas tents, each with a little orange flag), each smaller with distance; the ridge goes down through rock and snow into green alpine meadows and pine woods, and at the very bottom right, far below, a small village with stone houses and red roofs in a green valley beside a lake, where the climb began. Clear afternoon, the sun at the TOP RIGHT, soft haze with distance, a few clouds drifting below the viewer. The feeling of looking back over a long way come.

Composition priority: an unmistakable steep downward view from the summit; the hut roof is a cropped close foreground anchor at the upper left, and the continuous descending path visually connects all FIVE camp stops to the tiny village and lake at bottom right. Keep the route readable through the thin drifting clouds. The world gets smaller as the route descends away. Preserve a little sky at the top right for the sun.

Nothing else: no people, no animals, no text, letters, numbers, logos, borders or watermark.

Composition refinement for this fresh attempt: the valley village and adjacent lake must sit at the VERY BOTTOM RIGHT corner, around 90% across and 90% down the canvas, visibly much lower than all five camps. The descending ridge and footpath lead diagonally from the cropped summit hut roof at TOP LEFT, through the five camps in order toward that bottom-right destination. The FIVE tent/flag pairs progressively diminish, from largest nearest the hut through medium to a tiny last pair above the village. Use natural curved switchbacks but make the main line of descent legible at a glance. Avoid putting the lake and village halfway up the right edge. Keep the hut as a roof corner at the top-left edge, rather than a large hut wall occupying the left side. Preserve the soft polished painterly style of the original reference images, with quiet simplified terrain away from the path.
```

## Assessment

The selected frame sells looking back over a long climb well: the snowy summit foreground, repeated camps, and low lakeside village communicate the whole journey at a glance. The bottom-right destination is much clearer than in try 1. Limitations: foreground rock detail is a little busier and crisper than the quietest reference passages; more hut wall is visible than the requested roof corner; the camps are still prominent rather than vanishing into haze. This is a static key frame for the camera-tilt idea, not evidence of an implemented scroll effect.
