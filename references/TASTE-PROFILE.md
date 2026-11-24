# Personal Taste Profile

> **Status:** `ready` — dikunci sebagai jangkar prinsip craft; untuk pilihan warna & art direction, selalu tunduk pada matriks domain di [`DESIGN-GRAMMAR.md`](./DESIGN-GRAMMAR.md) agar tidak jatuh ke satu palet seragam.

## 1. Arah Estetika & Produk Panutan
- **3 kata yang menggambarkan selera visualku:** `Crisp`, `Tactile`, `Functional`
- **Produk / website panutan (diturunkan ke sistem nyata di `design-systems/`):**
  - **Apple (`apple.md`)** — pure gallery white `#FFFFFF`, chrome tipis yang surut, dan produk memimpin.
  - **Stripe (`stripe.md`)** — ice-slate `#F6F9FC`, navy ink `#0D253D`, weight tipis `300`, dan `tabular-nums`.
  - **Linear (`linear.app.md`) & Raycast** — obsidian low-glare `#010102` / `#0F1011`, kontrol *tactile*, dan *keyboard-first craft*.
  - **Vercel (`vercel.md`)** — kontras monokrom tajam, hairline `1px`, dan skala kontrol terpisah dari hero.
  - **Figma (`figma.md`) & Claude (`claude.md`)** — bukti bahwa warna blok ekspresif maupun editorial hangat punya tempatnya sendiri sesuai domain.

## 2. Tipografi
- **Karakter font heading yang disuka:** Neo-grotesk / geometric sans presisi (`Plus Jakarta Sans`, `Geist`, `Space Grotesk`), atau editorial serif (`Newsreader`, `Instrument Serif`) bila domainnya editorial/konten — selalu dengan *negative letter-spacing* terkalibrasi pada display (`-0.02em` s/d `-0.04em`).
- **Karakter font UI/body & angka:** Bersih untuk keterbacaan tinggi; gunakan monospace rapi (`Geist Mono` / `JetBrains Mono`) dan wajib `tabular-nums` untuk angka, nominal uang, tabel, dan KPI.
- **Font yang DILARANG kecuali diminta:** Font display klise AI, kombinasi font terlalu ramai (`>2` keluarga font dalam satu sistem), atau `Inter` default tanpa penalaan tracking/weight.

## 3. Warna, Kontras & Surface (Domain-Matched, Anti-Krem-Bias)
- **Aturan Wajib:** **Jangan memaksakan satu palet ("krem hangat + teal") ke semua proyek.** Pilih suhu canvas dan palet berdasarkan domain produk menggunakan [`DESIGN-GRAMMAR.md`](./DESIGN-GRAMMAR.md) dan [`../design-systems/INDEX.json`](../design-systems/INDEX.json):
  - **Klinik / Medis / Konsumen Modern:** Pure gallery white `#FFFFFF` + cool parchment `#F5F5F7` + 1 aksen klinis tajam (misal cobalt `#0066CC`).
  - **Fintech / B2B:** Pure `#FFFFFF` + ice-blue `#F6F9FC` + deep navy ink `#0D253D` + aksen tegas (`#533AFD` / emerald).
  - **Industri / Gudang / Operasional:** Cool utilitarian grey `#FAFAFA` + charcoal `#171717` + 1 warna sinyal fungsional.
  - **DevTools / AI Workbench:** Dark obsidian `#010102` / `#171717` + hairline `0.08` + 1 aksen bedah.
  - **Editorial / Kuliner / Craft:** *Barulah* warm paper `#FAF9F5` / `#F5F0E8` + terracotta `#CC785C` relevan dipakai.
- **Surface & pemisahan elemen:** Kontras latar bertahap yang halus, *hairline border* transparan `1px`, serta *spacing* dan alignment yang ketat — bukan shadow tebal atau card bersarang.

## 4. Density & Layout
- **Sesuaikan dengan Mode Permukaan (`Persuade` / `Operate` / `Read` / `Experience`):** Padat-terstruktur untuk *Operate* (tabel, admin, dashboard); lega-ekspresif untuk *Persuade* (landing page, showcase).
- **Prinsip komposisi:** Utamakan asimetri fungsional, 1 titik fokus jelas per viewport, dan hindari grid 3-kotak simetris yang membosankan.

## 5. Micro-Interaction & Motion
- **Karakter animasi:** **Tactile & Crisp + Clean Functional Minimal** — cepat (`120ms–180ms ease-out`), responsif (`active:scale-[0.98]`, *shared-layout sliding pill*, *tactile bevel*), hormati `prefers-reduced-motion`.
- **Untuk video/motion storytelling:** Pacing baca santai, satu fokus berubah dalam satu waktu, dan motif visual berkesinambungan.

## 6. Personal Anti-Slop Ban List
Daftar pola AI slop yang **HARUS DIHINDARI** secara default:
- [x] Palet seragam "krem + teal" yang dipaksakan ke semua domain tanpa mencocokkan karakter produk (mode collapse)
- [x] Gradien ungu/neon generik pada hero, button, atau card
- [x] Card bersarang dengan border + shadow + garis aksen berwarna di tepi kartu tanpa fungsi
- [x] Divider horizontal di setiap baris list yang sebenarnya cukup dipisah spacing
- [x] Emoji sebagai pengganti ikon UI
- [x] Monogram/logo karangan sebagai identitas brand
- [x] Slide deck bergaya template korporat kaku (header bar + 3 bullet box sejajar)
- [x] Tombol kotak kaku generik tanpa *tactile cues*, proporsi optik, atau *press feedback*
- [x] Warna mentah default framework (`blue-600`, `purple-500`, hitam `#000` + gradien neon) dan penyebaran warna aksen ke terlalu banyak elemen sekaligus
- [x] Motion template AI (`fade-in + translateY` seragam di semua blok, `pulse/glow/float` tanpa fungsi, transisi lambat yang menghambat interaksi)
