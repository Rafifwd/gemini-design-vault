# Reference Index — Gemini Design Vault

Router cepat untuk memilih referensi tanpa membaca seluruh vault. Agent membaca `TASTE-PROFILE.md` terlebih dahulu, lalu membuka hanya file di bawah ini yang sesuai dengan kebutuhan tugas.

## Layer 1 — Referensi Pribadi & REA Produksi (Vault Ini)

| Kategori | File | Status | Ringkasan Isi |
| --- | --- | --- | --- |
| Selera Pribadi | [TASTE-PROFILE.md](./TASTE-PROFILE.md) | `ready` | Prinsip Crisp & Tactile + Ban List anti mode-collapse (tunduk pada matriks domain) |
| Tata Bahasa Desain | [DESIGN-GRAMMAR.md](./DESIGN-GRAMMAR.md) | `ready` | Matriks 24 brand -> suhu warna, 10 Expressive & Vivid Color Worlds, komposisi 60-30-10 |
| Style Packs & Material | [STYLE-PACKS.md](./STYLE-PACKS.md) | `ready` | 8 Style Packs (`Clean`, `Brutal`, `Glass`, `Retro 98`, `8-bit`, `Soft`, `Swiss`, `Luxe`) × 8 Aksen × 4 Material (`goodui.dev` REA) |
| Komponen: Button | [buttons.md](./components/buttons.md) | `ready` | 8 pola tombol (tactile, hold-to-confirm, liquid glass, stateful, rainbow, Web Audio) + REA + 10 Lego |
| Komponen: Warna & Interaksi | [color-and-interactions.md](./components/color-and-interactions.md) | `ready` | Tinted neutrals, 1-accent discipline, crisp micro-interactions & curated frontend primitives |
| Komponen: Navigasi | [navigation.md](./components/navigation.md) | `ready` | Pengukuran header REA (44px–76px, blur 20px) + template Cmd+K, Tabs & Sliding Pill |
| Komponen: Card & List | [cards-lists.md](./components/cards-lists.md) | `seeded` | Observasi surface REA Linear/Raycast + template Card, Badge, Bento Grid, Border Beam |
| Komponen: Form & Input | [forms-inputs.md](./components/forms-inputs.md) | `seeded` | Pola form + template Input, Dialog, Disclosure & Sonner toast CSS |
| Komponen: Data Viz | [data-viz.md](./components/data-viz.md) | `template` | KPI card, chart, tabel, sources mode |
| Halaman: Landing Page | [landing-page.md](./pages/landing-page.md) | `ready` | 6 dossier REA live lengkap (Apple, Linear, Vercel, Stripe, Raycast, GoodUI) + screenshot |
| Halaman: App & Dashboard | [app-dashboard.md](./pages/app-dashboard.md) | `template` | Shell aplikasi, workspace layout, dashboard dinamis |
| Format: Motion & Slides | [motion-slides.md](./pages/motion-slides.md) | `template` | Storyboard, pacing baca manusia, motif animasi, slide non-korporat |
| Aset Visual (REA) | [assets/](./assets/) | `ready` | 6 screenshot live 1440×900 (`rea-apple.png`, `rea-linear.png`, `rea-vercel.png`, `rea-stripe.png`, `rea-raycast.png`, `rea-goodui.png`) |

> Status: `template` (belum diisi) → `seeded` (1–2 entri) → `ready` (3+ entri teruji / bukti REA nyata).

---

## Database Brand Art-Direction & Template Komponen

- **24 Sistem `DESIGN.md` Brand Nyata (`VoltAgent/awesome-design-md`):** [`../design-systems/INDEX.json`](../design-systems/INDEX.json) (`apple`, `stripe`, `linear.app`, `vercel`, `notion`, `supabase`, `airbnb`, `spotify`, `figma`, `claude`, `wise`, `miro`, `mistral.ai`, `theverge`, `wired`, `ferrari`, `lamborghini`, `raycast`, `framer`, `webflow`, `posthog`, `zapier`, `revolut`, `nike`)
- **28 Template Komponen Lego Unggulan (Dashboard Studio Workbench):** [`../templates/INDEX.json`](../templates/INDEX.json) (`shadcn-ui/ui`, `magicuidesign/magicui`, `ibelick/motion-primitives`, `emilkowalski/sonner`, + 12 blok unggulan `goodui.dev`)
- **195 Item Public Registry Lengkap (`goodui.dev` — Free Public Registry):** [`../templates/goodui/INDEX.json`](../templates/goodui/INDEX.json) (Buttons, Cards, Charts, Inputs, Backgrounds, Motion Overlays, AI UI, Scheduler, + 24 Web Audio UI Sounds)
- **Raw REA Computed DOM JSON (1440×900):** [`../rea/`](../rea/) (`apple.json`, `linear.json`, `vercel.json`, `stripe.json`, `raycast.json`, `goodui.json`)

---

## Layer 2 — Corpus Eksternal di Mesin Ini (Read-Only)

Gunakan saat butuh inspirasi struktur *full-site* atau token sistem warna/tipografi tambahan di luar koleksi pribadi:

- **59 Analisis Situs Lengkap (`better-ui`):** `/home/rafif/.agents/skills/better-ui/REFERENCE-INDEX.md`
  - Bucket tersedia: *Commerce & product retail*, *Agency, studio & portfolio*, *SaaS, fintech & tech product*, *Editorial, media & brand campaign*, *Hospitality, food & lifestyle*, *Experimental & WebGL*, *Institutional & professional services*.
- **Generator Aturan & Token (`ui-ux-pro-max`):**
  ```bash
  python3 /home/rafif/.agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Product>"
  ```
- **Gate Produksi UI Web (`ui-craft`):** `/home/rafif/.agents/skills/ui-craft/SKILL.md`
