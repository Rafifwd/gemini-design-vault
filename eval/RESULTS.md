# Galeri Live Preview Showcase (`gemini-design` v3)

> **Tanggal:** 2026-11-24  
> **Skill:** [`SKILL.md`](../SKILL.md) + 24 sistem [`design-systems/*.md`](../design-systems/INDEX.json) + 28 Lego [`templates/`](../templates/INDEX.json) + 195 blok [`goodui.dev`](../templates/goodui/INDEX.json) + [`DESIGN-GRAMMAR.md`](../references/DESIGN-GRAMMAR.md) + [`STYLE-PACKS.md`](../references/STYLE-PACKS.md).  
> **Pembersihan:** File eval lama (`e1`, `e2`, `e3`, `slop-fixture`) telah dibuang agar tab **Eval & Live Preview** hanya menampilkan 7 showcase lintas-domain kelas produksi.

---

## Ringkasan 7 Showcase Produksi

| Kasus | Prompt / Domain | Jalur / Sistem `DESIGN.md` | Status | File Output |
| --- | --- | --- | --- | --- |
| **S1** | **Meridian System** — Engine 4 World Live Switcher + `⌘K` + Bento + Sonner | Experience (`linear` / `apple` / `stripe` / `figma`) | **Lolos (Radius Fixed)** | [`showcase-1-meridian-worlds.html`](./showcase-1-meridian-worlds.html) |
| **S2** | **KOVA Audio (Model M1)** — Storefront hardware akustik + SVG monitor + Cart Drawer | Experience / Persuade (`apple.md` + `airbnb.md`) | **Lolos** | [`showcase-2-atelier-commerce.html`](./showcase-2-atelier-commerce.html) |
| **S3** | **Valence Treasury** — Workspace B2B multi-currency + Cashflow SVG + Instant Payout + Receipt Inspector | Operate (`stripe.md` + `vercel.md`) | **Lolos** | [`showcase-3-ledger-fintech.html`](./showcase-3-ledger-fintech.html) |
| **S4** | **MONO // STUDIO** — Portofolio studio kreatif + pastel story blocks + Spotify Dark toggle + Case Modal | Persuade / Experience (`figma.md` + `spotify.md`) | **Lolos** | [`showcase-4-studio-creative.html`](./showcase-4-studio-creative.html) |
| **S5** | **PRISM // CHROMATIC WORLDS** — 5 Dunia Warna Ekspresif + Tactile Lab (`Hold-to-Confirm`, `Liquid Glass`, `Stateful`, `Rainbow`, `Web Audio`) | Persuade / Experience (`wise` + `mistral.ai` + `theverge` + `goodui`) | **Lolos** | [`showcase-5-prism-festival.html`](./showcase-5-prism-festival.html) |
| **S6** | **VELOCE // ATELIER** — Konfigurator Hypercar 4-Livery + Aero CFD + `Liquid Glass` Toolbar + `Hold-to-Reserve` + Web Audio | Experience / Persuade (`ferrari.md` + `lamborghini.md` + `apple.md`) | **Lolos** | [`showcase-6-monolith-motorsport.html`](./showcase-6-monolith-motorsport.html) |
| **S7** | **STYLE PACKS // MAKE IT YOURS** — Studio Tema Ortogonal `8 Style Packs × 8 Aksen × Light/Dark` + Floating Capsule & CSS Exporter | Operate / Experience ([`STYLE-PACKS.md`](../references/STYLE-PACKS.md) + `goodui.dev` REA) | **Lolos** | [`showcase-7-style-packs-studio.html`](./showcase-7-style-packs-studio.html) |

---

## Perbaikan Geometri & Verifikasi Otomatis

- **Perbaikan bug shape di `S1`:** Memisahkan `--radius-btn` (`980px`/`9999px` khusus tombol/badge satu baris) dari `--radius-inner` (`6px`–`10px` untuk `.chart-bars`, `.matrix-grid`, `.matrix-hl`, dan `.deck-box`) sehingga tidak ada lagi kotak kontainer multi-baris berbentuk kapsul raksasa.
- **Aturan Geometri Global pada `S1`–`S7`:** Radius `980px`/`9999px` dibatasi ketat hanya untuk tombol satu-baris, pill filter, badge, dan kapsul switcher; semua panel, chart wrapper, modal, dan drawer memakai radius konsentris terukur (dan mutlak `0px` pada `retro98`, `pixel`, `swiss`).
- **Hasil Verifikasi (`node --check` + Audit Anti-Slop):**
  - `showcase-1-meridian-worlds.html`: `1.338` baris (`51.002` B) — `emojis=0`, `node --check` OK.
  - `showcase-2-atelier-commerce.html`: `3.139` baris (`113.660` B) — `emojis=0`, `node --check` OK.
  - `showcase-3-ledger-fintech.html`: `3.795` baris (`128.643` B) — `emojis=0`, `node --check` OK.
  - `showcase-4-studio-creative.html`: `2.907` baris (`101.492` B) — `emojis=0`, `node --check` OK.
  - `showcase-5-prism-festival.html`: `3.580` baris (`120.361` B) — `emojis=0`, `node --check` OK.
  - `showcase-6-monolith-motorsport.html`: `3.859` baris (`141.658` B) — `emojis=0`, `node --check` OK.
  - `showcase-7-style-packs-studio.html`: `3.633` baris (`129.137` B) — `emojis=0`, `node --check` OK.
