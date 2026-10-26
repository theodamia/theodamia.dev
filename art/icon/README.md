# The site icon

The owner's initials, TD, hand-painted in burnt-orange trail paint on a granite boulder, the way Alpine trails are marked. The letters follow the site's display face (Bricolage Grotesque Bold): the painter was given them as a guide, `raw/guide-td.png`, set from `lib/og/fonts/bricolage-700.ttf`.

| What                                   | Raw file (local only, `raw/` is not in git) | Prompts                                            |
| -------------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| The icon by day                        | `raw/blaze.png`, 1024 × 1024                | `ICON-README.md`, "blaze"                          |
| The icon by night (an edit of the day) | `raw/blaze-night.png`, 1024 × 1024          | `ICON-README.md`, "blaze — night"                  |
| The other concepts, not used           | `raw/{snowcap,sign,badge}.png`              | `ICON-README.md`, kept for reference to the choice |

`pnpm icons` (`scripts/process-icons.mjs`) frames both paintings on the letters (measured on the day, so the two themes line up) and writes the favicon, the two tab icons and the home-screen icon. It must read as TD at 16 × 16: check any new painting at that size first.
