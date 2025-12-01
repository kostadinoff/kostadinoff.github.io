# AI Agent Instructions for kostadinoff.github.io

## Project Overview

This is a **Quarto-based academic website** hosting Dr. Kostadin Kostadinov's teaching materials, epidemiological news, and CV. The site is built with Quarto 1.x, deployed to GitHub Pages (`docs/` directory), and uses a custom theme combining Bootstrap's "darkly" theme with a custom SCSS file (`barbie.scss`).

**Key Output**: `quarto render` → `docs/` directory → Published at https://kostadinoff.github.io

## Project Architecture

### Core Structure
- **Root `.qmd` files**: `index.qmd`, `CV.qmd`, `teaching.qmd`, `epinews.qmd` — main landing pages
- **Content directories**:
  - `teaching-posts/` — 25+ educational materials (various disciplines: statistics, public health, ethics, dental medicine)
  - `epinews-posts/` — weekly epidemiological news briefs (bilingual: English/Bulgarian)
- **Configuration**:
  - `_quarto.yml` — site config, navbar, output settings, theme (darkly + barbie.scss)
  - `teaching-posts/custom.yml` — Bulgarian localization strings
  - CSL files — citation styling (ACS, PLOS Medicine formats)

### Theme & Styling
- **barbie.scss** — custom color scheme (`$primary: #3AA6B9`, `$secondary: #a82b61`, `$tertiary: #e99a11`)
- Custom code block styling (background: `#f6d5e920`, borders, inline code highlighting)
- Navbar dark theme, custom button styling (`.btn-secondary` with `#951049`)
- Category badges in post listings

## Content Patterns & Conventions

### Teaching Posts (`teaching-posts/*.qmd`)
```yaml
---
title: "Ethical Frameworks and Professional Resilience in Dental Practice"
author: "Department of Social Medicine and Public Health, Kostadin Kostadinov, MD, PhD"
date: 2025-12-01
description: "Brief summary..."
categories:
  - "Language (English/Bulgarian)"
  - "Discipline (e.g., Research methodology, Statistics)"
  - "Audience (e.g., Dental medicine | 2nd year)"
title-meta: "Same as title"
author-meta: "Same as author"
date-meta: 2025-12-01
---
```
- **Naming**: `teaching-posts-{NN}.qmd` (sequential numbering)
- **Metadata**: Always include `title-meta`, `author-meta`, `date-meta` for proper rendering
- **Structure**: H1 headings for main sections, H2 for subsections; extensive paragraphs with citations
- **References**: Use `bib.bib` and `plos-medicine.csl` or `custom.yml` for localization

### Epidemiology News Posts (`epinews-posts/*.qmd`)
```yaml
---
title: "Epidemiological News: Week NN, YYYY"
author: "Kostadin Kostadinov"
date: YYYY-MM-DD
description: "Multi-paragraph executive summary..."
categories:
  - "Epidemiology"
  - "Public Health"
  - "Infectious Diseases"
  - "Language (English/Bulgarian)"
---
```
- **Naming**: `{YYYY}-W{WW}-{lang}.qmd` (e.g., `2025-W47-en.qmd`)
- **Structure**: Executive Summary → Detailed sections by region (Bulgaria, EU/EEA, Global) → Specific disease updates
- **Bilingual**: Pair files by week (e.g., `2025-W47-en.qmd` + `2025-W47-bg.qmd`)

### Listing Configuration (`teaching.qmd`, `epinews.qmd`)
Both use Quarto listing with filtering/sorting:
```yaml
listing:
  contents: "teaching-posts/!(template|blog-image|references).qmd"
  categories: true
  filter-ui: true
  fields: [title, date, author, description, categories]
  type: grid
  grid-columns: 1
  sort: "date desc"
```
- **Template exclusion**: Files named `template`, `blog-image`, or `references` are skipped
- **Categories** enable filtering by language, discipline, and audience
- **Sort order**: Most recent first

## Build & Deployment Workflow

### Render Process
```powershell
quarto render
```
- Renders all `.qmd` files → produces HTML in `docs/`
- **Important**: `_quarto.yml` specifies `output-dir: docs` for GitHub Pages deployment
- Check `docs/` directory after render; **do not commit source files to docs/**

### File Changes
- Edit `.qmd` files in root or subdirectories
- **Never edit** `docs/*.html` or `docs/site_libs/` manually (regenerated on render)
- **Metadata YAML** in `.qmd` frontmatter controls site structure and listings

### Deployment
- Push to `main` branch; GitHub Actions auto-deploys `docs/` to GitHub Pages
- Test locally with `quarto preview` to avoid commit-debug cycles

## Key Conventions & Patterns

### YAML Frontmatter
- **Always include** `title-meta`, `author-meta`, `date-meta` in teaching/news posts (Quarto rendering requires these)
- **Categories** use consistent naming: language tags (`English`, `Bulgarian`), discipline/topic tags (avoid spaces; use pipes for hierarchies like `Dental medicine | 2nd year`)
- **Description**: Multi-sentence executive summary for listing cards

### Code & Math
- Inline code: `` `code` `` → styled with pink (`#a62675ff`) on light background
- Code blocks: Triple backtick with language tag (e.g., ` ```r `, ` ```python `)
- Math: Wrap in `$` (inline) or `$$` (block) for KaTeX rendering

### Bibliography & Citations
- **Teaching posts** reference `teaching-posts/bib.bib` + `plos-medicine.csl`
- **CV** references `referencelist.bib` + `american-chemical-society.csl`
- Cite syntax: `@citekey` inline or `[@citekey]` in parentheses

### Bilingual Content
- Use `custom.yml` in `teaching-posts/` for Bulgarian UI labels (search, filter captions)
- Post categories tag language (`English` or `Bulgarian`)
- **No automatic translation**: Create separate `.qmd` files per language

### Asset Management
- Images placed in `teaching-posts/images/` or inline directory references
- **Font Awesome icons** via `{{< fa brands twitter >}}` (registered extension in `_extensions/quarto-ext/fontawesome/`)

## Immediate Productivity Tips

1. **Add a new teaching post**: Copy `teaching-posts/teaching-posts-01.qmd` structure, increment number, fill YAML metadata, write content, test with `quarto preview`
2. **Add an epi news post**: Use naming `{YYYY}-W{WW}-{lang}.qmd`, fill executive summary + regional sections, include category tags
3. **Update CV**: Edit `CV.qmd`, bibliography auto-renders from `referencelist.bib`
4. **Modify theme**: Edit `barbie.scss` for colors or `_quarto.yml` for navbar/format settings
5. **Iterate safely**: Use `quarto preview` to test changes locally before rendering; preview server watches for file changes

## Critical File References
- `_quarto.yml` — all site config (output path, theme, navbar)
- `teaching-posts/teaching-posts-*.qmd` — teaching material templates
- `epinews-posts/*.qmd` — news brief templates
- `barbie.scss` — brand colors and custom styles
- `teaching-posts/bib.bib`, `referencelist.bib` — bibliographies
