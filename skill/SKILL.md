---
name: gemini-design
description: Workflow desain anti-AI-slop untuk Gemini (UI, fitur produk, slide, dashboard dinamis, dan motion/video) berbasis metode Nate Parrott — klarifikasi awal, eksplorasi lebar, code-as-source-of-truth, mitigasi bias model, dan iterasi human-in-the-loop. Pakai saat mendesain dari nol, merancang fitur di codebase, membuat deck/dashboard/motion, atau saat hasil desain terasa generik/AI slop. Juga untuk merapikan/de-slop UI yang sudah ada (Jalur C). Selalu membaca vault selera pribadi (references/TASTE-PROFILE.md + INDEX.md) sebelum mendesain.
user-invocable: true
disable-model-invocation: false
---

# Gemini Design

Workflow desain anti-AI-slop untuk menghasilkan UI, fitur produk, slide deck, dashboard dinamis, dan motion graphics dengan Gemini. Diadaptasi dari prinsip dan workflow desain Nate Parrott.

## Prinsip Inti: "You Get Out What You Put In"

AI slop muncul saat model diberi konteks kosong lalu mencoba "menciptakan gaya visual paling brilian" dari nol — hasilnya selalu collapse ke gaya default yang generik dan seragam. Konteks brand, referensi visual, dan codebase yang ada adalah aset paling berharga yang membuat hasil desain terasa autentik dan tidak seperti template AI.

---

## Langkah 0 — Reference Router (Wajib, Sebelum Fase Apa Pun)

Semua path di bawah relatif terhadap folder tempat `SKILL.md` ini berada (global: `/home/rafif/.agents/skills/gemini-design/references/`; saat authoring di vault, `references/` berada di root vault).

1. **Urutan baca wajib:**
   - Baca `references/TASTE-PROFILE.md` (selalu).
   - Baca `references/DESIGN-GRAMMAR.md` dan pilih **1 Art Direction + suhu warna yang cocok dengan domain & mode permukaan** (`Persuade` / `Operate` / `Read` / `Experience`) dari `design-systems/INDEX.json` (`apple`, `stripe`, `linear.app`, `vercel`, `notion`, `supabase`, `airbnb`, `spotify`, `figma`, `claude`) **sebelum** memilih warna atau font — dilarang jatuh ke satu palet default "krem + teal" di semua proyek.
   - Baca `references/INDEX.md` (router kategori), lalu buka **hanya** file `references/` berstatus `seeded` atau `ready` yang relevan; lewati file `template`.
   - **Rakit Lego dari produksi nyata:** Untuk komponen standar (button, tab, command palette, bento card, dialog, input, toast), cek `templates/INDEX.json` + dossier `rea/*.json` / `references/assets/rea-*.png` dan **adaptasikan kode/token produksi verbatim** dari `templates/` daripada mengarang CSS/komponen dari nol.
   - Jika vault belum punya contoh yang cocok, rujuk Layer 2: `/home/rafif/.agents/skills/better-ui/REFERENCE-INDEX.md` dan `python3 /home/rafif/.agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "<Product>"`.
2. **Prioritas sumber (dari tertinggi ke terendah):**
   `Instruksi eksplisit user > Brand / design system / codebase eksisting > TASTE-PROFILE.md > Referensi vault > Corpus eksternal`.
   Taste profile adalah *default* saat konteks kosong dan tidak boleh menimpa design system produk yang sudah ada (Jalur A).
3. **Constraint HARD vs SOFT:**
   - **HARD (selalu berlaku):** Daftar larangan di `references/TASTE-PROFILE.md` §6 dan `Anti-Slop Audit Checklist` di bawah.
   - **SOFT (jangkar arah):** Arah estetika dan produk panutan (Linear, Raycast, Vercel, Stripe, dll.). Referensi adalah aturan untuk diterjemahkan sesuai konteks proyek, bukan komponen untuk di-clone — jangan pernah menyalin satu referensi mentah-mentah.

---

## Fase 0 — Klarifikasi Awal (Designer Discovery)

> **Aturan adaptif:** Lewati pertanyaan yang sudah terjawab di `TASTE-PROFILE.md` (vibe, density, karakter motion, hal yang dihindari). Cukup ajukan **2–4 pertanyaan spesifik proyek** yang relevan (boleh di-skip user). Pada **Jalur C (De-Slop)**, lewati Fase 0 sepenuhnya kecuali 1–2 poin konfirmasi cepat.

Sebelum langsung menggambar atau menulis kode desain penuh, ajukan pertanyaan terarah (gunakan `ask_question` atau daftar ringkas):

1. **Tujuan & pengguna:** Masalah apa yang diselesaikan dan siapa audiens utamanya?
2. **Konteks asal:** Membangun di atas produk/codebase yang sudah ada, atau dari nol?
3. **Referensi & vibe proyek:** Ada screenshot, mood board, produk sejenis, atau karya sebelumnya yang ingin dijadikan jangkar?
4. **Batasan teknis & format:** Web app, mobile, slide HTML, dashboard data, atau motion video?
5. *(Opsional jika tidak memakai default TASTE-PROFILE)* **Kepadatan, fokus & pantangan khusus** untuk proyek ini.

Jauh lebih mudah bagi user menjawab pertanyaan terarah daripada memikirkan semua detail upfront.

---

## Fase 1 — Grounding Konteks (3 Jalur Masuk)

### Jalur A: Codebase Eksisting (*Code is the Source of Truth*)
1. **Baca kode sumber lebih dulu** — jangan mengarang design system terpisah atau menyalin ulang dari screenshot secara manual.
2. **Rekonstruksi baseline UI aktual** dari kode yang ada sebagai titik awal eksplorasi.
3. **Lakukan variasi (riff) langsung** dari baseline tersebut sehingga tipografi, warna, jarak, dan pola komponen konsisten dengan produk nyata.
4. **Implementasikan di sesi/konteks yang sama** setelah arah desain disetujui — karena kode, CSS, dan layout sudah berada di konteks yang sama, hampir tidak ada detail yang hilang saat translasi ke produksi.

### Jalur B: Dari Nol (*Green-Field*)
1. **Jangkar referensi dulu:** Minta atau pakai screenshot, mood board, brand guidelines, atau pola UI familiar yang sudah dipahami pengguna (misalnya struktur inbox, kalender, atau editor yang sudah terbukti) sebagai jalan pintas kegunaan.
2. **Wireframe sebelum styling:** Untuk layout atau alur yang kompleks, pisahkan struktur dari estetika — buat beberapa opsi **wireframe layout** dulu sebelum memilih font dan palet warna.
3. **Preview arah visual sebelum skala penuh:** Untuk slide deck panjang, aplikasi multi-layar, atau video motion, eksplorasi arah visual pada **1–2 frame/halaman representatif** terlebih dahulu sebelum membangun keseluruhan output agar tidak membuang token jika arahnya ditolak.

### Jalur C: De-Slop Desain Eksisting
- **Trigger:** User meminta merapikan, me-de-slop, atau menghilangkan kesan AI dari UI/halaman/komponen yang sudah ada. Lewati interogasi 8 pertanyaan dan pembuatan 5–10 opsi dari nol.
- **Alur eksekusi:**
  1. **Baca kode aktual** (HTML/JSX/CSS) terlebih dahulu.
  2. **Audit dengan `Anti-Slop Audit Checklist`**, sertakan bukti `file:line` untuk setiap temuan dan kelompokkan per **Bentuk**, **Warna**, **Motion**, **Layout/Surface**, dan **Ikon/Tipografi**.
  3. **Konfirmasi cepat 1–2 poin** dengan user (misalnya apakah warna brand atau struktur layout utama dipertahankan).
  4. **Tawarkan 2–3 arah perbaikan singkat** *atau* langsung lakukan **refactor bedah** jika user memintanya — tetap hormati design system produk yang ada sesuai prioritas sumber.
  5. **Verifikasi** dengan menjalankan ulang checklist biner (`sebelum → sesudah`). Untuk UI web produksi, lanjutkan dengan sinergi `ui-craft`.

---

## Fase 2 — Eksplorasi Lebar lalu Konvergensi (Anti Mode Collapse)

Jangan langsung berhenti pada satu desain pertama (kecuali pada Jalur C yang bersifat bedah terarah).

1. **Pergi selebar mungkin:** Pada Jalur B, hasilkan **5–10 opsi yang benar-benar berbeda** (atau sesuai batas jumlah yang diminta user) — ubah **keluarga font, palet warna, struktur layout, dan bahasa visual secara menyeluruh**, bukan sekadar menggeser warna aksen.
2. **Selaras dengan taste profile:** Berpijaklah pada `TASTE-PROFILE.md` untuk 1–2 opsi awal; opsi sisanya tetap bereksplorasi lebar, namun **semua opsi** wajib mematuhi constraint **HARD**.
3. **Loop rekombinasi:** Saat user menyukai potongan dari beberapa opsi (misalnya layout A + tipografi C), hasilkan **3–5 variasi baru** yang mengawinkan elemen tersebut.
4. **Simpan histori berdampingan:** Jangan menimpa opsi lama yang sudah dieksplorasi; pertahankan versi sebelumnya berdampingan untuk perbandingan agar keputusan desain mudah ditinjau ulang.
5. **Mitigasi bias model secara eksplisit:** Patuhi `TASTE-PROFILE.md` §6 (Personal Anti-Slop Ban List) dan `Anti-Slop Audit Checklist` — hindari template korporat kaku, gradien ungu/neon generik, card bersarang, dan klise default AI kecuali diminta user.

---

## Fase 3 — Iterasi Human-in-the-Loop ("Backseat Driving")

Perlakukan kolaborasi desain seperti *art director* yang mengarahkan langsung:

1. **Terima arahan singkat, kasual, atau tidak rapi:** Tangkap maksud dari instruksi cepat seperti *"lebih padat, hapus subtitle, izinkan teks wrap, hilangkan divider, rapikan ikon ke cell"* dan terjemahkan langsung menjadi perubahan kode/desain konkret.
2. **Kode itu murah; perhatian manusia mahal:** Jangan habiskan waktu terlalu lama berteori sebelum bisa dicoba. Bangun prototipe interaktif cepat agar bisa langsung diklik dan dirasakan.
3. **Jaga memori dalam satu konteks bersama:** Simpan eksplorasi dan variasi aktif dalam thread/konteks yang sama (atau delegasikan generasi variasi paralel ke subagent sambil menjaga konteks hasil tetap terpusat) agar tidak perlu menjelaskan ulang konteks produk di setiap iterasi.

---

## Workflow Khusus

### A. Dashboard Dinamis
- **Koneksi data langsung:** Hubungkan ke sumber data nyata (file lokal, script query, API, atau MCP) alih-alih angka statis yang cepat basi; pisahkan lapisan fetch data dengan lapisan visualisasi agar bisa di-reload.
- **Transparansi sumber (*Sources Mode*):** Sediakan cara memeriksa asal angka dan query/logika agregasi di balik setiap metrik agar user dapat memverifikasi akurasi data.
- **Berani eksploratif:** Saat user hanya memberi dataset dan belum tahu metrik apa yang harus dipantau, tawarkan pemotongan data dan insight yang tidak terduga selain KPI dasar.

### B. Motion Graphics & Data Storytelling
- **Storyboard + gaya visual dulu:** Sebelum menulis kode animasi penuh, hasilkan **storyboard statis** untuk alur cerita plus **2–3 pilihan arah visual (A/B/C)** yang hemat token.
- **Human Attention Pacing:** Model cenderung mengubah banyak elemen bersamaan karena mampu memproses semuanya sekaligus, sementara mata manusia lambat dan hanya bisa fokus di satu titik pada satu waktu. Wajib terapkan:
  - Satu fokus visual berubah dalam satu waktu.
  - Beri jeda baca (*hold time*) yang cukup setiap kali teks/angka muncul sebelum transisi berikutnya.
  - Arahkan mata penonton dari satu titik ke titik berikutnya secara mulus.
  - Gunakan motif visual yang berkesinambungan (misalnya garis/elemen utama yang terus mengalir) agar terasa seperti animasi utuh, bukan slide statis yang berganti-ganti.
- **Perbaikan presisi:** Ajak user menunjuk langsung timestamp atau area spesifik yang bermasalah (misalnya *"di detik 17 pojok kiri atas, teks ini bertumpuk"*) lalu perbaiki titik tersebut secara bedah.

---

## Anti-Slop Audit Checklist (Biner Ya/Tidak)

Gunakan sebagai gerbang sebelum menyerahkan hasil atau saat mengaudit UI di Jalur C (`Ya` = lolos):

- **Bentuk:**
  - Proporsi tombol optik (padding horizontal ~`2–2.5×` vertikal), bukan kotak kaku? (Ya/Tidak)
  - `border-radius` tombol & kontrol konsisten dengan komponen tetangga/kontainer? (Ya/Tidak)
  - *Tactile cues* terukur (`1px` border / inner highlight tipis, bukan shadow tebal atau gradien mencolok)? (Ya/Tidak)
  - Semua state tersedia (`default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`) tanpa layout shift? (Ya/Tidak)
- **Warna:**
  - Memakai *tinted neutrals* (bukan abu-abu mentah dan bukan `#000` pekat beradu neon)? (Ya/Tidak)
  - Maksimal 1 warna aksen disiplin, hanya untuk aksi primer, status aktif, atau fokus? (Ya/Tidak)
  - Bebas warna mentah default framework (`blue-600`, `purple-500`) dan bebas gradien ungu/neon generik? (Ya/Tidak)
  - Badge semantik memakai latar *tinted* beropasitas rendah dengan teks kontras tinggi? (Ya/Tidak)
- **Motion:**
  - Bebas animasi `fade-in-up` seragam di semua blok? (Ya/Tidak)
  - Bebas `pulse` / `glow` / `float` dekoratif tanpa fungsi? (Ya/Tidak)
  - Durasi interaksi mikro cepat (`120–180ms ease-out`) dan `prefers-reduced-motion` dihormati? (Ya/Tidak)
  - Maksimal 1 *focal interactive primitive* per viewport? (Ya/Tidak)
- **Layout & Surface:**
  - Bebas card bersarang dengan kombinasi border + shadow + garis aksen di tepi kartu? (Ya/Tidak)
  - Bebas divider di setiap baris list saat *spacing* sudah cukup memisahkan? (Ya/Tidak)
  - Ada satu titik fokus utama yang jelas per viewport? (Ya/Tidak)
- **Ikon, Brand & Tipografi:**
  - Bebas emoji sebagai pengganti ikon UI dan bebas monogram/logo karangan? (Ya/Tidak)
  - Menggunakan ≤2 keluarga font, angka memakai `tabular-nums`, serta bebas teks tumpang tindih atau terpotong? (Ya/Tidak)

---

## Evaluasi & Distilasi Taste ke Skill

1. **Pakai checklist biner (Ya/Tidak), bukan skor 1–5:** Skor subjektif sulit dikalibrasi oleh model. Jalankan seluruh item `Anti-Slop Audit Checklist` di atas plus cek tambahan berikut:
   - Apakah 5+ opsi awal (Jalur B) benar-benar menggunakan font, palet, dan struktur yang berbeda? (Ya/Tidak)
   - Apakah jeda baca pada animasi cukup untuk dibaca manusia normal? (Ya/Tidak)
   - Apakah warna, layout, dan data konsisten dengan sumber kebenaran (codebase/dataset)? (Ya/Tidak)
2. **Mata manusia tetap penentu akhir taste:** Jangan mengandalkan model untuk menilai sendiri apakah seleranya sudah "bagus".
3. **Ad-hoc eval untuk skill gaya visual:** Jika mendistilasi gaya visual/motion tertentu dari contoh referensi ke dalam skill, uji skill tersebut di sesi terpisah pada topik yang "membosankan" atau tidak berkaitan untuk memastikan skill tidak *overfit* hanya pada satu proyek.

---

## Sinergi dengan `ui-craft`

Gunakan `gemini-design` untuk eksplorasi kreatif, klarifikasi awal, variasi lebar, iterasi cepat, de-slop terarah, slide, dashboard, dan motion. Jika output berupa **UI web produksi** yang memerlukan audit kontras WCAG AA, persistensi token `MASTER.md`, serta verifikasi browser nyata multi-viewport (`360`/`390`/`768`/`1440` px), kombinasikan dengan skill `ui-craft`.