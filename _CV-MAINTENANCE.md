# CV maintenance notes

Not published. The leading underscore makes Quarto skip this file when rendering the
website, so it lives in the GitHub repo but never appears on kostadinoff.github.io.

## What this CV is

`CV.qmd` is the **full academic record**, not a curated short CV. It doubles as the
reference list for university queries and attestations, so entries get reclassified or
reworded — never deleted to save space. HTML and PDF render from the same source.

## Adding a publication

`referencelist.bib` is the single source of truth. Never hand-edit `_publications.md`.

1. Add the entry to `referencelist.bib` (JabRef, or `getbib <doi>`).
2. Run the generator:
   ```bash
   python scripts/build_publications.py
   ```
3. Re-render (see below).

### Conventions the generator relies on

| Convention | Effect |
|---|---|
| Title ends with ` (Abstract)` | Filed under *Conference abstracts published in journals* |
| `journal` is a congress name (e.g. `ISEE 2026`) + `(Abstract)` | Filed under *Other scholarly outputs* |
| Title contains `Comment on` | Filed under *Commentaries and letters* |
| `@book` | Filed under *Books and monographs* |
| Everything else | Filed under *Peer-reviewed original research articles* |

The generator bolds `Kostadinov K*`, links every DOI, numbers continuously across all
categories, and sorts newest first using `year` then `month`. Author names are rendered
Vancouver style with no periods after initials — keep the rest of the CV consistent with
that (`Kostadinov K`, not `Kostadinov K.`).

## Where new items go

| New item | Section |
|---|---|
| Journal article, abstract, book | `referencelist.bib` → regenerate |
| Grant, contract, commissioned analysis | Research funding and projects → *Grants, fellowships and personal funding* |
| Project participation | Research funding and projects → International / National / University |
| Conference talk or poster | Conference contributions (International or National) |
| Invited talk, keynote, ministry lecture | Invited lectures and keynotes |
| Prize | Awards and honours, and cross-referenced at the event |
| Course, certificate, CPD | Selected advanced training → newest first |
| Textbook, practical guide, teaching text | Teaching materials and textbooks |
| R package, dataset, Zenodo DOI | Research software and open science |
| Editorial appointment | Editorial and peer-review service |
| Thesis student, mentee | Supervision and mentorship |
| Policy or ministry work, WHO contract | Policy, public health and knowledge-translation activities |

## House rules

- **Dates.** `Month YYYY – Month YYYY` for appointments and projects; `DD–DD Month YYYY`
  for meetings and conferences. En dash, not hyphen.
- **Presenter roles.** Mark `Presenter`, `Poster presentation`, `Oral presentation`,
  `E-poster presentation` or `Co-author`. Do not imply you presented a co-authored
  abstract that someone else delivered.
- **No invented facts.** Locations, funders, grant numbers and roles come from a
  document. If it cannot be sourced, leave it out rather than guess.
- **No metrics box.** A citations/h-index table was removed deliberately — Scopus,
  Scholar and Web of Science disagree, and a hard number goes stale the day it is
  written. Per-category counts in the Publications headings are fine because they count
  what is printed directly below them.
- **No personal data.** No date of birth, EGN, home address or driving licence.
- **The MU NID report is not authoritative for author order.** Its author fields are
  scrambled and it contradicts itself between sections. The `.bib` wins.

## Rendering

```bash
python scripts/build_publications.py && quarto render CV.qmd --to html && quarto render CV.qmd --to pdf
```

Output goes to `docs/CV.html` and `docs/CV.pdf`, which is what GitHub Pages serves.

**Quirk:** rendering `CV.qmd` on its own deletes the tracked root-level `site_libs/`
folder. Restore it before committing:

```bash
git checkout -- site_libs
```

Rendering the whole site (`quarto render`) does not have this problem.

## Checks worth repeating

- Every page of the PDF should end on real content, not on a heading or a bare date label.
- No horizontal scrolling on mobile; wide tables need `::: {.table-responsive}`.
- DOIs resolve via content negotiation, which avoids publisher bot-blocking:
  ```bash
  curl -sL -o /dev/null -w "%{http_code}" -H "Accept: application/vnd.citationstyles.csl+json" https://doi.org/<DOI>
  ```
  Publisher pages returning 403 to `curl` are usually fine in a browser; only 404 means dead.
