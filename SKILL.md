---
name: gemini-design
description: Workflow desain anti-AI-slop yang konsultatif untuk website, app, dashboard, slide, dan motion. Deteksi stack & konteks project, riset lalu rekomendasikan 2–3 arah tema (warna, material, tipografi, komponen) dari vault, kunci tema bersama user, lalu rakit UI modular seperti Lego dari resource vault tanpa memaksa dependency baru. Tiga jalur - A codebase eksisting, B green-field, C de-slop UI eksisting. Pakai saat mendesain dari nol, merancang fitur, memilih tema, atau saat UI terasa generik/AI slop. Membaca vault selera pribadi (references/TASTE-PROFILE.md + INDEX.md) sebelum mendesain.
user-invocable: true
disable-model-invocation: false
---

# Gemini Design (v5.2)

Protokol, arahan, dan penyedia resource agar AI membuat UI/UX yang tidak terasa AI slop: bertanya dulu, meriset tema yang cocok dengan konteks project, merekomendasikan, lalu merakit dari bahan modular vault.

## Prinsip Inti: "You Get Out What You Put In"

AI slop muncul saat model diberi konteks kosong lalu menciptakan gaya dari nol, dan hasilnya collapse ke gaya default yang generik. Konteks project, referensi visual, dan codebase adalah bahan yang membuat desain terasa autentik. Vault ini adalah **bahan modular (*ingredients*)**, bukan template paketan.

---

## Langkah 0 — Reference & Tool Router (Wajib, Sebelum Fase Apa Pun)

Path relatif terhadap folder `SKILL.md` (`<skill_dir>`; global: `~/.agents/skills/gemini-design/`, atau root repo ini).

1. **Baca selalu:** `references/TASTE-PROFILE.md` dan `references/INDEX.md`. Dari `INDEX.md`, buka hanya file berstatus `seeded` atau `ready` yang relevan.
2. **Cari cepat, jangan dump JSON:** `python3 <skill_dir>/scripts/query_vault.py themes|lego|rea|stats` mengembalikan ringkasan padat dari 24 brand, 10 Color World, 8 Style Pack, 28 + 195 Lego, dan 6 dossier REA. Jangan membaca `templates/goodui/INDEX.json` (4.000+ baris) langsung.
3. **Buka bila dibutuhkan (disclosed):** `references/DESIGN-GRAMMAR.md` (matriks domain → warna), `references/STYLE-PACKS.md` (geometri/material), `references/LEGO-ADAPTATION.md` (wajib sebelum merakit kode), plus `design-systems/*.md`, `rea/*.json`, `templates/`.
4. **Layer 2 (opsional, bila terpasang) jika vault belum punya contoh:** `~/.agents/skills/better-ui/REFERENCE-INDEX.md` dan `python3 ~/.agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Product>"`.
5. **Prioritas sumber (tertinggi ke terendah):** Instruksi eksplisit user > Brand / design system / codebase eksisting > `TASTE-PROFILE.md` > Referensi vault > Corpus eksternal. Taste profile adalah *default* saat konteks kosong dan tidak menimpa design system produk yang sudah ada.
6. **HARD vs SOFT:**
   - **HARD:** Ban List `TASTE-PROFILE.md` §6 dan `Anti-Slop Audit Checklist` di bawah.
   - **SOFT:** Produk panutan (Linear, Raycast, Vercel, Stripe, Ferrari, Wise, GoodUI, dll.) adalah arah untuk diterjemahkan sesuai konteks, bukan untuk di-clone.

---

## Fase 0 — Project, Stack & Intent Discovery

**Auto-detect dulu, tanya kemudian.** Jika ada workspace project, baca `package.json`, `composer.json`, `pubspec.yaml`, config styling/UI, dan komponen eksisting untuk mengetahui framework, sistem styling, icon library, dan dependency yang sudah ada.

Lalu ajukan **2–4 pertanyaan terarah** (gunakan `ask_question`; lewati yang sudah terjawab oleh repo atau `TASTE-PROFILE.md`; user boleh melewatkan):

1. **Tujuan & audiens:** masalah apa yang diselesaikan dan siapa penggunanya?
2. **Jangkar referensi & vibe:** ada produk sejenis, screenshot, atau brand guideline?
3. **Lingkup & format:** web app, landing, dashboard, mobile, slide, atau motion; layar apa saja?
4. **Kebijakan dependency:** default *zero forced dependencies* (adaptasi ke stack yang ada); catat library yang boleh ditambah bila user mengizinkan.

**Selesai bila** ini tercatat: jalur masuk (`A`/`B`/`C`), stack & sistem styling, mode permukaan (`Persuade` / `Operate` / `Read` / `Experience`), dan kebijakan dependency. Pada Jalur C, cukup 1–2 poin konfirmasi cepat.

---

## Fase 1 — Grounding Konteks & Riset Tema

### Jalur A: Codebase Eksisting (*Code is the Source of Truth*)
1. Baca kode sumber lebih dulu; jangan mengarang design system terpisah.
2. Rekonstruksi baseline UI aktual (token, tipografi, spacing, pola komponen).
3. Variasikan dari baseline itu. Bila user meminta revamp visual, jalankan Theme Proposal Gate di bawah dengan baseline sebagai jangkar.
4. Implementasikan di konteks yang sama setelah arah disetujui.

### Jalur B: Green-Field / Modul Baru
1. **Jangkar referensi:** pakai screenshot, mood board, atau pola UI familiar (inbox, kalender, editor) sebagai jalan pintas kegunaan.
2. **Wireframe sebelum styling** untuk layout atau alur kompleks.
3. **Riset tema:** jalankan `query_vault.py themes --domain <domain> --mood <mood>`, baca `DESIGN-GRAMMAR.md` dan `STYLE-PACKS.md`, tambah Layer 2 untuk domain yang belum tercakup.
4. Jalankan **Theme Proposal Gate**.
5. Untuk deck panjang, app multi-layar, atau motion, preview arah pada 1–2 layar representatif sebelum membangun semuanya.

### Theme Proposal Gate (Wajib di Jalur B dan revamp Jalur A, sebelum UI penuh)

Sajikan **2–3 arah tema** (1 rekomendasi utama sesuai konteks + 1–2 alternatif kontras). Tiap arah ringkas dan memuat lima hal:

1. **Nama arah & alasan domain:** mengapa cocok untuk produk dan audiens ini.
2. **Color World & polarity:** dari 24 brand atau 10 Expressive Color World, dengan 4–5 hex kunci.
3. **Style Pack, geometri & tipografi:** `--radius-btn` dipisah dari `--radius-card` / `--radius-inner`; ≤2 keluarga font.
4. **Rencana 2–4 Lego:** dipilih via `query_vault.py lego`, beserta cara adaptasi ke stack user tanpa dependency baru.
5. **Layout rhythm:** dari dossier REA / `better-ui` yang paling dekat.

**Selesai bila** user memilih satu tema, meminta remix lintas-opsi (mis. Color World A + Style Pack B), atau mengonfirmasi arah final. Jangan menulis UI penuh sebelum itu.

### Jalur C: De-Slop Desain Eksisting
- **Trigger:** user meminta merapikan, me-de-slop, atau menghilangkan kesan AI dari UI yang sudah ada.
1. Baca kode aktual (HTML/JSX/CSS) lebih dulu.
2. Audit dengan `Anti-Slop Audit Checklist`; sertakan bukti `file:line`, dikelompokkan per **Bentuk**, **Warna**, **Motion**, **Layout & Surface**, **Ikon, Brand & Tipografi**, **Stack & Modularitas**.
3. Konfirmasi 1–2 poin dengan user (mis. warna brand atau struktur utama dipertahankan?).
4. Tawarkan 2–3 arah perbaikan singkat **atau** langsung lakukan refactor bedah bila diminta, dengan menghormati design system yang ada.
5. Verifikasi ulang dengan checklist biner (`sebelum → sesudah`); untuk UI web produksi lanjutkan dengan `ui-craft`.

---

## Fase 2 — Modular Lego Assembly

Rakit dari **4 sumbu independen** yang sudah disepakati di Fase 1:

1. **Color World & Polarity** (brand / Expressive Color World).
2. **Surface & Geometry Grammar** (Style Pack × Material; token radius terpisah untuk tombol dan kontainer).
3. **2–4 Selective Tactile Components per layar** dari `templates/` (mis. 1 `Hold-to-Confirm` untuk aksi destruktif + 1 `StatefulButton` untuk submit + `NumberFlow` untuk KPI).
4. **Domain-Specific Layout Rhythm** (REA, `better-ui`, `references/pages/*`).

**Aturan merakit:**
- Baca `references/LEGO-ADAPTATION.md` dan catat mode: **Mode A Blueprint Translation (default)** menerjemahkan token, timing, state machine, dan ARIA ke stack project; **Mode B Direct Drop-in** hanya bila stack sudah cocok atau user mengizinkan install.
- Skin ulang setiap Lego dengan token tema yang dikunci; buang warna demo bawaan.
- **Sudut pandang copy (*Business-to-User Voice*):** Tulis copy dari suara pemilik bisnis/produk ke pengguna akhir (fasilitas, lokasi, manfaat nyata), bukan nada developer menjual software (*"dalam hitungan detik"*, *"real-time"*, *"tanpa antre"*).
- **Smoothness & perceived performance:** Pakai transisi spesifik (`transition-colors`, `transform`, `opacity`), bukan `transition-all` pada grid/list banyak item; hindari `backdrop-blur` berat di sticky header pada halaman panjang; sediakan skeleton loading pada navigasi SSR dan cache/SWR + `AbortController` pada switcher data.
- **Ikon brand & kompleks:** Inline SVG manual hanya untuk primitif geometris sederhana (panah, centang, plus, silang). Logo brand (WhatsApp, Google, dll.) wajib memakai **raw canonical SVG** (Simple Icons / brand kit); ikon UI kompleks (gear/settings, dll.) ambil dari library proyek atau raw SVG Lucide/Tabler — jangan digambar dari ingatan LLM.
- **Ketahanan lintas-perangkat & filter instan:** Cegah *horizontal overflow* mobile dengan `min-w-0` pada `<main>` flex/grid + `overflow-x-clip` pada shell; pecah tabel `>3` kolom ke *mobile card view* (`md:hidden`) dan tumpuk sel multi-aksi di `< sm`. Untuk tabel/dashboard berdataset kecil–menengah (`≤500` baris), lakukan filter/tab/sort instan di client (`useMemo` + `history.replaceState`), bukan round-trip SSR per klik.
- Kategori `blocks` hanya inspirasi struktur; rakit ulang dari komponen kecil.
- Dilarang menyalin utuh satu `eval/showcase-*.html`, satu brand utuh tanpa adaptasi, atau satu blok `templates/goodui/blocks/*`.
- **Eksplorasi lebar:** bila user meminta eksplorasi konsep/mockup, atau belum yakin arah visual, hasilkan 3–5 opsi yang benar-benar berbeda (font, palet, struktur) berdampingan dan jangan menimpa opsi lama; saat user menyukai potongan beberapa opsi, buat 3–5 variasi rekombinasi. Bila tema sudah dikunci di Fase 1, bangun langsung implementasi terarah.
- **Semua** keluaran mematuhi constraint HARD.

---

## Fase 3 — Iterasi Human-in-the-Loop ("Backseat Driving")

1. **Terima arahan singkat atau tidak rapi** (*"lebih padat, hapus subtitle, izinkan teks wrap, hilangkan divider"*) dan terjemahkan langsung menjadi perubahan konkret.
2. **Kode itu murah; perhatian manusia mahal:** bangun prototipe interaktif cepat agar bisa diklik dan dirasakan.
3. **Jaga satu konteks bersama:** simpan eksplorasi aktif dalam thread yang sama (atau delegasikan variasi paralel ke subagent sambil menjaga hasil terpusat).
4. **Sibling Sweep saat koreksi pola:** Setiap kali user menunjuk satu pola AI slop (mis. pill eyebrow, dot dekoratif, atau validasi native) di satu komponen, grep seluruh proyek untuk pola serupa dan bersihkan semua kemunculannya sekaligus dalam satu putaran.

---

## Workflow Khusus

### A. Dashboard Dinamis
- **Koneksi data langsung:** hubungkan ke sumber nyata (file lokal, query, API, MCP) dan pisahkan lapisan fetch dari visualisasi agar bisa di-reload. Pola komponen: `references/components/data-viz.md`, `references/pages/app-dashboard.md`.
- **Sources Mode:** sediakan cara memeriksa asal angka dan logika agregasi di balik tiap metrik.
- **Berani eksploratif:** bila user hanya memberi dataset, tawarkan pemotongan data dan insight tak terduga selain KPI dasar.

### B. Motion Graphics & Data Storytelling
- **Storyboard statis + 2–3 arah visual (A/B/C)** sebelum menulis kode animasi penuh.
- **Human Attention Pacing:** satu fokus visual berubah per waktu, beri jeda baca (*hold time*) setiap teks/angka muncul, arahkan mata dari satu titik ke titik berikutnya, dan pakai motif visual berkesinambungan.
- **Perbaikan presisi:** minta user menunjuk timestamp/area bermasalah (*"detik 17 pojok kiri atas, teks bertumpuk"*) lalu perbaiki secara bedah.

---

## Anti-Slop Audit Checklist (Biner Ya/Tidak)

Gerbang sebelum menyerahkan hasil dan alat audit Jalur C (`Ya` = lolos):

- **Bentuk:**
  - Proporsi tombol optik (padding horizontal ~`2–2.5×` vertikal), bukan kotak kaku? (Ya/Tidak)
  - `border-radius` tombol & kontrol konsisten dengan tetangga/kontainer, dan `--radius-btn` (pill `999px`) dipisahkan tegas dari `--radius-card`/`--radius-inner` sehingga tidak ada kontainer multi-baris berbentuk kapsul raksasa? (Ya/Tidak)
  - *Tactile cues* terukur (`1px` border / inner highlight tipis, bukan shadow tebal atau gradien mencolok)? (Ya/Tidak)
  - Semua state tersedia (`default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`) tanpa layout shift? (Ya/Tidak)
  - Indikator pada tombol/sel multi-baris sejajar tengah vertikal tanpa lingkaran/dot dekoratif, dan form memakai `noValidate` + error inline + single focus ring tanpa placeholder dummy di login? (Ya/Tidak)
- **Warna:**
  - Memakai *tinted neutrals* (bukan abu-abu mentah dan bukan `#000` pekat beradu neon)? (Ya/Tidak)
  - Maksimal 1 aksen disiplin pada mode Operate/Read (atau maksimal 2 aksen terkurasi dari Expressive Color World pada mode Persuade/Experience), tidak disebar merata ke semua elemen? (Ya/Tidak)
  - Bebas warna mentah default framework (`blue-600`, `purple-500`) dan bebas gradien ungu/neon generik? (Ya/Tidak)
  - Badge semantik memakai latar *tinted* beropasitas rendah dengan teks kontras tinggi? (Ya/Tidak)
- **Motion:**
  - Bebas animasi `fade-in-up` seragam di semua blok? (Ya/Tidak)
  - Bebas `pulse` / `glow` / `float` dekoratif tanpa fungsi? (Ya/Tidak)
  - Durasi interaksi mikro cepat (`120–180ms ease-out`) dan `prefers-reduced-motion` dihormati? (Ya/Tidak)
  - Maksimal 1 *focal interactive primitive* per viewport? (Ya/Tidak)
  - Bebas `transition-all` pada grid/list berulang, `backdrop-blur` tidak memberatkan scroll, dan tersedia skeleton/cache pada perpindahan data? (Ya/Tidak)
- **Layout & Surface:**
  - Bebas card bersarang dengan kombinasi border + shadow + garis aksen di tepi kartu? (Ya/Tidak)
  - Bebas divider di setiap baris list saat *spacing* sudah cukup memisahkan? (Ya/Tidak)
  - Ada satu titik fokus utama yang jelas per viewport? (Ya/Tidak)
  - Bebas pill/kapsul eyebrow ber-dot di atas heading dan bebas floating slogan overlay di atas foto nyata? (Ya/Tidak)
  - Bebas *horizontal overflow* di mobile (`360–390px`) berkat `min-w-0` + `overflow-x-clip`, tabel lebar dipecah ke *mobile card view*, dan sel multi-aksi ditumpuk rapi di `< sm`? (Ya/Tidak)
- **Ikon, Brand & Tipografi:**
  - Bebas emoji sebagai pengganti ikon UI dan bebas monogram/logo karangan? (Ya/Tidak)
  - Logo brand (WhatsApp, Google, dll.) dan ikon UI kompleks memakai aset canonical resmi (Simple Icons / library proyek / Lucide), bukan SVG digambar manual dari ingatan LLM? (Ya/Tidak)
  - Menggunakan ≤2 keluarga font, angka memakai `tabular-nums`, serta bebas teks tumpang tindih atau terpotong? (Ya/Tidak)
  - Copywriting memakai sudut pandang pemilik bisnis/produk ke pengguna akhir (bukan nada jualan software/SaaS pitch)? (Ya/Tidak)
- **Stack & Modularitas:**
  - Bebas menambah dependency/library UI baru tanpa persetujuan user, dan pola Lego sudah diadaptasi natif ke stack proyek? (Ya/Tidak)
  - Desain merupakan racikan modular orisinal lintas 4 sumbu (bukan salinan utuh 1 template/block/showcase)? (Ya/Tidak)

---

## Evaluasi & Distilasi Taste ke Skill

1. **Checklist biner, bukan skor 1–5:** skor subjektif sulit dikalibrasi. Jalankan seluruh checklist di atas plus:
   - Apakah 5+ opsi awal (eksplorasi konsep) benar-benar berbeda dalam font, palet, dan struktur? (Ya/Tidak)
   - Apakah jeda baca pada animasi cukup untuk dibaca manusia normal? (Ya/Tidak)
   - Apakah warna, layout, dan data konsisten dengan sumber kebenaran (codebase/dataset)? (Ya/Tidak)
2. **Mata manusia tetap penentu akhir taste;** jangan mengandalkan model menilai seleranya sendiri.
3. **Ad-hoc eval:** saat mendistilasi gaya dari contoh ke skill, uji di sesi terpisah pada topik "membosankan" agar skill tidak *overfit* pada satu proyek.

---

## Sinergi dengan `ui-craft`

Gunakan `gemini-design` untuk eksplorasi kreatif, riset tema, perakitan Lego, iterasi cepat, de-slop, slide, dashboard, dan motion. Untuk **UI web produksi** yang memerlukan audit kontras WCAG AA, persistensi token `MASTER.md`, dan verifikasi browser nyata (`360`/`390`/`768`/`1440` px) pada **seluruh rute publik maupun admin/terautentikasi**, lanjutkan dengan skill `ui-craft`.