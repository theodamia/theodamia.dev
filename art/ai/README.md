# /ai: the paintings

The page's idea, "AI writes the draft, not the decisions", told by a gentle giant robot: an original design, friendly and never menacing, in the site's painting style. It is the site's one character besides the saucer on /about, and it appears twice, as part of the world rather than as an illustration beside the text.

| What                                                                                  | Raw file (local only, `raw/` is not in git)          | Prompts                                                      |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| The header: the giant looking at a range that turns from a wireframe draft into paint | `raw/header-{day,night}.png`, 1536 × 1024 on magenta | `AI-README.md`, "Day set" and "Finale and header night"      |
| The finale: the giant waiting at a fork in the trail, not choosing                    | `raw/finale-{day,night}.png`, 1536 × 1024 on magenta | `AI-README.md`, "Finale and header night" and "Finale night" |
| The concept board and the dropped section pictures (setup, places, fork)              | `raw/concepts/`, `raw/{setup,places,fork}-day.png`   | `AI-README.md`, kept for the record of the choice            |

`pnpm ai` (`scripts/process-ai.mjs`) keys both scenes, gives each night its day's outline, recolours the wireframe to the site's orange (the painter mixed magenta into its thin lines), dissolves the header's left end into the sky, trims the magenta above each scene and writes `public/ai/` and `scene/ai.json`. The night is always an edit of the day: the giant's two lamp eyes are its only warm light.
