# Referensi Komponen — Buttons

> **Status:** `ready` — 3 pola dasar terkunci (Primary Tactile, Hairline Secondary, Ghost/Toolbar) sesuai selera *Crisp & Tactile Tooling*.

## Prinsip Dasar Komponen Ini
- Hierarki aksi harus jelas dalam sekali lihat: **1 Primary**, **Secondary**, **Tertiary/Ghost**, **Destructive**.
- Setiap tombol wajib memikirkan semua state: `default`, `hover`, `active/pressed`, `focus-visible`, `disabled`, dan `loading`.

## Aturan Anti-Slop Bentuk & Interaksi Tombol
- **Proporsi optik, bukan kotak kaku:** Beri *horizontal padding* lebih lega daripada vertikal (umumnya rasio ~`2:1` hingga `2.5:1`), dan sesuaikan padding sedikit lebih rapat di sisi yang memiliki ikon agar tampak seimbang secara visual.
- **Radius selaras sistem:** Gunakan *border-radius* yang konsisten dengan komponen tetangga dan *container* induk (`6px–10px` untuk tooling crisp, atau *pill* penuh jika sistemnya *pill*) — hindari radius acak yang tidak nyambung dengan input/card di sebelahnya.
- **Tactile cues yang terukur:** Gunakan kombinasi `1px` border kontras rendah dan *inner highlight* tipis di tepi atas (untuk tombol *primary* / *tactile*) daripada shadow tebal atau gradien mencolok.
- **Zero layout shift pada state:** State `loading` harus mempertahankan lebar tombol (misalnya menyembunyikan teks sambil menjaga slot atau merender spinner sejajar dengan lebar tetap) dan `active` memakai `scale(0.98)` atau pergeseran optik halus tanpa mendorong elemen lain.

---

## Koleksi Referensi

### Tactile Crisp Primary Button (Linear / Raycast Style)
- **Sumber:** Pola referensi produk panutan (Linear & Raycast tooling controls — adaptif light/dark)
- **Tag:** `button`, `primary`, `tactile`, `crisp`
- **Kenapa bagus:** Terlihat kokoh dan responsif tanpa berteriak; kombinasi `1px` border dan *subtle top inner highlight* membuat tombol terasa fisik (*pressable*) dibandingkan tombol flat kotak generik buatan AI.
- **Aturan konkret:**
  - **Layout & Spacing:** Tinggi `32px–38px` untuk antarmuka aplikasi/toolbar, `40px–44px` untuk CTA landing page; padding horizontal `12px–18px` (tergantung ukuran), gap ikon–teks `6px–8px`.
  - **Radius, Border & Elevation:** `border-radius` `6px–10px` (atau `9999px` bila konteksnya pill CTA); `1px` border bernada sedikit lebih gelap/kontras dari fill utama + *inner highlight* tipis di tepi atas (`inset 0 1px 0` transparan putih rendah) dan drop shadow ultra-halus untuk memisahkan dari surface.
  - **Tipografi & Warna:** Font sans UI presisi, ukuran `13px–14px` (app) atau `14px–15px` (landing), `font-weight: 500–600`, tracking rapat/normal; gunakan 1 warna aksen terkalibrasi atau *high-contrast monochrome* (hitam hangat di mode terang, off-white bersih di mode gelap).
  - **States & Interaksi:** `hover` sedikit mencerahkan/menegaskan surface atau border tanpa lonjakan hue; `active` memakai `scale(0.98)` untuk *tactile feedback*; `focus-visible` menampilkan ring `2px` dengan `offset 2px` yang bersih; `disabled` menurunkan opasitas (`0.45–0.55`) dan memutus pointer/transisi; `loading` menampilkan spinner kecil tanpa mengubah lebar tombol.
  - **Motion / Timing (jika relevan):** Transisi warna, border, dan transform `120ms–160ms ease-out`.
- **Cocok untuk:** Aksi primer tunggal di dialog, form submit, header workspace, dan CTA utama landing page.
- **Hindari saat:** Dipakai berjejer lebih dari satu tombol primary dalam satu grup aksi, atau di dalam baris tabel yang sangat padat.

### Clean Hairline Secondary Button (Vercel / Geist Style)
- **Sumber:** Pola referensi produk panutan (Vercel Dashboard & Geist System)
- **Tag:** `button`, `secondary`, `hairline`, `minimal`
- **Kenapa bagus:** Memberi kontras hierarki yang tegas terhadap tombol *primary* tanpa bersaing merebut fokus; *hairline border* `1px` menjaga ketajaman siluet di mode terang maupun gelap.
- **Aturan konkret:**
  - **Layout & Spacing:** Tinggi dan padding mengikuti pasangan *primary button* (`32px–38px` app, `40px–44px` landing; gap ikon–teks `6px–8px`) agar sejajar rapi saat disandingkan.
  - **Radius, Border & Elevation:** `border-radius` identik dengan *primary button* (`6px–10px`); surface *tinted neutral* ber-kontras rendah terhadap latar + `1px` hairline border semi-transparan; tanpa drop shadow berat.
  - **Tipografi & Warna:** Ukuran `13px–14px`, `font-weight: 500`, teks netral kontras tinggi (bukan warna aksen) agar tetap terbaca jelas namun tenang.
  - **States & Interaksi:** `hover` menggeser fill ke satu tingkat neutral lebih jelas dan menaikkan ketegasan border; `active` memakai `scale(0.98)`; `focus-visible` ring konsisten dengan sistem; `disabled` dan `loading` mempertahankan dimensi tombol.
  - **Motion / Timing (jika relevan):** `120ms–150ms ease-out` pada background, border, dan transform.
- **Cocok untuk:** Aksi pendamping (Cancel, Export, Secondary CTA "Documentation" / "Learn more"), dan kontrol filter sekunder.
- **Hindari saat:** Ditempatkan di atas latar bermotif kompleks dengan opasitas terlalu transparan sehingga border `1px` dan teks kehilangan kontras.

### Subtle Ghost & Toolbar Action Button (Linear / Stripe Style)
- **Sumber:** Pola referensi produk panutan (Linear toolbar & Stripe header actions)
- **Tag:** `button`, `ghost`, `toolbar`, `compact`
- **Kenapa bagus:** Menjaga kepadatan workspace tetap tenang karena tidak membebani layar dengan banyak kotak border saat diam, namun langsung memberi sinyal interaktif yang jelas saat di-*hover* atau difokuskan lewat keyboard.
- **Aturan konkret:**
  - **Layout & Spacing:** Tinggi ringkas `28px–34px` untuk toolbar atau icon button persegi (`28x28px` hingga `34x34px`); gap ikon–teks `6px–8px`; boleh menyertakan *keyboard shortcut hint* (`kbd`) tipis di sisi kanan untuk *power-user tooling*.
  - **Radius, Border & Elevation:** `border-radius` `6px–8px`; tanpa border dan tanpa shadow pada kondisi *default* (latar transparan).
  - **Tipografi & Warna:** Ukuran `13px–14px`, `font-weight: 500`, teks *secondary neutral* yang naik menjadi *primary neutral* saat hover.
  - **States & Interaksi:** `hover` memunculkan latar *tinted neutral* lembut; `active` memakai `scale(0.98)` atau penguatan fill tipis; `focus-visible` wajib jelas karena tidak ada border permanen; `loading` mengganti/menahan slot ikon dengan spinner tanpa menggeser label atau tombol tetangga.
  - **Motion / Timing (jika relevan):** `120ms–150ms ease-out`.
- **Cocok untuk:** Aksi baris tabel, toolbar editor, tombol tutup/batal ringan, dan navigasi sekunder berulang.
- **Hindari saat:** Menjadi satu-satunya aksi utama di halaman penting atau CTA konversi yang harus langsung tertangkap mata tanpa interaksi hover.

---

## Real Production Measurements (REA)

Data terukur langsung dari DOM produksi 1440×900 ([`../../rea/`](../../rea/)):

| Situs | Sampel Tombol | Height | Padding | Radius | Background / Ink | Border / Tactile Shadow | Transition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Apple** | `Learn more` / `Shop iPhone` | `44px` | `11px 21px` | `980px` | `rgb(0,113,227)` / `#fff` & outline `rgb(0,102,204)` | `1px solid` (outline) / `none` | `0s` |
| **Linear** | `Sign up` (header) | `32px` | `0px 12px` | `9999px` | `rgb(229,229,230)` / `rgb(8,9,10)` | `1px solid rgb(229,229,230)` + multi-layer micro shadow | `0.16s` |
| **Vercel** | `Get a Demo` / `Deploy now` | `32px` / `40px` | `0px 6px` / `0px 12px` | `6px` / pill | `rgb(10,10,10)` & `rgb(237,237,237)` | `0 0 0 1px rgb(46,46,46)` ring | `0.15s` |
| **Stripe** | `Contact sales` / `Get started` | `40px` / `48px` | `11.5px 20px 12.5px` / `15.5px 24px 16.5px` | `4px` | `rgb(83,58,253)` / `#fff` | `0px` (primary) / `1px solid rgb(185,185,249)` (secondary) | `0.24s–0.3s` |
| **Raycast** | `Download for Mac` | `36px` | `8px 12px` | `8px` | `rgb(230,230,230)` / `rgb(47,48,49)` | 4-layer bevel (`inset 0 1px` putih + `inset 0 -1px` gelap) | `0.1s–0.2s` |

## Verbatim Lego Templates (`templates/buttons/`)

Salin dan adaptasikan kode produksi asli (MIT) alih-alih mengarang variasi tombol dari nol:
- **Hierarki tombol standar (`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`):** [`shadcn-button.tsx`](../../templates/buttons/shadcn-button.tsx) (`shadcn-ui/ui`, 63 baris)
- **CTA hero dengan *conic shimmer* halus:** [`magicui-shimmer-button.tsx`](../../templates/buttons/magicui-shimmer-button.tsx) (`magicuidesign/magicui`, 96 baris)
- **Tombol *glossy mask-sweep* taktil:** [`magicui-shiny-button.tsx`](../../templates/buttons/magicui-shiny-button.tsx) (`magicuidesign/magicui`, 74 baris)
- **Wrapper efek *magnetic* berbasis spring physics:** [`motion-primitives-magnetic.tsx`](../../templates/buttons/motion-primitives-magnetic.tsx) (`ibelick/motion-primitives`, 112 baris)
