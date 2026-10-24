# The forward climb: scene art

The climb on `/` is a stack of whole paintings, the **flats**:

- the far ranges with the cloud sea;
- the peak;
- six ridge shoulders: the trailhead village plus one per job camp, each with its camp painted in;
- a shared flag (pole and pennant).

Each flat has a day and a night painting with identical silhouettes. The page scales and moves them about a focus of expansion: see "Scene · The forward climb", "Scene · Motion" and "Scene · Production" in the design system, and the camera in `scene/camera.ts`.

## Where things are

| Path                                                                       | What                                                            | In git                                |
| -------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------- |
| `flats/guides/guide-*.png`                                                 | placement guides on magenta, 1664 × 936                         | yes                                   |
| `flats/guides/guides.json`                                                 | the units rectangle and px per unit each canvas covers          | yes                                   |
| `flats/raw/<flat>-{day,night}.png`, `flats/raw/flag-parts-{day,night}.png` | the paintings                                                   | no: **the only copies, back them up** |
| `flats/raw/v1/`                                                            | the first day set, before the camp kit                          | no                                    |
| `flats/camp-kit-day.png`                                                   | the camp kit reference sheet                                    | no                                    |
| `flats/PAINT-README.md`, `KIT-README.md`, `NIGHT-README.md`                | the exact prompts and inputs of every painting                  | yes                                   |
| `style/frames/README.md`                                                   | the style exploration that set the look (its frames stay local) | yes                                   |
| `../../public/scene/*.webp`, `../../scene/flats.json`                      | the processed flats and their manifest                          | yes                                   |

## Rebuild

`pnpm flats` runs `scripts/process-flats.mjs`:

1. Key the magenta out (median key colour, de-spill).
2. Apply the design fades: ends and feet dissolve, never a straight edge.
3. Give night paintings the day alpha, so silhouettes match.
4. Haze the far ranges toward `--color-scene-haze`.
5. Trim.
6. Encode WebP (q76, smart subsampling) at desktop size and as a phone set at most 1080 px wide.
7. Make each ridge's far version: 0.55×, softened, 38% hazed.
8. Write content-hashed files into `public/scene/` and the manifest into `scene/flats.json`.

It also writes check PNGs to `flats/check/` and prints the byte budget per theme and device.

## Painting a new piece

1. Start from a guide.
2. Ask Codex (or any image tool) for the piece on flat magenta with the three blocks below, attaching the guide, a neighbouring flat for consistency and the camp's own reference.
3. Change a camp with an image edit ("keep everything, replace only the camp"), never a repaint.
4. Make the night version as an edit of the day painting.

**STYLE**

```
Rendering: high-end painterly digital illustration in the soft polished style of the attached style frames: large simple forms modelled with smooth gradient shading and soft-edged brushwork; rocks are big smooth sculpted masses with clean soft highlights and gentle texture; meadow is smooth painted grass masses, darker in the troughs and sunlit on the crowns; conifers are painted shapes with soft lit edges. Calm and readable: detail concentrated around the camp and the trail, quiet everywhere else. Few flowers and grass-blade accents. No outlines, no line art, no flat vector facets, no low-poly, no photorealism, no grain, no noise.
Light and palette: cool, airy, sunny Alpine daylight; the sun is high at the TOP RIGHT, every form is lit from the upper right, core shadows fall lower left and are cool blue-green or blue-grey. Snow lit #f3f4f6, snow shade #bfceef. Stone lit #bcbeb2, stone shade #6387a3. Meadow lit #9cab62 with crowns to #c4c47c, meadow shade #4c6e5c. Conifers #1c4345 to #47705f. Earth path #dcc8b3. No golden hour, no orange or amber cast, no warm haze.
Cut-out rules: everything outside the subject is pure flat magenta #FF00FF: no sky, no gradient, no shadow, no mist, no glow or halo on magenta. The silhouette against magenta is crisp and clean. Where the guide's subject touches the canvas edge, the painting runs solidly off that edge (it is faded later in code; never fade it yourself).
Constraints: no text, letters, numbers, logos, UI, borders or watermark. No people or animals. No flags or flagpoles (added separately). Signposts are blank.
```

**KIT**

```
Camp kit palette (exact): canvas burnt orange #CF4318, its sunlit face #E2683A, its shaded face #A5330F; cream canvas #F1E6CF (shade #D8C9AC); wood #9B7350 (dark wood #6B4E36); openings, doorways and window glass in deep slate #2B3A48 (by day never lit, never yellow); stone #BCBEB2 lit, #6387A3 shade; rope and guy lines thin cream. Chalet walls whitewash #EFE5D2 over a stone base; the left chalet's roof burnt orange #C4572A, the right chalet's roof slate #4B5D6E.
Form: simple, chunky, readable at a small size: big clean shapes, a few deliberate details (seams, a rolled door flap, a tie, a step), no clutter, no tiny props. One small prop per camp at most. Each structure stands on its own small level patch of trodden ground with a soft contact shadow, sunk naturally into the slope.
Light and rendering: identical to the landscape paintings: soft painterly rendering with smooth gradient shading, sun high at the TOP RIGHT, sunlit faces on the right and top, cool shade on the left; no outlines, no line art, no glossy highlights.
Scale: all camps are drawn at one consistent scale. Size grows with the job: the intern cabin is small, the Lead bell tent is the widest, the DeepSea dome is compact.
No flags or flagpoles on any camp. No text, numbers, logos or signs with writing.
```

**NIGHT**

```
Image edit. Keep this painting exactly as it is: every shape, silhouette, landform, rock, tree, trail and building in the same place and size, and the flat magenta #FF00FF background untouched. Change only the light to a clear, calm moonlit Alpine night: the moon is high at the TOP RIGHT, so lit planes still face up and right, now in cool silver-blue moonlight; shade falls into deep navy and blue-green. Grass becomes cool dark blue-green (#2f5862 lit, #1f4352 shade), stone cool blue-grey (#6f86a3 lit, #374d6e shade), snow pale moonlit blue (#b7c8e0 lit, #6c88b2 shade), conifers near-black blue-green, the earth path a muted grey-blue. Keep the same soft painterly rendering. No stars, no moon and no sky in the painting itself. The only warm colour in the whole picture is the camp's own light: a small, contained warm amber glow (#FFC766 core) exactly inside its window, doorway, lantern or fire; nothing else is warm.
```
