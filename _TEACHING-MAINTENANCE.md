# Teaching materials maintenance notes

Not published. The leading underscore makes Quarto skip this file when rendering the
website, so it lives in the GitHub repo but never appears on kostadinoff.github.io.

## What drives the Teaching materials page

`slides.qmd` is a thin shell. Everything on it comes from **`assets/teaching-data.js`**,
which is the single source of truth, rendered at runtime by `assets/teaching.js`.
Search, tag filters, counts and ordering are all derived — adding material means adding
an object to the data file and nothing else.

The file's own header comment documents the item shape. This file covers the parts
around it that break silently.

## Adding a practical class PDF

1. **Drop the PDF in the academic-year folder** — `2026-2027-classes/` for the current
   year. Name it `practical-class-NN.pdf` (`-bg` suffix for the Bulgarian track) so
   files sort naturally.
2. **Check the folder is in `_quarto.yml` under `resources:`.** This is the one that
   bites: a PDF in an unlisted folder is never copied to `docs/`, and the link 404s on
   the live site while working fine locally. `2025-2026-classes/`, `2026-2027-classes/`,
   `slides/` and `assets/` are listed.
3. **Add the item** to the right discipline → language → year block in
   `assets/teaching-data.js`. Both social-medicine year blocks for 2026/2027 already
   exist with a commented-out template item — uncomment and fill it in.
4. **Bump `updated:`** at the top of the data file.
5. **Render and commit** (see below).

## Academic years

The academic year is the only level between a language and the two collections
(*lectures* / *handouts*). There is deliberately no "year of study" level.

- A year block with no items is **skipped by the renderer**, so an empty `2026-2027`
  block is invisible until the first item lands. That is why the new year can be
  scaffolded in advance.
- The year selector opens on the newest year that *actually has materials*, so nothing
  looks stale in the weeks before uploads start.
- `currentAcademicYear` at the top of the data file is used only for the archive note
  ("Materials for 2026/2027 appear here as they are prepared"). Bump it each September.
- **Never delete an old year block.** Past cohorts stay browsable as an archive; that is
  the point of the structure.

## File layout, and the one inconsistency

| Track | Where the PDFs live |
|---|---|
| Social medicine, English | `2025-2026-classes/`, `2026-2027-classes/` — one folder per academic year |
| Everything else | `slides/<discipline>-<lang>/` — flat, not year-scoped |

The flat folders cannot hold two cohorts of `practical-class-01.pdf` without one
overwriting the other, so new material should go into the year folder regardless of
track. The 2026/2027 Bulgarian template points there for that reason.

## Rendering

```bash
quarto render
```

Renders the whole site to `docs/`, which is what GitHub Pages serves. Rendering a single
`.qmd` on its own can delete the tracked root-level `site_libs/` folder — see
`_CV-MAINTENANCE.md` for that quirk and its fix.

## Loose ends

- `teaching/materials.json` is a legacy manifest from an earlier version of this page.
  Nothing reads it, and it is truncated mid-structure so it is not even valid JSON.
  Delete it once you are sure nothing local depends on it.
