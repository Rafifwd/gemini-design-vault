# HANDOFF — Gemini Design Vault & Skill Evolution

> **Goal:** Membangun *Personal Design Reference Vault* (komponen, halaman, mood board, dan profil selera pribadi) lalu meng-upgrade skill global `gemini-design` agar setiap sesi baru di workspace mana pun otomatis menghasilkan desain anti-AI-slop yang sesuai selera user.

---

## 1. State Faktual & Lokasi File di Mesin Ini

### A. Workspace Ini (`/home/rafif/Projects/gemini-design-vault/`)
- `HANDOFF.md` — Dokumen brief, backlog, dan status terkini (file ini).
- `AGENTS.md` — Aturan kerja agent di workspace ini, termasuk skema wajib entri referensi dan aturan sinkronisasi ke skill global.
- `skill/SKILL.md` — Versi kerja skill `gemini-design` (sudah di-upgrade dengan Reference Router, Jalur C De-Slop, dan Anti-Slop Audit Checklist; ter-sync ke global).
- `source/youtube-604T-74s3KE-claude-design-fix-ai-slop.md` — Transkrip lengkap video Nate Parrott (*"Full Tutorial: How to Fix AI Slop with Claude Design in 40 Minutes"*) sebagai sumber prinsip utama.
- `dashboard/` — Dashboard katalog & monitoring lokal skill `gemini-design` (`serve.py` untuk live server + `index.html` Split-Pane Studio Workbench + `lego-previews.js` dengan live preview interaktif 16 template Lego & 5 specimen REA + fallback snapshot statis `vault-snapshot.js`).
- `rea/` — Dossier computed DOM JSON hasil *live capture* 1440×900 dari situs produksi nyata (`apple.json`, `linear.json`, `vercel.json`, `stripe.json`, `raycast.json`).
- `design-systems/` — 10 sistem `DESIGN.md` brand nyata dari `VoltAgent/awesome-design-md` (`apple`, `stripe`, `linear.app`, `vercel`, `notion`, `supabase`, `airbnb`, `spotify`, `figma`, `claude`) + `INDEX.json`.
- `templates/` — Database 16 template komponen produksi MIT verbatim ("Lego blocks") dari `shadcn-ui/ui`, `magicuidesign/magicui`, `ibelick/motion-primitives`, dan `emilkowalski/sonner` (diindeks di `templates/INDEX.json`).
- `scripts/` — Skrip akuisisi (`rea_capture.mjs`, `fetch_templates.py`, `fetch_design_systems.py`).
- `eval/` — 4 Galeri Live Preview Showcase lintas-domain (`showcase-1-meridian-worlds.html`, `showcase-2-atelier-commerce.html`, `showcase-3-ledger-fintech.html`, `showcase-4-studio-creative.html`, `RESULTS.md`).
- `references/` — Database referensi desain terstruktur:
  - `references/INDEX.md` — Router cepat kategori → file referensi + Lego templates + Design Systems + corpus eksternal.
  - `references/TASTE-PROFILE.md` — Profil selera pribadi (`ready`: prinsip craft + Ban List anti mode-collapse krem+teal).
  - `references/DESIGN-GRAMMAR.md` — Matriks Domain → Suhu Warna & Art Direction + komposisi 60-30-10 (`ready`, disintesis dari `awesome-design-md` + `pbakaus/impeccable`).
  - `references/components/` — Referensi level komponen:
    - `buttons.md` (`ready`), `color-and-interactions.md` (`ready`), `navigation.md` (`ready`), `cards-lists.md` (`seeded`), `forms-inputs.md` (`seeded`), dan `data-viz.md` (`template`).
  - `references/pages/` — Referensi level halaman & format (`landing-page.md` `ready` dari 5 REA live; `app-dashboard.md` & `motion-slides.md` masih `template`).
  - `references/assets/` — 5 screenshot REA live 1440×900 (`rea-apple.png`, `rea-linear.png`, `rea-vercel.png`, `rea-stripe.png`, `rea-raycast.png`).

### B. Path Global & Resource Eksternal yang Sudah Ada di Mesin Ini
> **Catatan:** Jangan menduplikasi isi `better-ui` atau `ui-ux-pro-max` ke workspace ini — cukup panggil sebagai layer referensi kedua.

- **Skill global aktif `gemini-design`:** `/home/rafif/.agents/skills/gemini-design/SKILL.md` (beserta salinan `references/`, `rea/`, `templates/`, dan `design-systems/`)
- **Backup skill global:** `/home/rafif/.agents/skill-backups/gemini-design.bak-20261124-3` (dan `.bak-20261124-2`, `.bak-20261124`)
- **Corpus referensi full-site (`better-ui`, 59 dossier situs):** `/home/rafif/.agents/skills/better-ui/REFERENCE-INDEX.md`
- **Generator aturan & token (`ui-ux-pro-max`):** `/home/rafif/.agents/skills/ui-ux-pro-max/scripts/search.py`
- **Gate produksi UI web (`ui-craft`, WCAG AA, `MASTER.md`, verifikasi browser nyata):** `/home/rafif/.agents/skills/ui-craft/SKILL.md`

---

## 2. Arsitektur & Cara Sinkronisasi ke Skill Global

`gemini-design-vault` berfungsi sebagai **authoring workspace** dan **gudang referensi pribadi**.
Keputusan metode sinkronisasi: **copy, bukan symlink**, agar gate konfirmasi di `AGENTS.md` aturan 4 tetap berlaku (perubahan di vault tidak otomatis menimpa skill global tanpa persetujuan user).

Aturan operasional sync:
1. Pastikan `references/INDEX.md` dan semua file di `references/` rapi.
2. Minta konfirmasi user sebelum menimpa skill global (`AGENTS.md` aturan 4).
3. **Backup skill WAJIB di luar `~/.agents/skills/`** (misalnya ke `/home/rafif/.agents/skill-backups/`). Folder `*.bak*` yang ditaruh di dalam `~/.agents/skills/` akan ikut ter-scan sebagai skill oleh Antigravity dan bisa menimpa/membayangi skill aktif.
4. Jalankan perintah sync di luar sandbox (`BypassSandbox: true`) untuk menyalin `skill/SKILL.md` dan `references/` ke `/home/rafif/.agents/skills/gemini-design/`, lalu verifikasi dengan `diff -r`.

### 2B. Cara Menjalankan Dashboard Katalog Lokal
- **Mode Live Server (direkomendasikan, termasuk cek sync global live):**
  ```bash
  python3 /home/rafif/Projects/gemini-design-vault/dashboard/serve.py --open
  ```
  *(Default berjalan di `http://127.0.0.1:4173`)*
- **Refresh snapshot statis (jika ingin membuka `dashboard/index.html` langsung via `file://`):**
  ```bash
  python3 /home/rafif/Projects/gemini-design-vault/dashboard/serve.py --snapshot
  ```

---

## 3. Status & Backlog Kerja

### Tahap 1 — Isi Profil Selera (`references/TASTE-PROFILE.md`) — `[SELESAI]`
- Terkunci (`ready`): *Crisp, Tactile, Functional* (panutan Linear, Raycast, Vercel, Stripe), mode adaptif (light hangat / dark low-glare), *tinted neutrals* + 1 aksen disiplin, serta *Personal Anti-Slop Ban List* (termasuk bentuk tombol kaku, warna mentah framework, dan motion template AI).

### Tahap 2 — Isi Database Referensi Komponen & Halaman (`references/` + `rea/` + `templates/`) — `[AKTIF — REA & LEGO SEEDED]`
- **Sudah `ready` (dengan bukti REA live & Lego verbatim):**
  - `references/pages/landing-page.md` (5 REA live 1440×900: Apple, Linear, Vercel, Stripe, Raycast + screenshot).
  - `references/components/buttons.md` (pengukuran tombol REA + 4 template Lego `shadcn/ui`, `Magic UI`, `Motion Primitives`).
  - `references/components/navigation.md` (pengukuran header REA + template `Cmd+K`, `Tabs`, `AnimatedBackground`).
  - `references/components/color-and-interactions.md` (disiplin warna/surface + mikro-interaksi).
- **Sudah `seeded`:** `references/components/cards-lists.md`, `references/components/forms-inputs.md` (+ template `Card`, `Badge`, `BentoGrid`, `BorderBeam`, `Input`, `Dialog`, `Disclosure`, `Sonner CSS`).
- **Masih `template`:** `references/components/data-viz.md`, `references/pages/app-dashboard.md`, `references/pages/motion-slides.md`.
- **Status sync:** Sudah disinkronkan (`SKILL.md`, `references/`, `rea/`, `templates/`, dan `design-systems/`) ke `/home/rafif/.agents/skills/gemini-design/` pada **2026-11-24** (`SYNC_V3_OK`) dengan backup di `/home/rafif/.agents/skill-backups/gemini-design.bak-20261124-3`.

### Tahap 3 — Upgrade & Sync `skill/SKILL.md` — `[SELESAI & TER-SYNC]`
- Di-upgrade pada **2026-11-24** (158 baris): menambahkan **Langkah 0: Reference Router** + **Domain-Matched Art Direction** (`DESIGN-GRAMMAR.md` + `design-systems/`), perakitan Lego (`templates/`), prioritas sumber, **Jalur C: De-Slop**, dan **Anti-Slop Audit Checklist (Biner Ya/Tidak)**.
- Disinkronkan ke `/home/rafif/.agents/skills/gemini-design/` lewat metode **copy** dengan backup terbaru di `/home/rafif/.agents/skill-backups/gemini-design.bak-20261124-3`.

### Tahap 4 — Galeri 4 Live Preview Showcase Lintas-Domain — `[SELESAI]`
- Lihat ringkasan di [`eval/RESULTS.md`](./eval/RESULTS.md).
- File eval lama dibersihkan dan diganti 4 showcase produksi yang sangat bervariasi (`Meridian 4-Worlds`, `KOVA Audio Commerce`, `Valence Fintech Treasury`, `MONO // STUDIO Creative`), lolos audit sintaks JS, anti-slop, dan aturan geometri radius kontainer.

---

## 4. Starter Prompt untuk Sesi Baru

Buka sesi baru di direktori `/home/rafif/Projects/gemini-design-vault` (atau workspace project lain karena skill global sudah aktif), lalu pakai salah satu prompt berikut:

**Opsi 1 — Setor referensi nyata secara organik (Tahap 2 lanjutan):**
> Baca `HANDOFF.md` dan `AGENTS.md`. Aku mau setor referensi nyata ke vault untuk `[landing-page / cards-lists / navigation / data-viz / motion-slides]`: [tempel URL / path screenshot / deskripsi]. Ekstrak memakai skema wajib di `AGENTS.md`, simpan ke file referensi yang tepat, update `references/INDEX.md`, lalu minta konfirmasiku sebelum sync ke global.

**Opsi 2 — Pakai skill di project nyata dengan Jalur C (De-Slop):**
> Gunakan skill `gemini-design` Jalur C untuk merapikan UI di `[path file/komponen]` yang masih terasa seperti AI slop. Audit dulu pakai Anti-Slop Audit Checklist dengan bukti `file:line`, konfirmasi 1–2 poin denganku sebelum refactor.

**Opsi 3 — Revisi skill dari temuan visual eval / pemakaian nyata:**
> Baca `HANDOFF.md` dan `eval/RESULTS.md`. Setelah kucek di browser, ada catatan perbaikan pada `[E1/E2/E3 atau pemakaian nyata]`: [tulis catatan visual]. Tolong perbarui `skill/SKILL.md` atau file `references/` terkait, lalu konfirmasi sebelum sync ulang ke skill global (backup ke `~/.agents/skill-backups/`).
