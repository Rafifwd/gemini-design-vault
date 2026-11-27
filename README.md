# Gemini Design

**Consultative, anti-AI-slop design skill and modular reference vault for AI coding agents** (`npx skills`, Antigravity, Claude Code, Cursor, Codex, and Windsurf).

When AI agents design from an empty prompt, they collapse into generic templates—recycled purple gradients, SaaS buzzwords, rigid boxes, broken mobile tables, and hand-drawn SVG logos. `gemini-design` prevents that by enforcing a consultative 4-phase workflow grounded in real computed-DOM measurements, 24 production brand systems, 223 modular component blueprints, and a strict binary audit gate—with **zero forced package dependencies**.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Workflow Overview](#workflow-overview)
- [Project Structure](#project-structure)
- [Customizing Your Taste Profile](#customizing-your-taste-profile)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License & Acknowledgements](#license--acknowledgements)

---

## Features

- **Consultative Theme Gate Before Coding:** Auto-detects your framework and styling stack first, asks 2–4 targeted questions, then proposes **2–3 contrasting theme directions** for sign-off before writing full UI code.
- **24 Real Brand Design Systems (`design-systems/`):** Tokenized design references including `apple`, `linear.app`, `stripe`, `vercel`, `notion`, `supabase`, `airbnb`, `figma`, `claude`, `wise`, `ferrari`, `raycast`, and more.
- **10 Expressive Color Worlds & 8 Style Packs:** Anti-mode-collapse color matrices ([`references/DESIGN-GRAMMAR.md`](references/DESIGN-GRAMMAR.md)) paired with orthogonal surface/radius packs (`Clean`, `Brutal`, `Glass`, `Retro 98`, `8-bit`, `Soft`, `Swiss`, `Luxe` in [`references/STYLE-PACKS.md`](references/STYLE-PACKS.md)).
- **28 Curated Lego Blueprints + 195 `goodui.dev` Components (`templates/`):** Modular interactive primitives (tactile buttons, `Hold-to-Confirm`, drawers, command palettes, live chart indicators, Web Audio micro-sounds) with progressive-disclosure summaries.
- **Zero Forced Dependencies by Default:** Translates tokens, physics curves, state machines, and ARIA contracts natively into React, Vue, Svelte, Astro, Blade, Flutter, or vanilla CSS/JS via Mode A Blueprint Translation ([`references/LEGO-ADAPTATION.md`](references/LEGO-ADAPTATION.md)).
- **6 Live Computed-DOM REA Dossiers (`rea/`):** `1440×900` production measurements and screenshots from Apple, Linear, Vercel, Stripe, Raycast, and GoodUI.
- **Token-Efficient Query CLI (`scripts/query_vault.py`):** Stdlib-only Python CLI so agents query compact theme/component summaries instead of loading 4,000+ lines of JSON into context.
- **Binary Anti-Slop Quality Gate ([`SKILL.md`](SKILL.md)):** 25 concrete Yes/No checks covering tactile geometry, color discipline, motion performance, mobile overflow containment (`min-w-0`, `overflow-x-clip`, mobile card tables), and canonical brand SVG icons.
- **Local Visual Catalog Workbench ([`dashboard/serve.py`](dashboard/serve.py)):** Browser UI to inspect all themes, component blueprints, live previews, and showcase galleries locally.

---

## Prerequisites

- **Git** (for cloning or `npx skills` GitHub resolution)
- **Python 3.9+** (standard library only — `scripts/query_vault.py` and `dashboard/serve.py` require **no** `pip install`)
- **Node.js 18+** *(optional — only needed for `npx skills add` CLI installation or running the Playwright DOM capture script `scripts/rea_capture.mjs`)*

---

## Installation

### Option 1: Universal CLI (`npx skills`) — Recommended

Works across Antigravity, Claude Code, Cursor, Codex, OpenCode, and other Agent Skills-compatible tools:

```bash
npx skills add Rafifwd/gemini-design-vault
```

### Option 2: Manual `git clone`

Clone directly into the skills directory used by your agent:

**Global — Antigravity / Universal Agent Skills (`~/.agents/skills/`):**

```bash
git clone https://github.com/Rafifwd/gemini-design-vault.git ~/.agents/skills/gemini-design
```

**Global — Claude Code (`~/.claude/skills/`):**

```bash
git clone https://github.com/Rafifwd/gemini-design-vault.git ~/.claude/skills/gemini-design
```

**Project-local — Cursor (`.cursor/skills/`):**

```bash
git clone https://github.com/Rafifwd/gemini-design-vault.git .cursor/skills/gemini-design
```

### Verify Installation

```bash
python3 ~/.agents/skills/gemini-design/scripts/query_vault.py stats
```

*(Adjust the path if you installed into `~/.claude/skills/gemini-design` or a project-local folder.)*

---

## Usage

### 1. Invoking the Skill in Your Agent

Ask your agent to apply `gemini-design` alongside one of its three entry paths:

- **Path A — Extend an existing codebase (*Code is the Source of Truth*):**
  > Use `gemini-design` Path A to build the new billing settings page matching our existing design tokens and components.

- **Path B — Design from scratch (*Discovery → Theme Proposal Gate → Modular Lego*):**
  > Use `gemini-design` Path B for a personal finance web app (Next.js + Tailwind). Inspect the repo, ask 2–4 questions, propose 2–3 themes, wait for my choice, then build cleanly without adding new UI packages.

- **Path C — Audit and de-slop an existing UI:**
  > Use `gemini-design` Path C to audit `src/components/` against the Anti-Slop Audit Checklist with `file:line` evidence and fix the findings after confirming direction.

### 2. Querying the Vault CLI (`scripts/query_vault.py`)

```bash
# Inventory overview
python3 scripts/query_vault.py stats

# Find themes matching domain/mood
python3 scripts/query_vault.py themes --domain fintech

# Find zero-motion component blueprints
python3 scripts/query_vault.py lego --category buttons --no-motion --limit 3

# Inspect live computed-DOM tokens for a reference site
python3 scripts/query_vault.py rea --site linear
```

Sample output (`themes --domain fintech`):

```text
themes domain=fintech mood=None -> 3 hit(s)
[brand] stripe | Fintech & B2B Payments
  hex: #533AFD #4434D4 #2E2B8C #665EFD #B9B9F9
  ...
  -> design-systems/stripe.md
[world] Forest Volt | Global fintech, modern banking, produk lintas negara
  hex: #E8EBE6 #FFFFFF #163300 #0E0F0C #9FE870
  ...
```

### 3. Opening the Local Visual Catalog

Launch the local studio workbench (runs on `http://127.0.0.1:4173` by default):

```bash
python3 dashboard/serve.py --open
```

Or open `dashboard/index.html` directly via `file://` using the prebuilt `dashboard/vault-snapshot.js`.

---

## Workflow Overview

```text
Fase 0: Stack Discovery ──▶ Fase 1: Grounding & Theme Gate ──▶ Fase 2: Lego Assembly ──▶ Fase 3: Human Iteration
  (detect stack/deps,         (Path A / B / C; lock 1 of         (combine 4 axes + Mode A     (rapid tweaks + Sibling
   2-4 questions)              2-3 theme proposals)               + 25-item audit gate)       Sweep across repo)
```

Every build combines **4 independent axes**:
1. **Color World & Polarity** — Brand `DESIGN.md` or Expressive Color World matching the product domain.
2. **Surface & Geometry Grammar** — Style Pack × Material, strictly separating pill button radii (`--radius-btn`) from card/container radii (`--radius-card`, `--radius-inner`).
3. **2–4 Selective Tactile Components** — Adapted natively from `templates/` without extra runtime libraries.
4. **Domain-Specific Layout Rhythm** — Grounded in live `rea/*.json` measurements and [`references/pages/`](references/pages/landing-page.md).

---

## Project Structure

```text
gemini-design-vault/
├── SKILL.md                  # Primary Agent Skills entry point & workflow protocol (v5.2)
├── README.md                 # Public documentation & install guide
├── LICENSE                   # MIT License
├── AGENTS.md                 # Reference entry schema & vault maintenance rules
├── HANDOFF.md                # Evolution log, backlog, and session starter prompts
├── scripts/
│   ├── query_vault.py        # Stdlib CLI for token-efficient theme/Lego/REA lookups
│   ├── rea_capture.mjs       # Computed-DOM screenshot & token capture script
│   └── fetch_*.py            # Upstream template/design-system sync utilities
├── references/
│   ├── INDEX.md              # Category router for curated rules
│   ├── TASTE-PROFILE.md      # Customizable aesthetic defaults & 16-item Ban List
│   ├── DESIGN-GRAMMAR.md     # 24-brand domain matrix & 10 Expressive Color Worlds
│   ├── STYLE-PACKS.md        # 8 Style Packs × 8 Accent Presets × 4 Material Surfaces
│   ├── LEGO-ADAPTATION.md    # Mode A Blueprint Translation & canonical SVG icon rules
│   ├── components/           # Concrete rules: buttons, forms-inputs, data-viz, navigation, etc.
│   ├── pages/                # Layout rules: landing-page, app-dashboard, motion-slides
│   └── assets/               # Live 1440×900 REA screenshots
├── design-systems/           # 24 real-world DESIGN.md brand references + INDEX.json
├── templates/                # 28 featured Lego blueprints + 195 goodui.dev registry items
├── rea/                      # 6 live computed-DOM JSON dossiers (Apple, Linear, Vercel, etc.)
├── dashboard/                # Local catalog server (serve.py) & static UI (index.html)
└── eval/                     # 7 cross-domain HTML showcase evaluations & RESULTS.md
```

---

## Customizing Your Taste Profile

[`references/TASTE-PROFILE.md`](references/TASTE-PROFILE.md) stores the default aesthetic rules and the 16-item **Personal Anti-Slop Ban List** used whenever a project has no existing brand guideline. Edit this file in your installed copy to tune default typography, surface preferences, or additional ban-list constraints without modifying the core workflow in [`SKILL.md`](SKILL.md).

---

## Limitations

- **Language:** [`SKILL.md`](SKILL.md), [`references/`](references/INDEX.md), [`AGENTS.md`](AGENTS.md), and [`HANDOFF.md`](HANDOFF.md) are authored in Indonesian alongside standard English UI/engineering terminology. Modern AI agents follow these instructions seamlessly regardless of your prompt language.
- **Reference maturity:** 12 reference guides are `ready`, while [`references/components/cards-lists.md`](references/components/cards-lists.md) is `seeded` and [`references/pages/motion-slides.md`](references/pages/motion-slides.md) is currently a `template`.
- **Optional Layer-2 skills:** Companion skills referenced as Layer 2 (`better-ui`, `ui-ux-pro-max`, `ui-craft`) under `~/.agents/skills/` are optional extras; the core skill and vault operate standalone.

---

## Contributing

To contribute new real-world UI references or component rules:
1. Follow the mandatory structured schema in [`AGENTS.md`](AGENTS.md) (include concrete layout spacing, radii, typography, color roles, and states—never bare links).
2. Store local reference screenshots in `references/assets/` using descriptive `kebab-case` filenames and update [`references/INDEX.md`](references/INDEX.md).
3. Regenerate the dashboard snapshot and verify parsers before opening a pull request:
   ```bash
   python3 dashboard/serve.py --snapshot
   ```

---

## License & Acknowledgements

Licensed under the [MIT License](LICENSE).

Modular component blueprints, design-system tokens, and methodology sources inside this vault incorporate and reference open-source work from:
- [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) (brand `DESIGN.md` collection)
- [`goodui.dev`](https://goodui.dev) public component & Web Audio registry
- [`shadcn/ui`](https://ui.shadcn.com), [`Magic UI`](https://magicui.design), [`Motion Primitives`](https://motion-primitives.com), and [`Sonner`](https://sonner.emilkowal.ski)
- Design-craft workflow principles distilled from [Nate Parrott's Claude Design walkthrough](source/youtube-604T-74s3KE-claude-design-fix-ai-slop.md)
