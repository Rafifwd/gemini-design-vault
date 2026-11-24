# Reference Index — Gemini Design Vault

Router cepat untuk memilih referensi tanpa membaca seluruh vault. Agent membaca `TASTE-PROFILE.md` terlebih dahulu, lalu membuka hanya file di bawah ini yang sesuai dengan kebutuhan tugas.

## Layer 1 — Referensi Pribadi & REA Produksi (Vault Ini)

| Kategori | File | Status | Ringkasan Isi |
| --- | --- | --- | --- |
| Selera Pribadi | [TASTE-PROFILE.md](./TASTE-PROFILE.md) | `ready` | Prinsip Crisp & Tactile + Ban List anti mode-collapse (tunduk pada matriks domain) |
| Tata Bahasa Desain | [DESIGN-GRAMMAR.md](./DESIGN-GRAMMAR.md) | `ready` | Matriks domain -> suhu warna & art direction (`Persuade`/`Operate`/`Read`/`Experience`), komposisi 60-30-10 |
| Komponen: Button | [buttons.md](./components/buttons.md) | `ready` | Aturan bentuk + tabel pengukuran REA (Apple/Linear/Vercel/Stripe/Raycast) + 4 template Lego |
| Komponen: Warna & Interaksi | [color-and-interactions.md](./components/color-and-interactions.md) | `ready` | Tinted neutrals, 1-accent discipline, crisp micro-interactions & curated frontend primitives |
| Komponen: Navigasi | [navigation.md](./components/navigation.md) | `ready` | Pengukuran header REA (44px–76px, blur 20px) + template Cmd+K, Tabs & Sliding Pill |
| Komponen: Card & List | [cards-lists.md](./components/cards-lists.md) | `seeded` | Observasi surface REA Linear/Raycast + template Card, Badge, Bento Grid, Border Beam |
| Komponen: Form & Input | [forms-inputs.md](./components/forms-inputs.md) | `seeded` | Pola form + template Input, Dialog, Disclosure & Sonner toast CSS |
| Komponen: Data Viz | [data-viz.md](./components/data-viz.md) | `template` | KPI card, chart, tabel, sources mode |
| Halaman: Landing Page | [landing-page.md](./pages/landing-page.md) | `ready` | 5 dossier REA live lengkap (Apple, Linear, Vercel, Stripe, Raycast) + screenshot |
| Halaman: App & Dashboard | [app-dashboard.md](./pages/app-dashboard.md) | `template` | Shell aplikasi, workspace layout, dashboard dinamis |
| Format: Motion & Slides | [motion-slides.md](./pages/motion-slides.md) | `template` | Storyboard, pacing baca manusia, motif animasi, slide non-korporat |
| Aset Visual (REA) | [assets/](./assets/) | `ready` | 5 screenshot live 1440×900 (`rea-apple.png`, `rea-linear.png`, `rea-vercel.png`, `rea-stripe.png`, `rea-raycast.png`) |

> Status: `template` (belum diisi) → `seeded` (1–2 entri) → `ready` (3+ entri teruji / bukti REA nyata).

---

## Database Brand Art-Direction & Template Komponen

- **10 Sistem `DESIGN.md` Brand Nyata (`VoltAgent/awesome-design-md`):** [`../design-systems/INDEX.json`](../design-systems/INDEX.json) (`apple`, `stripe`, `linear.app`, `vercel`, `notion`, `supabase`, `airbnb`, `spotify`, `figma`, `claude`)
- **16 Template Komponen Lego Verbatim (MIT):** [`../templates/INDEX.json`](../templates/INDEX.json) (`shadcn-ui/ui`, `magicuidesign/magicui`, `ibelick/motion-primitives`, `emilkowalski/sonner`)
- **Raw REA Computed DOM JSON (1440×900):** [`../rea/`](../rea/) (`apple.json`, `linear.json`, `vercel.json`, `stripe.json`, `raycast.json`)

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
