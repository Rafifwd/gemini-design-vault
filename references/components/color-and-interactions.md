# Referensi Komponen — Warna, Surface & Pola Interaksi Frontend

> **Status:** `ready` — aturan konkret untuk mencegah warna mentah, surface kaku, dan motion template AI, sekaligus meminjam pola interaktif frontend modern secara terukur.

## Prinsip Dasar
- **Warna dan surface membangun hierarki, bukan dekorasi:** Bedakan kedalaman (*canvas → surface → elevated*) dengan pergeseran *tinted neutral* yang halus dan *hairline border* `1px`, bukan menumpuk shadow atau mewarnai banyak kartu sekaligus.
- **Interaksi harus terasa responsif dan beralasan:** Setiap transisi atau efek interaktif wajib memperjelas hubungan spasial, umpan balik klik, atau status aktif — bukan tempelan *fade-in* generik di setiap elemen.

---

## Koleksi Referensi

### Tinted Neutrals & 1-Accent Discipline (Light Warm & Dark Low-Glare)
- **Sumber:** Sintesis selera pribadi (`TASTE-PROFILE.md`) dari sistem desain Linear, Raycast, Vercel, & Stripe
- **Tag:** `color`, `surface`, `palette`, `anti-slop`
- **Kenapa bagus:** AI slop paling cepat terlihat dari pemakaian abu-abu netral mentah, `#000000` pekat beradu warna neon, atau menyebar warna aksen ke tombol + badge + ikon + border sekaligus. Tangga *tinted neutrals* membuat UI terasa matang dan kohesif di mode terang maupun gelap.
- **Aturan konkret:**
  - **Layout & Spacing:** Pisahkan area menggunakan 3–4 tingkat tangga surface (*canvas*, *panel/card*, *elevated/popover*) plus *whitespace* yang konsisten; hindari card bersarang dengan border tebal bertumpuk.
  - **Radius, Border & Elevation:** Gunakan *hairline border* `1px` semi-transparan yang diturunkan dari warna teks/permukaan (bukan garis abu-abu solid yang keras); di mode gelap, gunakan *inner top highlight* super tipis alih-alih drop shadow hitam pekat.
  - **Tipografi & Warna:**
    - **Mode Light Warm:** Latar canvas off-white hangat (bukan putih klinis `#FFFFFF` di semua lapisan), surface kartu lebih bersih/terang atau sedikit berundak, teks utama dark charcoal hangat (bukan `#000000` murni), teks sekunder diredam jelas.
    - **Mode Dark Low-Glare:** Canvas charcoal/obsidian lembut (hindari `#000000` murni kecuali untuk permukaan kontras spesifik), permukaan naik bertahap sedikit lebih terang saat elevasi meningkat.
    - **Disiplin 1 Aksen:** Pilih maksimal 1 warna aksen terkalibrasi (bukan `blue-600`/`purple-500` mentah default library) dan batasi hanya untuk aksi primer, indikator aktif, atau fokus utama. Badge status semantik (sukses/peringatan/error) pakai *tinted background* beropasitas rendah dengan teks kontras tinggi, bukan blok warna solid berteriak.
  - **States & Interaksi:** State *hover*, *selected*, dan *active* cukup menggeser satu tingkat neutral atau opasitas tipis — tidak memicu pergantian warna pelangi atau glow berlebihan.
  - **Motion / Timing (jika relevan):** Transisi warna dan border ringkas `120ms–160ms ease-out`.
- **Cocok untuk:** Semua komponen UI, dashboard, SaaS workspace, hingga landing page yang ingin terlihat terkalibrasi dan dewasa.
- **Hindari saat:** Proyek secara eksplisit meminta gaya *brutalist* kontras ekstrem atau *editorial art direction* multi-warna yang memang didesain khusus per ilustrasi/kampanye.

### Crisp Functional Micro-Interactions (Emil Kowalski / Linear Craft)
- **Sumber:** Pola interaksi frontend modern (Emil Kowalski — Sonner/Vaul, Rauno Freiberg, Linear)
- **Tag:** `interaction`, `motion`, `tactile`, `micro-interaction`
- **Kenapa bagus:** Mengubah komponen statis buatan AI menjadi antarmuka yang terasa "hidup" di tangan pengguna lewat umpan balik langsung (*tactile press*, *shared-layout transition*, *directional nudge*) tanpa memperlambat alur kerja.
- **Aturan konkret:**
  - **Layout & Spacing:** Elemen yang bertransisi (misal *tab indicator*, *segmented control*, *tooltip/popover*) harus menjaga dimensi tetap stabil agar layout di sekitarnya tidak bergeser atau bergetar.
  - **Radius, Border & Elevation:** Indikator aktif (*sliding pill* atau *underline*) mengikuti radius kontainer induknya (umumnya radius indikator = radius kontainer dikurangi padding internal agar konsentris).
  - **Tipografi & Warna:** Transisi label tab atau tombol dari *muted* ke *primary* berjalan serempak dengan pergeseran indikator aktif.
  - **States & Interaksi:**
    - **Tactile press:** `active:scale-[0.98]` pada tombol dan kontrol interaktif.
    - **Shared-layout active pill:** Gunakan transisi posisi halus saat berpindah tab/segmented control (indikator meluncur ke item aktif, bukan muncul-hilang kaku).
    - **Directional nudge:** Ikon panah/chevron di CTA atau list item bergerak `2px–3px` searah aksi saat *hover*.
    - **Disclosure & overlay:** Popover/drawer muncul dari titik asal atau tepi yang logis dengan sedikit perubahan skala (`0.96–1.0`) + opasitas.
  - **Motion / Timing (jika relevan):** Durasi pendek `120ms–180ms ease-out` untuk hover/press/state kecil; `200ms–260ms` dengan kurva cepat-di-awal dan mendarat tenang (atau *spring* ketat tanpa pantulan berlebihan) untuk perpindahan tab/drawer. Hormati `prefers-reduced-motion`.
- **Cocok untuk:** Tab navigasi, segmented control, tombol aksi utama, command palette, toast/drawer, dan baris list interaktif.
- **Hindari saat:** Terlalu banyak elemen di satu layar bergerak bersamaan, atau animasi diterapkan ke teks paragraf panjang dan seluruh blok halaman secara seragam (`fade-in-up` massal).

### Selective Interactive Frontend Primitives (Origin UI / Motion Primitives / 21st.dev)
- **Sumber:** Pola komponen interaktif ekosistem frontend (Origin UI, Motion Primitives, 21st.dev, React Bits)
- **Tag:** `frontend-pattern`, `interactive`, `hero`, `showcase`
- **Kenapa bagus:** Memberikan kualitas interaktif ala frontend engineer berpengalaman (misalnya *interactive bento preview*, *keyboard-navigable command bar*, *morphing status badge*, atau *smooth hover spotlight* tipis) tanpa jatuh ke perangkap template efek berlebihan.
- **Aturan konkret:**
  - **Layout & Spacing:** Batasi maksimal **1 focal interactive primitive per viewport** (misalnya 1 preview interaktif di hero atau 1 segmented/filter bar di workspace); area di sekitarnya tetap bersih dan lega.
  - **Radius, Border & Elevation:** Seluruh *primitive* yang diadopsi wajib di-skin ulang memakai *tinted neutrals*, `1px` hairline border, dan radius yang sama persis dengan sistem desain proyek (jangan menyalin palet neon/ungu bawaan demo library).
  - **Tipografi & Warna:** Pertahankan hierarki tipografi proyek; pastikan efek latar (seperti *spotlight/grid/shimmer* halus) tetap beropasitas sangat rendah agar kontras teks selalu aman terbaca.
  - **States & Interaksi:** Interaksi berbasis pointer (*hover spotlight*, *magnetic/tilt* super halus, atau *live preview state*) wajib memiliki *fallback* statis yang rapi untuk perangkat sentuh dan navigasi keyboard (`focus-visible`).
  - **Motion / Timing (jika relevan):** Responsif terhadap input pengguna (`120ms–220ms`); hindari animasi *looping* terus-menerus yang mengalihkan perhatian dari teks utama kecuali untuk indikator status live yang memang fungsional.
- **Cocok untuk:** Hero section landing page produk SaaS/devtool, showcase fitur interaktif, atau komponen input/command khusus yang butuh daya tarik tanpa kehilangan fungsi.
- **Hindari saat:** Menggabungkan 3–4 efek mencolok (spotlight + confetti + floating cards + glowing border) di satu halaman, atau memakainya di aplikasi internal/tabel padat yang menuntut fokus tinggi.
