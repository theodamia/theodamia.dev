# Camp artwork

The five camps on the climb (one per job) are small illustrated scenes generated with Gemini and then processed into the
site. This folder is the source material. Nothing here ships: `scripts/process-camps.mjs` turns the images in
`raw/` into the files the site uses.

## How to generate (Gemini app, free plan)

1. Start a **new chat** for each attempt so earlier images do not leak into the next one.
2. Attach `reference/scene-village.png` (a crop of our own scene: the huts, the pines and a tent).
3. Paste the **style brief**, then one **camp prompt**, as a single message.
4. **The Geekbot tent is the style anchor** (`raw/camp-2018.jpeg`, the tent with the campfire). Attach _that image too_ and add
   the **consistency line** to every other camp. This is what keeps all five looking like one set.
5. Save the ones you like as `raw/camp-<start year>.png` (or `.jpeg`): `camp-start` (the trailhead), `camp-2015`, `camp-2016`, `camp-2018`, `camp-2022`, `camp-2026` (full size, as downloaded).
6. Run `node scripts/process-camps.mjs` and look at the result on the page.

Keep the subject centred with a wide margin: a watermark in a corner, if there is one, gets cropped away.

## Style brief (paste first, every time)

```
Create a single small illustration in exactly the style of the attached reference image.

Style: flat vector-style illustration, like a modern editorial spot illustration. Every shape has a uniform,
thick, dark navy outline (#1E2B37) with rounded corners and rounded line ends. Flat colour fills only.
Form is shown with one flat darker tone on the shaded side of objects, never with gradients.

Palette, use ONLY these colours: burnt orange #CF4318, dark orange #A5330F, cream #F7F0E2, spruce green
#2E6B57, warm yellow #EBCF7F, wood tan #C8965A for anything wooden, amber #F2B441 only for something that is lit
(a flame, a lantern's glass, a window), slate grey #5F7284, light grey #E8EEF3, dark navy #1E2B37,
white for snow.

View: three-quarter front view, seen from slightly above eye level, as if standing a few metres away.
There is NO ground: no floor, no grass, no ground patch and no shadow under the objects. The objects stand in
empty space with their bases lined up along one invisible horizontal line (the site draws its own ground).

Do NOT include: ground, people, animals, text, letters, numbers, logos, mountains, trees, sky, clouds, sun,
gradients, textures, shadows cast on the background, lighting effects, borders or frames.

Size test: this will be shown very small, about 170 pixels wide. Draw at most three objects, all chunky and
solid. Avoid anything thin or wiry (folding chair frames, tripods, masts, washing lines, thin guy wires): at
that size they turn into scribble. One big hero object, one or two small solid props, clear gaps between them.

Composition: one compact group of objects, centred, filling about 60% of the image, with a wide empty margin
on all sides. Nothing touches or is cut off by the edge of the image. Square image.

Background: one perfectly flat, plain, solid magenta colour (#FF00FF) everywhere behind the subject,
with no variation at all.
```

## Consistency line (add to every prompt, with `raw/camp-2018.jpeg` attached)

```
Match the second attached image exactly: same outline weight, same palette, same level of detail, same
viewing angle and same scale of objects. It must look like part of the same set.
```

## The five camps

Each one says something about that stop, and they grow in size and confidence up the mountain.

**camp-start — the trailhead: the signpost where the climb begins — done (`raw/camp-start.jpeg`)**

Not a camp but the start of the trail, so no tent: one hiking signpost, the thing that marks where every
mountain path begins. It borrows the look of real trailhead signs in the Alps without naming them (a name drags
its own pictures in): **warm-yellow arrow boards** on a wooden post, and the **red-white-red waymark stripes**
painted on it. Stones hold its foot, like the spinner's at the top of the climb. **One** orange backpack leans on
it: one person setting off here, three backpacks outside the Lead tent later on. There is no light: the trailhead
is reached from the start, so nothing would ever come on, and at night the village windows beside it already
glow. It shows smaller than any camp (about 90 wide), so everything is extra chunky, and the post is a thick
square post, not a pole.

Attach `reference/scene-village.png` and the style anchor `raw/camp-2018.jpeg`, paste the style brief and the
consistency line, then:

```
Subject: the trailhead, where the climb begins. ONE hiking trail signpost, and nothing else except the few small
things described here.

The post: one thick, chunky, square wooden post standing straight up, in wood tan (#C8965A), with its right-hand
face in a darker tan as shade. It is a solid post, NOT a thin pole: about as wide as a fifth of a sign board's
length. On top sits a small pointed wooden cap in dark orange (#A5330F). A third of the way up, three painted
stripes run round the post: burnt orange (#CF4318), cream (#F7F0E2), burnt orange, each one flat colour.

The signs: near the top, two sign boards fixed to the post, one above the other. The upper one points RIGHT, the
lower one points LEFT. Each is a long flat board with one pointed arrow end, in warm yellow (#EBCF7F) with a
narrow darker-yellow edge along its bottom as shade, drawn almost flat to the viewer so its whole face shows.
Both boards are completely blank: no text, no letters, no numbers, no symbols, no painted arrows.

At its foot: three or four chunky rounded stones piled round the base of the post, in slate grey (#5F7284) and
light grey (#E8EEF3).

Leaning against the post on its left: ONE small chunky backpack in burnt orange (#CF4318), its shaded side in
dark orange (#A5330F), with a cream top flap and one dark strap. Packed and ready.

Nothing else: no people, no tent, no bench, no fence, no path, no trees, no flag, no lantern, no ground line,
no shadow. Tall and narrow, centred, with a wide empty margin all round, on the flat magenta background. It is
shown very small, about 90 pixels wide, so every part must be chunky and solid.
```

If the boards come back with writing on them, add: `The sign boards are plain flat yellow shapes with nothing
at all on them.` If the post comes back thin, add: `The post is as chunky as a fence post seen close
up, thick enough to read at 90 pixels wide.`

**village — the two houses at the foot of the trail — done (`raw/village-1.jpeg`, `raw/village-2.jpeg`)**

Where the climb starts from: home. The two houses keep what they are in the scene now (the first attached image):
the bigger one on the left with a **burnt orange roof**, the smaller one on the right with a **spruce green roof**,
cream walls, a dark door, square windows. They must not look like Fedenet's cabin just up the trail, so they are
**village houses, not mountain huts**: whitewashed walls with stone corners, a wooden gable, deep eaves, open
shutters. The pair swaps colours: green shutters under the orange roof, orange shutters under the green one.

Their windows are the village's lights. Each pane is a closed amber shape, so the script can lift it out like
Fedenet's window (one seed per pane, as for the Lead tent's split doorway): dark by day, they come on at night, as
the night reaches them. That is why nothing else in either picture may be amber or yellow.

The windows are proper finished windows, the same on both houses: an even wood-tan frame on all four sides with
the glass in its middle, a wooden cross making four square panes, a chunky sill, and the shutters as mirror images
touching the frame. (The first house came back with a frame thick on the left and missing on the right, the glass
pushed against the shutter, so its windows looked broken.)

The doors are real closed doors, painted like that house's shutters: planks, a knob, a wood-tan frame and a stone
step. (Asked for "a plain dark door", the model drew an empty dark doorway: the house looked as if its door was
missing.)

**One house per picture** (ask for one thing), so their sizes and the gap between them are set in code. Draw the
bigger house first; the smaller one is drawn against it.

`village-1` — the bigger house. Attach `reference/scene-village.png` and the style anchor `raw/camp-2018.jpeg`,
paste the style brief and the consistency line, then:

```
Subject: ONE house and nothing else: the bigger of two village houses at the foot of a mountain trail. It is the
LEFT-hand house of the first attached image (burnt orange roof, cream walls, dark door, square window), drawn in
the style, from the angle and with the level of detail of the second attached image.

Shape: a sturdy two-storey house, a little wider than it is tall, seen three-quarters on from slightly above, so
its front (the gable end) is lit and its long side wall is in shade. A steep pitched roof with deep overhanging
eaves, in burnt orange (#CF4318), the side slope in dark orange (#A5330F), with a narrow cream (#F7F0E2) edge
along the front of the roof.

Walls: the ground floor is whitewashed in cream (#F7F0E2), the side wall a slightly darker cream, with a few
chunky slate grey (#5F7284) corner stones at the front corners. The upper floor, inside the gable, is wooden:
wide vertical planks in wood tan (#C8965A), darker tan on the side.

Front: a closed wooden front door in the ground floor, painted spruce green (#2E6B57) like the shutters, made of
wide vertical planks shown by dark lines, with a small round dark knob, an even wood-tan (#C8965A) frame round its
top and sides, and one chunky slate grey (#5F7284) stone step in front of it. Beside the door, ONE square window. In
the wooden gable above, ONE smaller square window. Each is a proper finished window: an even wood-tan (#C8965A) frame of the same
width on all four sides, with the glass exactly in its middle; one thick wood-tan cross dividing the glass into
four equal square panes; a chunky wood-tan sill under it, a little wider than the frame. Two chunky spruce green
(#2E6B57) shutters are folded open beside each window, mirror images of each other, each as tall as the frame and
touching its outer edge. Both windows are LIT: each pane is one single flat amber shape (#F2B441), fully enclosed
by dark outlines. Nothing else in the image is amber or yellow. No glow, no rays, no halo, no reflections.

On the roof: one short, chunky chimney of slate grey stone.

Nothing else: no people, no second house, no balcony, no fence, no path, no garden, no flowers, no bench, no
trees, no snow, no smoke, no ground line, no shadow. Centred, with a wide empty margin all round, on the flat
magenta background. It is shown small, about 100 pixels wide, so every part must be chunky and solid.
```

**Fixing the windows of a house you otherwise like: edit, do not regenerate.** New chat, attach the house picture
alone, then (nothing else, no style brief):

```
Edit the attached image. Keep the house EXACTLY as it is: same shape, same roof, same chimney, same walls, same
corner stones, same door, same colours, same outline weight, same position and size. Do not redraw, restyle, move
or resize anything except the two windows. Keep the flat magenta (#FF00FF) background.

Redraw only the two windows (the one beside the door and the smaller one in the wooden gable), at the same size and
in the same places, as proper finished windows:

- The frame: an even wood-tan (#C8965A) frame of the same width on ALL FOUR sides of the glass, with a dark outline
  on its outer and inner edges. The glass sits exactly in the middle of its frame; nothing is cut off or missing on
  either side.
- The cross: one thick wood-tan bar across the middle and one down the middle, dividing the glass into four equal
  square panes.
- The panes: each one single flat amber shape (#F2B441), fully enclosed by dark outlines. No gradient, no
  reflection, no highlight.
- The sill: a chunky wood-tan sill under each window, a little wider than the frame, its front edge in a darker tan.
- The shutters: the same two spruce green (#2E6B57) shutters beside each window, folded open, each exactly as tall
  as the frame and touching its outer edge, mirror images of each other on the left and the right.

Nothing else changes and nothing is added: no flowers, no curtains, no glow, no rays, no other amber or yellow
anywhere.
```

And the same for a door that came out as an empty dark doorway (attach the house alone):

```
Edit the attached image. Keep the house EXACTLY as it is: same shape, same angle, same roof, same chimney, same
walls, same corner stones, same windows, shutters and sills, same colours, same outline weight, same position and
size. Keep the flat magenta (#FF00FF) background. Change only the doorway.

The doorway is now an empty dark opening. Put a real, CLOSED front door in it, filling the same opening and
following the same angle as the front wall:

- The door: a solid wooden door painted spruce green (#2E6B57), the same green as the shutters, made of three wide
  vertical planks shown by two dark lines, with a small round dark navy knob on its right side, half way up.
- The frame: an even wood-tan (#C8965A) frame round the top and both sides of the door, the same width as the
  window frames, with a dark outline.
- The step: one chunky slate grey (#5F7284) stone step in front of the door, a little wider than the door.

The door has no window and no glass. Nothing else changes and nothing is added: no porch, no roof over the door,
no lamp, no sign, no plants, nothing amber or yellow.
```

`village-2` — the smaller house. New chat. Attach `reference/scene-village.png`, `raw/camp-2018.jpeg` and the
approved `raw/village-1.jpeg` (third), paste the style brief and the consistency line, then:

```
Subject: ONE house and nothing else: the smaller neighbour of the house in the third attached image. It is the
RIGHT-hand house of the first attached image (spruce green roof, cream walls, dark door, square window), drawn
exactly like the house in the third attached image: same style, same angle, same outline weight, same walls,
door, window and shutter details, as if both were drawn by the same hand.

Shape: a one-storey cottage, clearly smaller and lower than the house in the third attached image, seen from the
same three-quarter angle. A pitched roof with deep overhanging eaves in spruce green (#2E6B57), its side slope in
a darker spruce green, with a narrow cream (#F7F0E2) edge along the front of the roof. No chimney.

Walls: whitewashed in cream (#F7F0E2), the side wall a slightly darker cream, with a few chunky slate grey
(#5F7284) corner stones at the front corners. A small wooden gable above the front wall in wood tan (#C8965A)
planks, darker tan on the side.

Front: a closed wooden front door exactly like the door of the house in the third attached image, but painted
burnt orange (#CF4318) like this house's shutters: vertical planks, a small round dark knob, a wood-tan frame and
one chunky slate grey stone step. Beside it ONE square window, exactly like the windows of the house in the third
attached image: an even wood-tan (#C8965A) frame of the same width on all four sides, one thick wood-tan
cross making four equal square panes, a chunky wood-tan sill. Two chunky burnt orange (#CF4318) shutters are folded
open beside it, mirror images of each other, each as tall as the frame and touching its outer edge. The window is
LIT: each pane is one single flat amber shape (#F2B441), fully enclosed by dark outlines. Nothing else in the
image is amber or yellow. No glow, no rays, no halo, no reflections.

Nothing else: no people, no second house, no balcony, no fence, no path, no garden, no flowers, no bench, no
trees, no snow, no smoke, no ground line, no shadow. Centred, with a wide empty margin all round, on the flat
magenta background. It is shown small, about 85 pixels wide, so every part must be chunky and solid.
```

If a window comes back uneven, add: `Each window's frame is equally wide on all four sides and its four panes
are equal squares.` If a balcony or railing appears, add: `The front is flat: no balcony, no railing, no porch.` If it turns
into a log cabin, add: `The walls are smooth whitewashed plaster, not logs or planks; only the gable is wooden.`

Save them as `raw/village-1.jpeg` and `raw/village-2.jpeg`. A house with artwork leaves `scenery.ts` and becomes a
picture where its hut stood (`components/scene/village.tsx`, placed and sized by `VILLAGE` in
`lib/scene/camp-layout.ts`); its windows go in the script's `LIGHTS` as `kind: 'window'` (one seed per pane) and
come on at night. The second house came back at the first one's proportions rather than lower, so it is made the
smaller neighbour by its width in `VILLAGE`. The first house took three rounds: the first draft's windows looked broken, an edit fixed them
(and turned the house properly three-quarters on), and a second edit gave it a real door.

**camp-2015 — Fedenet (intern): a small wooden cabin that was already there — done (`raw/camp-2015.jpeg`)**

An intern does not pitch a camp: they arrive somewhere that is ready for them. So the first stop is a cabin
someone else built, with the light left on.

```
Subject: a small wooden mountain cabin that is ready and waiting for a newcomer. One tiny log cabin, clearly
smaller than the tent in the attached image, seen three-quarters on from the same angle and from slightly
above: a lit front wall and a darker side wall made of horizontal wooden planks in wood tan (#C8965A, the side
in a darker tan), a simple pitched roof in dark orange with a lighter orange front edge, a short stone chimney
in slate grey, a plain dark door in the front wall with one stone step below it, and beside the door ONE square
window. The window is LIT: its glass is one single flat glowing amber shape (#F2B441) with no cross bars and no
divisions, fully enclosed by a dark outlined frame, and nothing else amber or yellow anywhere in the image. No
glow, no rays, no halo around it. Beside the cabin, not overlapping it, a small chunky stack of firewood.
Nothing else: no ground line, no fence, no path, no smoke. Small, solid, welcoming, already lived in.
```

The window is this camp's one animated item: dark while the camp waits, it comes on when the climber arrives,
the same way Ordereze's lantern does. That is why its glass has to be one closed amber shape with no bars (each
bar would split it into panes) and why nothing else in the picture may be amber.

**camp-2016 — Ordereze (junior engineer): done**

`raw/camp-2016.jpeg`: the small tent with the crate and the lantern that lights up. (Drawn side-on with its own
ground line, so it stands on the ridge rather than on the mountain's face.)

**camp-2018 — Geekbot (frontend engineer): done, and the style anchor**

`raw/camp-2018.jpeg`: the tent with the campfire that catches and flickers. Attach it to every new prompt.

**camp-2022 — Geekbot (frontend lead): the bell tent, breadth not height — done (`raw/camp-2022.jpeg`)**

The Lead camp must not outrank the Senior camp above it, so the two grow along different axes: this one is the
**widest** camp (it exists for other people), DeepSea's is the **highest** (leaner, more technical). Cream canvas
marks it as the shared tent; every personal tent on the climb is orange. Its animated item is the entrance, lit
from inside: not the lead's own lamp, but the room where the team gathers. Three backpacks by the door say the
team is in there.

(First try asked for a "mess tent with three small tents behind it" and came back as a cream shed with a porch,
a rectangular orange door and two squashed zigzags. Lesson: name an object the model knows and that has form of
its own, here a bell tent, and say plainly what it must not look like.)

```
Subject: the lead's camp, the hub a whole team comes back to. The hero is one BIG canvas BELL TENT: a round
tent with a tall cone-shaped roof rising to a single point on a centre pole, and a low round canvas wall below
it. It must clearly read as a canvas tent, NOT a house, shed, kiosk or garage: no flat vertical walls, no porch
roof on posts, no rectangular door. It is clearly wider and taller than the tent in the attached image and seen
from the same angle: three-quarters on, from slightly above.

Detail that gives it form: dark seams radiate from the peak down the roof, and the roof panels between them
alternate cream (#F7F0E2) and a slightly darker cream, with the panels on the right side darker still, in shade.
Where the roof meets the wall runs one band of burnt orange (#CF4318) trim with a scalloped lower edge. A small
burnt orange cap sits on the peak. Four short thick guy lines run from the roof edge to chunky pegs.

The entrance is an inverted-V opening in the front wall with both cream flaps tied back. The opening is LIT
from inside: it is one single flat amber shape (#F2B441), completely flat with no gradient, no reflection and no
lighter patch, fully enclosed by dark outlines, and nothing else in the image is amber or yellow. No glow, no
rays, no halo.

Beside the entrance, leaning against the tent wall in a neat row: three chunky backpacks, one burnt orange, one
spruce green, one slate grey, each with a dark outline. On the other side, standing a little apart and not
overlapping the tent: one wooden signpost (wood tan #C8965A) with two blank arrow boards pointing different
ways, shorter than the tent's wall.

Nothing else: no people, no small tents, no table, no mast, no flags. Do NOT draw a ground line or any line
under the objects. Organised, calm, generous: a camp built for others.
```

**camp-2026 — DeepSea.ai (senior engineer, today): only the dome — done (`raw/camp-2026.jpeg`)**

The counterpart of the Lead camp below it: not bigger, **higher**. Teo likes the hand-drawn dome this camp has
now, so the artwork is that tent and **nothing else**: `reference/dome-tent.png`, redrawn in our style.

(First try described it as "like an igloo", on snow, with a windbreak, skis, an ice axe and a wind spinner. It
came back as a squashed wedge behind a wall of ice blocks with a windmill. Lessons: never use a word that names
another object ("igloo" means ice blocks), ask for one thing only, and do not look down on a dome: from above it
stops being a half-circle. Second try, tent only, was the right type but plain: a boxy base with corners and
dark blob pegs. Third version adds the detail vocabulary of the other camps: wooden pegs, a rolled and tied door
flap, a hooded vent, a snow-skirt band, a round footprint.)

How it stays clear of the Lead camp even as a lone tent:

|        | Lead: bell tent                                | DeepSea: dome                                                        |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------- |
| Says   | many people, a hub                             | one expert, self-sufficient                                          |
| Shape  | tall cone to a point                           | low smooth half-sphere, no peak                                      |
| Colour | cream canvas (shared)                          | orange with a cream cap (personal, like every own tent on the climb) |
| Fabric | soft canvas, scalloped trim, loose flaps       | taut technical shell over crossed poles, no trim at all              |
| Size   | the widest camp, with backpacks and a signpost | small and alone                                                      |

Attach **three** images: `reference/scene-village.png`, the style anchor `raw/camp-2018.jpeg`, and
`reference/dome-tent.png`. Paste the style brief and the consistency line, then:

```
Subject: ONE tent and nothing else: a modern geodesic expedition dome tent, the kind used at high camps. Keep the
tent type of the third attached image (orange dome, cream cap, crossed poles, arched door) and draw it in the
style and from the angle of the second attached image, with the same level of detail as that tent.

Shape: a low, smooth half-sphere, wider than it is tall, rounded top, no peak. Its footprint is ROUND: the bottom
edge is one smooth shallow curve from left to right with NO corners and no straight box edges. It must not look
like a dome sitting on a box or a tray.

Shell: lower body burnt orange (#CF4318), with the right-hand third in darker orange (#A5330F) as shade. Upper
part a cream cap (#F7F0E2), its right-hand third a slightly darker cream, separated from the orange by one curved
dark seam running round the dome. Along the very bottom edge runs a narrow snow-skirt band in darker orange
(#A5330F), following the curve of the base.

Poles: two thick dark pole seams rise from the ground, arc over the top and cross at the highest point, so the
fabric looks taut between them. Just below the crossing, on the cream cap, sits one small hooded roof vent in
burnt orange with a dark outline.

Entrance: an arched doorway low in the centre of the front, filled with dark navy (#1E2B37). Its cream door flap
is rolled up into a chunky roll above the arch and held by two small wood-tan toggles.

Guy lines: four short thick dark guy lines run from half way up the dome down to four WOODEN pegs in wood tan
(#C8965A), each peg a chunky stake driven in at an angle with a dark outline and a flat top, like the pegs in the
second attached image. Two pegs in front, one at each side.

Absolutely nothing else in the image: no snow, no ice, no wall, no skis, no tools, no windmill, no mast, no flag,
no backpack, no ground, no ground line, no shadow. Just the tent, centred, with a wide empty margin all round, on
the flat magenta background.
```

**Adding the wind spinner (this camp's animated item) without touching the tent**

The approved tent must stay exactly as it is, so do not regenerate: **edit** the approved picture. New chat,
attach `raw/camp-2026.jpeg` first and `raw/camp-2018.jpeg` second, then:

```
Edit the first attached image. Keep the tent EXACTLY as it is: same shape, same colours, same outline, same
vent, same rolled door flap, same guy lines and pegs, same position and size. Do not redraw, restyle, move or
resize the tent. Keep the flat magenta (#FF00FF) background. Only ADD one new object:

A small wind spinner standing to the RIGHT of the tent, clear of it: it must not touch or overlap the tent, its
guy lines or its pegs, and the whole rotor must have only empty magenta background behind it. Its foot is level
with the tent's base. In total it is about two thirds as tall as the tent.

The mast: one short, thick, straight pole in slate grey (#5F7284) with a dark outline, with a chunky wood-tan
(#C8965A) collar just below the rotor. At its foot, a small cairn of three chunky stacked stones in slate grey
holds it up.

The rotor, on top of the mast: drawn flat and face-on, like a pinwheel seen exactly from the front. FOUR
identical blades in burnt orange (#CF4318), evenly spaced like a plus sign (up, right, down, left), each blade a
simple rounded paddle shape, wider at its tip than at the hub, one single flat colour, fully enclosed by a dark
outline. In the centre a round dark navy hub with a small cream dot in its middle. The rotor's diameter is about
one third of the tent's width.

Behind the rotor, fixed to the mast: one small cream tail fin with a dark outline, pointing right.

Same illustration style as the tent: thick even dark outlines, flat colours, no gradients. Nothing else is
added: no ground, no ground line, no shadow, no snow, no cables, no lights, nothing amber or yellow.
```

Outcome: the edit put the rotor over the dome, which could not be lifted cleanly. So `raw/camp-2026.jpeg` is the
tent alone again, and the spinner is its own picture, `raw/camp-2026-spinner.jpeg` (X-shaped rotor, no blade over
the mast, no tail fin), standing beside the tent.

If the edit changes the tent anyway, generate the spinner **alone** (style brief, then "ONE small wind spinner and
nothing else", the mast / rotor / tail-fin paragraphs above, and "no tent, no ground, no shadow; centred, tall
and narrow, wide empty margin, flat magenta background") and save it as `raw/camp-2026-spinner.jpeg`: the page
then places it beside the untouched tent, which is guaranteed identical because it is the same file.

Why the rotor is specified like this: four blades, face-on, so the rotor's centre is the centre of its box and the
page can turn the lifted layer without wobble; each blade one flat orange shape inside a dark outline, so the
script lifts the blades out like a flame (one seed per blade); standing clear on empty background, so taking the
blades out leaves clean transparency. The mast, collar, cairn and tail fin stay still.

## The flag: one picture, raised at every camp — done (`raw/flag.jpeg`)

Every camp has the same flag: the one the climber raises on arriving (the trailhead has none, nothing is
conquered there). Today it is drawn in code: an ink line and a flat orange triangle that runs up the line. The
picture keeps that triangle, the same burnt orange **pennant flying right, towards the camp**, and gives it what
the rest of the set has: a chunky wooden pole with a cap and stones at its foot (the signpost's wood, cap and
stones), a cream hem tied to the pole, and one fold in the cloth so it reads as cloth in the wind.

It is drawn so the cloth can be taken off the pole: the cloth touches the pole only along its left edge and has
nothing but background around it, like the wind spinner's blades. The script lifts it out as a layer of its own
(the pole kept in the picture), and the page runs it up the pole when the climber arrives and lets it ripple a
little in the wind, with transforms only. At night it is dimmed with the camp's artwork; it is not a light.

Attach `reference/scene-village.png`, the style anchor `raw/camp-2018.jpeg` and the trailhead signpost
`raw/camp-start.jpeg` (third), paste the style brief and the consistency line, then:

```
Subject: ONE flag on a flagpole, and nothing else: the flag a climber raises on reaching a camp. The pole is
made like the signpost in the third attached image: the same wood, the same cap, the same stones.

The pole: one straight, chunky, vertical wooden pole in wood tan (#C8965A), its right-hand side in a darker tan,
with a dark outline. It is a solid pole, not a thin line: about as wide as a sixth of the flag's height. On top,
one small pointed cap in dark orange (#A5330F). At its foot, three chunky rounded stones in slate grey (#5F7284)
and light grey (#E8EEF3) hold it up. The pole is about three times as tall as the flag.

The flag: ONE triangular pennant flying to the RIGHT from the top of the pole, just under the cap. Its left edge
runs straight down along the pole and it narrows to one rounded point on the right. It is burnt orange
(#CF4318) with one gentle fold across it: the part beyond the fold in dark orange (#A5330F), as if the cloth
turns in the wind. Along its left edge, next to the pole, a narrow cream (#F7F0E2) hem, tied to the pole by two
small dark ties. The flag is completely plain: no emblem, no symbol, no stripes, no text.

Only the flag's left edge touches the pole. Above it, below it and to its right there is nothing but empty
magenta background.

Nothing else: no people, no tent, no snow, no ground, no ground line, no shadow, no rope, no second flag. Tall
and narrow, centred, with a wide empty margin all round, on the flat magenta background. It is shown very small,
about 80 pixels tall, so every part must be chunky and solid.
```

If the flag comes back as a rectangle or a banner, add: `The flag is a triangle: one straight edge along the
pole and two edges meeting in a single point on the right.` If it wraps round the pole or has a rope, add: `The
flag hangs flat beside the pole, attached only along its left edge; no rope, no halyard.`

Save it as `raw/flag.jpeg`. The script lifts the cloth with `region` (a rectangle of the raw image holding only the
cloth: everything in it that is not background) and writes the pole's position as `poleX`; the first picture came
back exactly as asked, cloth clear of the pole but for its hem, so it went in as it was.

## The trees: two pictures for the near slopes — done (`raw/tree-1.jpeg`, `raw/tree-2.jpeg`)

Today every tree is two flat stacked triangles with no outline: about a hundred small ones on the slopes (50 to
100 units tall, faded by distance and moonlit at night) and four big pines framing the trailhead in the
foreground (250 to 380 units). Beside the outlined houses, flag and camps, the near ones now look like leftovers.

So the **near** trees become artwork: the slopes around the village and the camps, and the big framing pines.
The **far** trees stay flat silhouettes: haze is what flat shapes do best, and outlined trees on every distant
ridge would clutter the mountain (near drawn in ink, far washed out: it reads as depth).

Two pictures, a tall slender spruce and a shorter, fuller fir of the same forest; the page flips and scales them,
so a hundred trees never look like copies. They keep today's type (stacked pointed tiers, spruce green) and gain
what the set has: the thick outline, a flat shaded side, drooping branch tips, a wooden trunk. No snow: they grow
on the lower slopes. They are shown both small and very large, so the shapes are bold and simple, with no needles
drawn one by one. They do not move (nothing animates inside a mountain layer); at night they are dimmed like the
camps' artwork.

`tree-1` — the spruce. Attach `reference/scene-village.png`, the style anchor `raw/camp-2018.jpeg` and
`raw/village-1.jpeg` (third), paste the style brief and the consistency line, then:

```
Subject: ONE tree and nothing else: a tall, slender mountain spruce, the evergreen that grows on the slopes around
the village. Keep the kind of tree in the first attached image (a tall, narrow evergreen made of stacked pointed
tiers) and draw it in the style of the second attached image, with the same outline weight as the house in the
third attached image, which it grows beside.

Shape: tall and narrow, about three times as tall as it is wide, with a pointed top, standing straight up. Four
tiers of branches stacked one above the other, each a little wider than the one above. The lower edge of each
tier is a row of three or four soft downward points, like drooping branch tips, overlapping the tier below.

Colour: each tier is split down the middle: the left half spruce green (#2E6B57), the right half a darker spruce
green, as the shaded side. A short, straight trunk in wood tan (#C8965A), its right side darker, shows below the
lowest tier. A thick, even dark navy outline runs round the whole tree and along the edge of each tier.

Nothing else: no snow, no cones, no needles drawn one by one, no birds, no grass, no ground, no ground line, no
shadow, no second tree. Tall and narrow, centred, with a wide empty margin all round, on the flat magenta
background. It is shown both small (about 60 pixels tall on the far slopes) and large (about 300 pixels tall
close up), so the shapes must be bold and simple, with no fine detail.
```

`tree-2` — the fir, drawn against the spruce. New chat. Attach `reference/scene-village.png`,
`raw/camp-2018.jpeg` and the approved `raw/tree-1.jpeg` (third), paste the style brief and the consistency line,
then:

```
Subject: ONE tree and nothing else: a second tree for the same forest as the tree in the third attached image,
drawn exactly like it: the same style, the same outline, the same two greens split down the middle, the same
tiers with drooping points, the same wood-tan trunk. Only its shape is different: shorter and fuller, about twice
as tall as it is wide, with THREE tiers instead of four, the lowest one wide and low, and a slightly rounder top.

Nothing else: no snow, no cones, no needles drawn one by one, no birds, no grass, no ground, no ground line, no
shadow, no second tree. Centred, with a wide empty margin all round, on the flat magenta background. It is shown
both small (about 50 pixels tall) and large (about 250 pixels tall), so the shapes must be bold and simple.
```

If the tree comes back realistic or bristly, add: `Flat and geometric, like the trees in a picture book: a few
big shapes, no texture, no individual needles.` If the tiers merge into one cone, add: `Each tier is a separate
shape with its own outline, and its pointed lower edge overlaps the tier below it.`

Save them as `raw/tree-1.jpeg` and `raw/tree-2.jpeg`. `scenery.ts` places them where the near pines stood (same
spots and sizes, from the same noise, so the forest keeps its layout; `TREE_PICTURES`), about 60% spruces, each
stretched a little taller or shorter; the far slopes keep their silhouettes. The fir came back lit from the right
(its left half is the dark one) while every other picture is lit from the left, so the page always mirrors it,
and never mirrors anything else: flipping trees at random for variety would put the shade on both sides.

## When it goes wrong

Add one of these to the end of the prompt and try again in a new chat:

- **Gradients, shading or texture appear** — `Absolutely flat colours only. No gradients, no airbrushing, no
paper or grain texture. Think cut paper or a vector icon.`
- **It draws scenery or a ground** — `No landscape and no ground at all. Only the objects, floating on the flat
magenta background with their bases on one invisible line.`
- **Text or symbols on signs, crates or flags** — `All signs, crates, maps and flags are completely blank.`
- **Colours drift** — `Use only the listed palette. No blue, no purple, no pink, no bright red, no bright
yellow.`
- **The background is not flat** — `The background must be one single flat colour, #FF00FF, with no vignette,
no floor and no shadow.`
- **The subject is cut off or too big** — `Zoom out. The whole group must fit well inside the image with
empty margin on every side.`
- **Outlines too thin or uneven** — `Outlines are thick and even everywhere, about the same weight as in the
reference image.`
- **Thin, wiry things appear (chair frames, tripods, masts, lines)** — `Remove every thin or wiry object. Only
chunky solid shapes that still read when the image is 170 pixels wide.`
- **The hero object comes out as a bland box** — name a specific, familiar object with form of its own (a bell
  tent, a log cabin, a dome tent) instead of a category ("mess tent", "shelter"), describe its seams, panels and
  trim, and say what it must NOT look like.
- **A ground line keeps appearing** — `Do NOT draw a ground line or any line under the objects.` (If it stays,
  it is harmless: side-on art stands on the ridge and the line lies on the ridge line.)
- **Extra objects appear that nobody asked for** — a word in the prompt is naming them ("igloo" brings ice
  blocks, "advance camp" brings gear). Remove the word, say `ONE tent and nothing else`, and list what must not
  appear.
- **Too realistic** — `Simpler. Fewer details, bigger shapes, friendly and geometric, like the houses and
tent in the reference image.`

## Things that come alive

Each camp has something that comes alive when the climber arrives; the camp itself never changes colour or size.
Fedenet's cabin: its window lights. Ordereze: a lantern comes on and breathes. Geekbot: a campfire catches and
flickers. Geekbot Lead: the bell tent's entrance glows from inside. DeepSea: the wind spinner starts turning
**and** the dome's doorway lights. The trailhead has nothing: it is reached before the climb starts. The
village is the one exception to "on arrival": its windows follow the night, not the climber.

The script does this from `LIGHTS` at the top of `scripts/process-camps.mjs`: a list per camp, each entry with an
`id` (used in the file names), a `kind` and where to find it on the raw image (open it in Preview and read the
pixel coordinates):

- `fire` and `lantern` with `seeds`: points **inside the lit colour** (the orange of a flame, the amber of a
  glass). The shape is lifted out into its own layer and the camp is saved with the light out. One seed is
  enough unless dark lines split the shape into panes (a lantern's wire guard, a tie across a doorway): then one
  per pane. The lit shape must be closed, with a dark outline all round and nothing else in that colour touching
  it, which is why the prompts ask for exactly that and for no painted glow (the page adds its own).
- `spinner` with `seeds` (one per blade), `hub` and `hubRadius`: the blades are lifted out and turn about the
  hub, which stays in the picture. Draw a spinner **alone**, as a picture of its own (`raw/camp-<year>-spinner`,
  placed beside the camp by `ART_EXTRAS` in `lib/scene/camp-layout.ts`), and mark it `standsAlone`: the blades are
  then taken with their whole outline and leave clean background (`keep` protects the mast their outlines run
  into). A spinner drawn in front of a tent can only be patched, never lifted cleanly: that was tried and dropped.
- `lantern` with `door: { seed, box }` for a doorway that is **drawn dark**: nothing is lifted; the light is made
  from the doorway's own shape (`seed` inside the dark, `box` a rectangle round the doorway that keeps the search
  from running off along the outlines), shrunk so its outline stays dark.

## What happens next

`scripts/process-camps.mjs` removes the magenta, crops the corners, trims each image to its subject, stands
them all on the same ground line and writes `public/camps/camp-<year>.webp` at twice the display size, plus the sizes in `lib/scene/camp-art.json`.
A camp with no artwork yet keeps its hand-drawn tent (the trailhead, its signpost), so they can arrive one at a time.
The camp's name and the waiting → conquered animation stay in code (`camp-mark.tsx`). The flag is one picture
of its own (see "The flag"), so never ask for a flag inside a camp's prompt.
