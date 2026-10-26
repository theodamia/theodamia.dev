# /about: the paintings

The page ends, at Contact, on the next range across a sea of clouds as the sun comes up. That range is one painting in three lights with one outline, and the page's one easter egg is a small saucer.

| What                                              | Raw file (local only, `raw/` is not in git)                      | Prompts                                                                                                            |
| ------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| The range at sunrise, in the morning and at night | `raw/ahead/land-{sunrise,day,night}.png`, 1536 × 1024 on magenta | `AHEAD-README.md` (the sunrise is an edit of the key frame `raw/concepts/c1-dawn-ahead.png`; "Day" is the morning) |
| The saucer                                        | the top-left piece of `raw/ufo-{day,night}.png`                  | `SAUCER-README.md`                                                                                                 |

`pnpm about` (scripts/process-about.mjs) keys them, gives every light the sunrise's outline, measures where the summit and the saucer's running lights are, and writes `public/about/` and `scene/about.json`.
