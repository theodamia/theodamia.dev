# The paintings behind /cv: the brief

The brief Codex painted the grove and meadow from (2026-10-25), kept as it was sent. The record of tries, and what processing does to the result, is in `CV-README.md` ("Grove and meadow").

You are making **artwork only**. Do not change any code, config or package, and do not commit. Write only:

- `art/cv/raw/grove-{summer,spring,autumn,winter}-{day,night}.png` (8 files)
- `art/cv/raw/meadow-{summer,spring,autumn,winter}-{day,night}.png` (8 files)
- append a "Grove and meadow" section to `art/cv/CV-README.md` (keep everything there).

Do NOT touch `art/cv/raw/larch-*.png` or `art/cv/raw/v1/`.

## What this is and why

The /cv page is a calm journal log of the owner's jobs. Behind the page, a painted landscape fills the screen while the year turns as the reader scrolls: spring, summer, autumn, winter, by day and by moonlit night. Until now the landscape was ONE larch on a small knoll; the owner finds a single tree "too singular, out of place". The new landscape:

- **a meadow across the whole bottom of the screen**, edge to edge, at any screen width;
- **on the right, the edge of a small larch wood**: a few European larches of different heights, the nearest partly cut off by the right edge;
- the left half is calm open meadow only, because the text of the page sits over that side.

It is built from two paintings per season and time, composited in code:

1. **grove**: the meadow plus the larches and the fence post, shown at the right of the screen;
2. **meadow**: the same meadow alone, with NO trees, that repeats sideways to carry the ground to the left edge of any screen.

Both are landscape **1536 × 1024**, on flat magenta, displayed at the same scale, so the meadow in both must be the same height and look.

Keep the design and tone exactly as before: the larch is the approved one in `art/cv/raw/larch-summer-day.png` (airy, open tiers, gently drooping branchlets, trunk visible through the crown); same soft polished painterly rendering, same palettes, light from the TOP RIGHT.

## The shared rules (every painting)

```
Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; the meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns, with only a few grass-blade accents (NOT a field of individual blades); the larches are painted exactly like the larch in the reference painting: true European larches, a straight slender trunk visible through an open, airy, slightly irregular narrow cone, loose horizontal branch tiers with clear gaps of sky between them, branch tips and side branchlets drooping gently, needles as soft feathery see-through tufts. Calm and readable: detail on the trees, quiet everywhere else. No outlines, no line art, no flat vector facets, no photorealism, no grain, no noise.
Light: the sun (or the moon at night) is high at the TOP RIGHT; every form is lit from the upper right and core shadows fall lower left in cool blue-green or blue-grey. No golden-hour light and no amber cast in the light itself.
Cut-out rules: everything that is not the meadow, the larches and the post is pure flat magenta #FF00FF: no sky, no gradient, no clouds, no distant mountains, no mist, no glow, no halo, no falling leaves, petals or snowflakes in the air (weather is added in code). Never tint, darken or blend the magenta, and never let pink or purple reflect into the trees, the grass tips or the snow. The silhouette against magenta is crisp and clean.
No text, letters, numbers, logos, borders or watermark.
```

## The composition

**The meadow (both paintings, identical in height and look):** fills the bottom of the canvas and runs solidly off the left, right and bottom edges. Its top edge is a soft, gently rolling grass line at about **y = 700 at the left edge and y = 700 at the right edge** (the ground is about the bottom 30% of the canvas), with only gentle undulation in between (never a hill, never a cliff). Smooth painted grass masses, a few small flowers, nothing tall on its top edge.

**grove (1536 × 1024):** the meadow as above, rising very slightly (to about y = 650) under the trees on the right. On the RIGHT HALF only, the edge of a small larch wood seen from the meadow: an irregular natural CLUSTER, not a row.

- **The wood runs off the right edge:** the biggest larch stands at the right edge, its trunk at about x = 1500, so only its left half is in the canvas (its trunk and right side are cut off by the edge), its top above the top edge of the canvas.
- **A close pair in front of it:** a second tall larch at about x = 1330 (top about 8% from the top edge) and, overlapping its lower branches, a smaller one slightly in front at about x = 1250 (top about 30% from the top edge). Their crowns interlock; you see the branches of one through the gaps of the other.
- **A gap of open meadow, then one young larch on its own** at about x = 960, small and slender (top about 50% from the top edge), slightly leaning.
- The weathered wooden fence post (#9b7350) of the reference at about x = 780, standing in the meadow, with a short slack wire running from it toward the young larch.
- Spacing is uneven, heights do not step down evenly, and the trunk bases are not all on one line (the pair stands a little further back, so their bases are a little higher). Each tree has its own shape: different tier spacing, a missing branch here, a longer limb there.

**Not this:** four trees in a row, evenly spaced, stepping down in size like a staircase; trees that are copies of each other; dense, dark, regular spruce cones. (A first try did exactly that and was rejected: `art/cv/raw/rejected/grove-summer-day-row.png`. Do not use it as an input.)

**The larches must be as airy as the reference larch:** fewer, smaller tufts; much more magenta visible through every crown; the trunk visible from the ground to the top; branchlets hanging down from the limbs. At page size the trees must read as European larches, not spruces or firs.

Everything left of x = 700 is open meadow only (nothing standing on it).

**meadow (1536 × 1024):** the same meadow as the grove's (same colours, same grass, same top edge height), with no trees, no post, no wire, no rocks, nothing distinctive that would show when it repeats. It must **tile horizontally**: the left and right edges continue into each other seamlessly (same top-edge height, same colours and light at both edges). A few small flowers, evenly spread.

## Order of work (write each file as soon as it is chosen)

1. **`grove-summer-day.png`** (the base; paint from scratch with the image tool at 1536 × 1024; look at the result at 500 px wide before keeping it: a row or a staircase of trees, or spruce-like crowns, is a fail). Inputs, in this order: `art/cv/raw/larch-summer-day.png` (the approved larch, post and meadow: paint every larch like this one), `art/scene/style/frames/style-hero-day.png`, `art/scene/style/frames/style-materials.png`, `art/scene/flats/raw/village-day.png` (the meadow's smooth grass and colours).
   ```
   <the shared rules> <the composition: grove> High summer: the larches in soft fresh mid-green needles (#6f9a58, lit tips #a6c27a, shade #3f6650); the meadow lush (lit #9cab62, crowns #c4c47c, shade #4c6e5c) with a few small white and yellow flowers.
   ```
2. **`meadow-summer-day.png`**: an image edit of your `grove-summer-day.png` (inputs: it, then `art/scene/flats/raw/village-day.png`, then `art/scene/style/frames/style-materials.png`):
   ```
   Image edit. Keep the meadow exactly as it is (its colours, its grass, the height of its top edge, the light) and the flat magenta #FF00FF. Remove the larches, the fence post and the wire completely and continue the open meadow across the whole width in their place, its top edge at the same height as on the left (y about 700) across the whole canvas, gently rolling. Make it tile horizontally: the left and right edges must continue into each other seamlessly. Nothing distinctive: no rocks, no posts, no trees; a few small flowers evenly spread.
   ```
3. **Spring, autumn, winter days.** `grove-<season>-day.png`: an image edit of your `grove-summer-day.png` (inputs: it, then `art/cv/raw/larch-<season>-day.png` for that season's approved look, then `art/scene/style/frames/style-materials.png`). `meadow-<season>-day.png`: an image edit of your `meadow-summer-day.png` (inputs: it, then your new `grove-<season>-day.png` so the meadow matches exactly, then `art/scene/style/frames/style-materials.png`).

   ```
   Image edit of the first image. Keep exactly: every shape, size and place (the meadow's top edge, every larch's trunk and branches, the post, the wire), the canvas and the flat magenta #FF00FF. Change only the season to match the second image: <SEASON>. Same light from the TOP RIGHT, same rendering.
   ```

   - spring: `early spring: the larches' needles bright fresh lime-green new tufts (#b5cf7a, lit #d6e49a), small and sparse so the drooping branch structure shows; the meadow fresh light green (#a9c36c, crowns #cfe08a, shade #5d7d5c) with small purple and white crocuses`
   - autumn: `autumn: the larches' tufts the famous larch gold (#e0a83a, lit #f2c75c, shade #b07a2a), still airy and see-through; the meadow tawny olive and straw (#b3a35e, crowns #cdb874, shade #6b6a4a) with a few golden needles on the grass under the trees; the gold is the needles' colour, not the light`
   - winter: `deep winter: the larches bare, only their fine drooping twigs with small buds and a few cones, soft snow along the tops of the main branches; the meadow under smooth snow (lit #f3f4f6, shade #bfceef) with soft blue shadows; the post with a snow cap and a thin line of snow on the wire`
     (For the meadow edits, leave out what does not apply: there are no trees or post in it.)

4. **Nights.** `grove-<season>-night.png`: an image edit of its new `grove-<season>-day.png` (inputs: it, then `art/cv/raw/larch-<season>-night.png` for that season's approved night look, then `art/scene/style/frames/style-hero-night.png`). `meadow-<season>-night.png`: an image edit of its new `meadow-<season>-day.png` (inputs: it, then your new `grove-<season>-night.png` so the meadow matches, then `art/scene/style/frames/style-hero-night.png`).
   ```
   Image edit of the first image. Keep every shape, outline, size and place exactly, and the flat magenta #FF00FF untouched. Change only the time to the calm moonlit night of the second image: the moon high at the TOP RIGHT, everything cool and moonlit, lit edges silver-blue, shadows deep blue, the season still readable as in the second image. No warm light, no glow, no stars, no sky, and no purple, lilac or magenta tints anywhere.
   ```

## Pixels: deliver the image tool's output

Do **not** post-process the paintings: no chroma or spill cleanup, no edge repair, no masks, no pixel restoration, no thresholding of the magenta. (Last time that cleanup made the edges hard; keying, despill and day/night outline matching are done later by our own script.) Only crop or resize if the tool returned the wrong canvas size, and say so.

## After the images

Check, and redo a failing image (up to three tries, keep the best):

- exact size 1536 × 1024; flat magenta around everything, no sky or weather;
- the larches read clearly as European larches (airy, drooping, see-through), not spruces, when the painting is shrunk to 500 px wide;
- the left half of every grove is open meadow only;
- the meadow's top edge is at about y = 700 at both edges of every meadow painting and at the left edge of every grove;
- across seasons and day/night, the grove's trees and the post are in the same places and sizes (overlay them).

Append to `art/cv/CV-README.md`: each file, inputs, the complete prompt and tries. In your final message, say honestly how larch-like the wood is, how well the meadow tiles, how well the sixteen line up, and anything off-brief.
