# Referensi Halaman — Landing Page

> **Status:** `ready` — 6 dossier REA langsung (*live* 1440×900 capture + computed DOM CSS) dari Apple, Linear, Vercel, Stripe, Raycast, dan GoodUI (`goodui.dev`).

## Catatan Koneksi Eksternal
Untuk inspirasi struktur situs lengkap tambahan (59 analisis situs nyata), lihat `~/.agents/skills/better-ui/REFERENCE-INDEX.md` jika skill pendamping tersebut terpasang (bucket *SaaS*, *Editorial*, *Commerce*, atau *Agency*).

---

## Koleksi Referensi (Hasil REA Produksi Nyata)

### Apple (`apple.com`) — Product Showcase Minimal
- **Sumber:** `https://www.apple.com/` · Screenshot [`../assets/rea-apple.png`](../assets/rea-apple.png) · Dossier [`../../rea/apple.json`](../../rea/apple.json)
- **Tag:** `landing-page`, `commerce`, `light-mode`, `product-showcase`
- **Kenapa bagus:** Membuktikan bahwa produk itu sendiri adalah hero; latar putih bersih dengan navbar *frosted glass* tipis membuat foto produk dan dua CTA pill langsung terbaca tanpa dekorasi tambahan.
- **Aturan konkret:**
  - **Layout & Spacing:** Viewport `1440×900`, navbar sticky `44px` (`backdrop-filter: saturate(1.8) blur(20px)`), CTA disusun berdampingan dengan spacing longgar di bawah judul produk.
  - **Radius, Border & Elevation:** Tombol pill penuh (`980px`); header tanpa border bawah (`0px none`), pemisahan lewat warna latar `rgba(245, 245, 247, 0.8)`.
  - **Tipografi & Warna:** Canvas `rgb(255, 255, 255)`, ink `rgb(29, 29, 31)`, font `"SF Pro Text"` (`17px / 25px` body) & `"SF Pro Display"` (`56px / 60px`, weight `600`, tracking `-0.28px` pada hero `H2`), 1 aksen biru (`rgb(0, 113, 227)` fill / `rgb(0, 102, 204)` outline).
  - **States & Interaksi:** Primary pill solid vs secondary outline `1px solid rgb(0, 102, 204)` tanpa `box-shadow` (`none`).
  - **Motion / Timing (jika relevan):** Transisi tombol `0s` / instan pada link hero; fokus pada transisi media produk.
- **Cocok untuk:** Halaman peluncuran produk fisik/perangkat keras atau SaaS dengan visual produk yang sangat kuat.
- **Hindari saat:** Produk tidak memiliki aset fotografi/render beresolusi tinggi.

### Linear (`linear.app`) — Dark Precision Tooling Hero
- **Sumber:** `https://linear.app/` · Screenshot [`../assets/rea-linear.png`](../assets/rea-linear.png) · Dossier [`../../rea/linear.json`](../../rea/linear.json)
- **Tag:** `landing-page`, `saas`, `dark-low-glare`, `tooling`
- **Kenapa bagus:** Standar emas *dark low-glare*: memakai obsidian `rgb(8, 9, 10)` (bukan `#000000` pekat) dengan *hairline border* `1px` semi-transparan dan tipografi *variable* ber-tracking ketat.
- **Aturan konkret:**
  - **Layout & Spacing:** Header `73px` (`12` link), hero di atas lipatan dengan *product UI showcase* langsung di bawah headline; top radii dominan `8px`, `9999px`, `4px`.
  - **Radius, Border & Elevation:** Header `border-bottom: 1px solid rgba(255, 255, 255, 0.08)` + `blur(20px)`; surface bertingkat `rgb(8, 9, 10)` → `rgb(15, 16, 17)` → `rgba(255, 255, 255, 0.04)`.
  - **Tipografi & Warna:** `"Inter Variable"` + `"Berkeley Mono"`; H1 `64px / 64px` (`weight: 510`, tracking `-1.408px`, ink `rgb(247, 248, 248)`), H2 `48px / 48px` (`rgb(138, 143, 152)`).
  - **States & Interaksi:** Tombol header `Sign up` `32px` (`0px 12px`, `9999px`, `rgb(229, 229, 230)` bg, ink gelap, `13px` `weight: 510`, multi-layer micro shadow).
  - **Motion / Timing (jika relevan):** `transition-duration: 0.16s` pada tombol primer.
- **Cocok untuk:** Developer tools, B2B SaaS, dan aplikasi produktivitas berorientasi *power user*.
- **Hindari saat:** Domain membutuhkan nuansa hangat/ramah seperti klinik, kuliner, atau edukasi anak.

### Vercel (`vercel.com`) — Hairline Monochrome & Display Tracking
- **Sumber:** `https://vercel.com/` · Screenshot [`../assets/rea-vercel.png`](../assets/rea-vercel.png) · Dossier [`../../rea/vercel.json`](../../rea/vercel.json)
- **Tag:** `landing-page`, `devtools`, `monochrome`, `hairline`
- **Kenapa bagus:** Memisahkan skala kontrol header (`32px`, radius `6px`, `box-shadow` ring `1px`) dari skala CTA hero (`40px`, pill penuh) serta menggunakan *tracking* H1 yang sangat rapat untuk memberi karakter kuat tanpa warna mencolok.
- **Aturan konkret:**
  - **Layout & Spacing:** Header `64px`; hero berpusat dengan dua CTA sejajar (`Deploy now` & `Talk to sales`).
  - **Radius, Border & Elevation:** Sistem dua radius tegas: `6px` untuk kontrol utility/navbar dan `pill` (`9999px`) untuk CTA hero; border secondary menggunakan `box-shadow: 0 0 0 1px rgb(46, 46, 46)`.
  - **Tipografi & Warna:** `GeistSans`; H1 `64px / 64px` (`weight: 400`, `letter-spacing: -3.84px`), H2 `56px / 56px` (`weight: 450`, `-3.36px`); canvas `rgb(0, 0, 0)`, surface `rgb(10, 10, 10)`, ink `rgb(237, 237, 237)`.
  - **States & Interaksi:** Kontras murni monokrom (`rgb(237, 237, 237)` vs `rgb(10, 10, 10)`); lebar tombol `124px–130px`, padding `0px 12px`.
  - **Motion / Timing (jika relevan):** `transition-duration: 0.15s` seragam di seluruh kontrol.
- **Cocok untuk:** Platform infrastruktur, dokumentasi teknis, dan landing page arsitektur developer.
- **Hindari saat:** Audiens awam yang membutuhkan isyarat warna semantik yang hangat.

### Stripe (`stripe.com`) — Editorial Crisp Fintech
- **Sumber:** `https://stripe.com/` · Screenshot [`../assets/rea-stripe.png`](../assets/rea-stripe.png) · Dossier [`../../rea/stripe.json`](../../rea/stripe.json)
- **Tag:** `landing-page`, `fintech`, `editorial`, `light-mode`
- **Kenapa bagus:** Alih-alih memakai font tebal generik, Stripe memakai *light weight* (`300`) pada display headline dengan radius tombol tegas `4px` dan satu warna aksen indigo terkalibrasi (`rgb(83, 58, 253)`).
- **Aturan konkret:**
  - **Layout & Spacing:** Header `76px` (`14` link), komposisi editorial ringan dengan banyak ruang bernapas; tombol hero setinggi `48px`, tombol header `40px`.
  - **Radius, Border & Elevation:** Radius konsisten `4px` (mendominasi `20` elemen terukur) — tajam dan dewasa, bukan pill maupun kotak `0px`.
  - **Tipografi & Warna:** `sohne-var` (`16px` body), H1 `48px / 55.2px` (`weight: 300`, `letter-spacing: -0.96px`), H2 `32px / 35.2px` (`rgb(6, 27, 49)`); 1 aksen `rgb(83, 58, 253)` dengan tint sekunder `rgb(226, 228, 255)` / `rgb(185, 185, 249)`.
  - **States & Interaksi:** Primary solid `rgb(83, 58, 253)` vs secondary outline `1px solid rgb(185, 185, 249)` dengan latar `rgba(255, 255, 255, 0.65)`.
  - **Motion / Timing (jika relevan):** `transition-duration: 0.24s–0.3s` untuk tombol/link utama.
- **Cocok untuk:** Produk finansial, B2B enterprise, dan platform SaaS yang menjual kepercayaan dan presisi.
- **Hindari saat:** Aplikasi internal padat yang butuh kontrol toolbar `28px–34px`.

### Raycast (`raycast.com`) — Tactile Metallic Controls
- **Sumber:** `https://www.raycast.com/` · Screenshot [`../assets/rea-raycast.png`](../assets/rea-raycast.png) · Dossier [`../../rea/raycast.json`](../../rea/raycast.json)
- **Tag:** `landing-page`, `desktop-app`, `dark-low-glare`, `tactile`
- **Kenapa bagus:** Contoh terbaik tombol *tactile* di latar gelap (`rgb(7, 8, 10)`): kombinasi *outer ring*, *inner top highlight* putih (`inset 0 1px 0.4px`), dan *inner bottom bevel* membuat tombol `36px` terasa seperti tuts fisik.
- **Aturan konkret:**
  - **Layout & Spacing:** Hero terpusat berorientasi instalasi aplikasi desktop; radius terukur `12px`, `20px`, `8px`, `6px`.
  - **Radius, Border & Elevation:** Tombol CTA `height: 36px`, `padding: 8px 12px`, `border-radius: 8px`, dengan 4-lapis `box-shadow` taktil (`0 0 0 2px rgba(0,0,0,0.5)`, `0 0 14px rgba(255,255,255,0.19)`, `inset 0 -1px 0.4px rgba(0,0,0,0.2)`, `inset 0 1px 0.4px rgb(255,255,255)`).
  - **Tipografi & Warna:** `Inter` + `GeistMono`; H1 `64px / 70.4px` (`weight: 600`), H2 `20px` (`weight: 500`, tracking `0.2px`); surface bertahap `rgb(7, 8, 10)` → `rgb(17, 18, 20)` → `rgb(67, 67, 69)`.
  - **States & Interaksi:** CTA utama `rgb(230, 230, 230)` berteks `rgb(47, 48, 49)` yang sangat kontras di latar obsidian.
  - **Motion / Timing (jika relevan):** `transition-duration: 0.2s, 0.2s, 0.2s, 0.1s` (transform/scale lebih cepat daripada warna).
- **Cocok untuk:** Aplikasi desktop/launcher, AI workbench, dan tool kreatif berkarakter hardware/tactile.
- **Hindari saat:** Memakai efek bevel mengilap tersebut di atas latar putih terang tanpa penyesuaian kontras.

### GoodUI (`goodui.dev`) — Multi-Style Kit & Oversized Display Hero
- **Sumber:** `https://goodui.dev/` · Screenshot [`../assets/rea-goodui.png`](../assets/rea-goodui.png) · Dossier [`../../rea/goodui.json`](../../rea/goodui.json)
- **Tag:** `landing-page`, `ui-kit`, `style-packs`, `high-contrast`, `shadcn`
- **Kenapa bagus:** Memadukan tipografi display super ketat (`88px`, `-3.96px` tracking) di atas canvas `lab(100 0 0)` dengan sistem kontrol multi-tema ortogonal (*8 Style Packs × 8 Accent Colors × Light/Dark*) lewat kapsul mengambang di bawah layar (*"Make it yours"*).
- **Aturan konkret:**
  - **Layout & Spacing:** Header `57px` (`blur(8px)`, border `1px`, `19` link); tombol utility header tinggi `32px`, sedangkan hero CTA setinggi `48px` (`0px 24px`).
  - **Radius, Border & Elevation:** Sistem dua tingkat radius: `10px` pada kontrol header dan `14px` pada hero CTA (`43` elemen memakai `14px`); tombol primer memakai `box-shadow: 0 8px 30px -8px` lembut.
  - **Tipografi & Warna:** `gooduiDisplay` (`88px / 86.24px`, `weight: 600`, tracking `-3.96px` untuk H1; `48px / 50.4px` untuk H2) + `gooduiSans` (`16px / 24px`) + `Geist Mono`; warna dasar `oklab`/`lab` presisi.
  - **States & Interaksi:** `Style: Clean` switcher langsung di header (`32px`, radius `10px`), hero CTA `transition-duration: 0.2s` (primer) / `0.15s` (outline sekunder), plus floating Theme Studio bar di bawah viewport.
  - **Motion / Timing (jika relevan):** Semua animasi dan material efek mematuhi `prefers-reduced-motion`, dengan token pegas terpusat (`goodui-motion`).
- **Cocok untuk:** Landing page library komponen, design system showcase, SaaS produktivitas dengan demo interaktif live.
- **Hindari saat:** Halaman baca panjang tanpa interaksi widget atau formulir pendaftaran sederhana satu langkah.
