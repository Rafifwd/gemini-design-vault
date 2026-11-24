# Referensi Komponen — Buttons

> **Status:** `ready` — 8 pola terukur (3 dasar + 5 pola taktil `goodui.dev`) dengan pengukuran REA produksi & template Lego verbatim.

## Prinsip Dasar Komponen Ini
- Hierarki aksi harus jelas dalam sekali lihat: **1 Primary**, **Secondary**, **Tertiary/Ghost**, **Destructive**.
- Setiap tombol wajib memikirkan semua state: `default`, `hover`, `active/pressed`, `focus-visible`, `disabled`, dan `loading`.

## Aturan Anti-Slop Bentuk & Interaksi Tombol
- **Proporsi optik, bukan kotak kaku:** Beri *horizontal padding* lebih lega daripada vertikal (umumnya rasio ~`2:1` hingga `2.5:1`), dan sesuaikan padding sedikit lebih rapat di sisi yang memiliki ikon agar tampak seimbang secara visual.
- **Radius selaras sistem:** Gunakan *border-radius* yang konsisten dengan komponen tetangga dan *container* induk (`6px–10px` untuk tooling crisp, atau *pill* penuh jika sistemnya *pill*) — hindari radius acak yang tidak nyambung dengan input/card di sebelahnya.
- **Tactile cues yang terukur:** Gunakan kombinasi `1px` border kontras rendah dan *inner highlight* tipis di tepi atas (untuk tombol *primary* / *tactile*) daripada shadow tebal atau gradien mencolok.
- **Zero layout shift pada state:** State `loading` harus mempertahankan lebar tombol (misalnya menyembunyikan teks sambil menjaga slot atau merender spinner sejajar dengan lebar tetap) dan `active` memakai `scale(0.98)` atau pergeseran optik halus tanpa mendorong elemen lain.
- **Alignment vertikal indikator pada tombol/sel multi-baris:** Pada tombol atau sel slot berisi 2 baris teks (label + harga/meta), gunakan `flex items-center justify-between` agar ikon di sisi kanan tepat di tengah vertikal terhadap seluruh tombol, bukan menempel di baris atas.
- **Bebas pembungkus lingkaran & dot dekoratif:** Render ikon status (mis. centang terpilih) langsung tanpa membungkusnya dengan lingkaran warna kecil; hilangkan titik hijau/aksen dekoratif pada item statis atau status *tersedia* yang sudah jelas lewat tipografi.

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

### Hold-to-Confirm Destructive Sweep (GoodUI Pattern)
- **Sumber:** `templates/goodui/buttons/hold-to-confirm/hold-to-confirm.tsx` (`https://goodui.dev/r/hold-to-confirm.json`)
- **Tag:** `button`, `destructive`, `hold`, `tactile`, `safety`
- **Kenapa bagus:** Mencegah klik tidak sengaja pada aksi berbahaya/irreversible tanpa mengganggu layar dengan modal konfirmasi berulang; *progress fill sweep* + pembalikan warna teks di tepi sapuan memberi umpan balik fisik yang sangat jelas.
- **Aturan konkret:**
  - **Layout & Spacing:** Tinggi `32px` (`sm`), `40px` (`md`), atau `48px` (`lg`); padding horizontal `12px–24px`, gap ikon–teks `6px–8px`; teks instruksi singkat (`Press and hold`) muncul hanya bila user mengetuk singkat tanpa menahan.
  - **Radius, Border & Elevation:** Radius `6px–12px` (`rounded-md` / `rounded-lg` / `rounded-xl`); `1px` border bernada `destructive/30` di atas fill `destructive/10` saat diam.
  - **Tipografi & Warna:** Label destruktif digelapkan sedikit (`color-mix` ~85% menuju hitam di light mode) agar tetap >= `4.5:1`; fill sapuan memakai `bg-destructive` penuh dengan teks putih kontras tinggi.
  - **States & Interaksi:** Mendukung pointer, touch, serta keyboard (`Space` / `Enter` ditahan); melepas tombol sebelum `duration` (default `1500ms`) me-*rewind* sapuan kembali ke `0%`; `confirmed` memicu reset otomatis setelah `2000ms` (atau menetap jika `resetAfter=0`).
  - **Motion / Timing (jika relevan):** Sapuan linear presisi selama tahanan (`1200ms–1600ms`), rewind cepat `200ms ease-out`; tetap menghormati `prefers-reduced-motion` tanpa mengaburkan progress.
- **Cocok untuk:** Hapus akun/workspace, revoke API key, eksekusi transaksi/reservasi final, dan reset data produksi.
- **Hindari saat:** Dipakai untuk aksi rutin berfrekuensi tinggi (mis. navigasi tab atau simpan draft).

### Liquid Glass Pointer-Specular Button & Pill Toolbar (GoodUI Pattern)
- **Sumber:** `templates/goodui/buttons/liquid-glass-button/liquid-glass-button.tsx` (`https://goodui.dev/r/liquid-glass-button.json`)
- **Tag:** `button`, `glass`, `specular`, `toolbar`, `pill`
- **Kenapa bagus:** Menggabungkan *backdrop blur/saturate*, *gradient rim mask* (`::after`), dan *specular highlight* berbasis variabel CSS `--pc-lg-x / --pc-lg-y` yang mengikuti kursor tanpa React re-render, lengkap dengan fallback solid saat `backdrop-filter` tidak didukung.
- **Aturan konkret:**
  - **Layout & Spacing:** Ukuran `sm` (`32px`), `md` (`40px`), `lg` (`48px`), atau `icon` (`44×44px`); padding horizontal `14px–28px`, `white-space: nowrap`, gap `6px–8px`.
  - **Radius, Border & Elevation:** Khusus `rounded-full` (tombol/pill toolbar satu baris — jangan terapkan pill radius ke container grid multi-baris!); rim highlight `1px` via gradient mask `140deg` + `inset 0 1px 0` specular top edge + shadow kedalaman terkalibrasi.
  - **Tipografi & Warna:** Dua nada: `light` (`rgb(255 255 255 / .26 -> .08)`, teks `#fff` dengan subtle text-shadow `0 1px 2px`) dan `dark` (`rgb(24 24 32 / .42 -> .22)`); fallback otomatis ke tint solid `78%–85%` jika `backdrop-filter` tidak tersedia.
  - **States & Interaksi:** `onPointerMove` memperbarui posisi radial spotlight `110px` di lapisan `::before`; `hover` menaikkan opasitas specular ke `1` dan skala halus `1.03`; `active` mengecil ke `0.95` dengan spring snap; `focus-visible` ring `3px`.
  - **Motion / Timing (jika relevan):** Transisi highlight `350ms ease`, spring press `play`; nonaktifkan animasi specular saat `prefers-reduced-motion`.
- **Cocok untuk:** Floating media/stage control bar, overlay di atas foto/video/WebGL hero, atau switch livery/kamera pada configurator.
- **Hindari saat:** Ditempatkan di atas latar putih polos tanpa warna/gradien di belakangnya (efek kaca menjadi tampak kotor/abu-abu mati).

### Stateful Async Morph Button (GoodUI Pattern)
- **Sumber:** `templates/goodui/buttons/stateful-button/stateful-button.tsx` (`https://goodui.dev/r/stateful-button.json`)
- **Tag:** `button`, `async`, `stateful`, `morph`, `feedback`
- **Kenapa bagus:** Menggantikan toast generik atau spinner kaku dengan siklus keadaan menyatu di dalam tombol (`idle` -> `loading` -> `success` drawn-check emerald / `error` shake), dengan pembacaan `sr-only` untuk aksesibilitas.
- **Aturan konkret:**
  - **Layout & Spacing:** Tinggi terkunci (`32px` / `40px` / `48px`), lebar berubah mulus secara proporsional atau terkunci saat loading, gap ikon–label `6px–8px`.
  - **Radius, Border & Elevation:** Radius `6px–10px` seragam dengan form/card sekitar; `default` memakai elevasi `--pc-e1`.
  - **Tipografi & Warna:** Tetap memakai warna primer/outline saat `idle` dan `loading`; berganti ke semantik `emerald` saat `success` dan `destructive` saat `error`.
  - **States & Interaksi:** Mengikat langsung ke `Promise` dari `onClick`; menyertakan region `sr-only` (`Working…`, `Done`, `Something went wrong`); otomatis kembali ke `idle` setelah `resetAfter` ms.
  - **Motion / Timing (jika relevan):** Drawn SVG check stroke animates `~260ms ease-out`; error memberi micro-shake horizontal `±4px` yang dinonaktifkan pada `prefers-reduced-motion`.
- **Cocok untuk:** Submit pembayaran, simpan konfigurasi, test koneksi API, dan tombol sync.
- **Hindari saat:** Aksi berpindah halaman seketika tanpa menunggu respons async.

### Prismatic / Rainbow Focal CTA (GoodUI Pattern)
- **Sumber:** `templates/goodui/buttons/rainbow-button/rainbow-button.tsx` (`https://goodui.dev/r/rainbow-button.json`)
- **Tag:** `button`, `cta`, `hero`, `rainbow`, `vivid`
- **Kenapa bagus:** Alih-alih membuat seluruh tombol berwarna-warni mencolok yang merusak keterbacaan teks, spektrum warna ditempatkan tipis pada border `2px` dan *ambient under-glow* blur `14px`, sedangkan wajah tombol tetap solid high-contrast.
- **Aturan konkret:**
  - **Layout & Spacing:** Ukuran `sm` (`32px`), `md` (`40px`), `lg` (`48px`), padding horizontal `14px–28px`; **maksimal 1 tombol per viewport**.
  - **Radius, Border & Elevation:** Radius `10px / 12px / 14px` (atau `999px` bila `pill`), border strip `2px` dengan gradient 5-warna selebar `200%`.
  - **Tipografi & Warna:** Wajah tombol tetap solid (`#111` pada light / `#FFF` atau dark surface di dark) dengan `1px` top highlight sehingga kontras label tetap maksimal di semua tema.
  - **States & Interaksi:** `hover` mempertegas under-glow blur (`0.55 -> 0.9` opacity + `translateY(2px) scaleX(1.04)`); `active` turun ke `scale(0.98)`; `focus-visible` ring `3px`.
  - **Motion / Timing (jika relevan):** Geseran loop seamless `translateX(-50%)` berdurasi `3s linear infinite`; pause otomatis via `@media (prefers-reduced-motion: reduce)`.
- **Cocok untuk:** CTA utama *Launch / Generate / Explore* di landing page kreatif, studio AI, atau festival showcase.
- **Hindari saat:** Dipakai pada antarmuka *Operate* (tabel admin, dashboard akuntansi) atau dipasang berjejer lebih dari satu tombol.

### Web Audio Micro-Sound Pairing (GoodUI Sounds)
- **Sumber:** `templates/goodui/lib/sounds/sounds.ts` (`https://goodui.dev/r/sounds.json`)
- **Tag:** `audio`, `tactile`, `web-audio`, `micro-interaction`
- **Kenapa bagus:** 24 resep suara sintetis murni Web Audio API (tanpa file `.mp3`/`.wav` eksternal, selaras nada C mayor pentatonik pada level sopan `-14 dBFS`) sehingga tombol taktil terasa benar-benar "klik" secara akustik setelah user memberi persetujuan (*opt-in*).
- **Aturan konkret:**
  - **Layout & Spacing:** Wajib sediakan tombol toggle eksplisit (`Sound: Off/On`) yang jelas status `aria-pressed`-nya; **selalu mati secara default**.
  - **Radius, Border & Elevation:** Kontrol toggle suara menyatu ke header/dock memakai styling hairline atau glass toolbar.
  - **Tipografi & Warna:** Gunakan indikator gelombang suara inline SVG (tanpa emoji speaker) yang memperlihatkan state aktif/muted.
  - **States & Interaksi:** `tap` (`tick` pendek) untuk tombol primer/switch, `toggle-on`/`toggle-off` untuk mode switcher, `confirm`/`success` saat hold selesai, `error` untuk gagal validasi, dan `unlock`/`celebrate` untuk pencapaian kunci.
  - **Motion / Timing (jika relevan):** Durasi envelope super singkat `12ms–140ms`, level master `0.2` (~`-14 dBFS`), selalu jalankan hanya di dalam user gesture dan hormati preferensi visitor.
- **Cocok untuk:** Showcase interaktif, design playground, configurator produk hardware, audio studio, dan dashboard kreatif.
- **Hindari saat:** Menyala otomatis tanpa persetujuan user atau dipasang di halaman baca artikel sunyi.

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

## Verbatim Lego Templates (`templates/buttons/` & `templates/goodui/`)

Salin dan adaptasikan kode produksi asli alih-alih mengarang variasi tombol dari nol:
- **Hierarki tombol standar (`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`):** [`shadcn-button.tsx`](../../templates/buttons/shadcn-button.tsx) (`shadcn-ui/ui`, 63 baris)
- **CTA hero dengan *conic shimmer* halus:** [`magicui-shimmer-button.tsx`](../../templates/buttons/magicui-shimmer-button.tsx) (`magicuidesign/magicui`, 96 baris)
- **Tombol *glossy mask-sweep* taktil:** [`magicui-shiny-button.tsx`](../../templates/buttons/magicui-shiny-button.tsx) (`magicuidesign/magicui`, 74 baris)
- **Wrapper efek *magnetic* berbasis spring physics:** [`motion-primitives-magnetic.tsx`](../../templates/buttons/motion-primitives-magnetic.tsx) (`ibelick/motion-primitives`, 112 baris)
- **Hold-to-Confirm destruktif dengan sapuan fill & rewind:** [`hold-to-confirm.tsx`](../../templates/goodui/buttons/hold-to-confirm/hold-to-confirm.tsx) (`goodui.dev`, 268 baris)
- **Liquid Glass button & pill toolbar dengan pointer specular:** [`liquid-glass-button.tsx`](../../templates/goodui/buttons/liquid-glass-button/liquid-glass-button.tsx) (`goodui.dev`, 232 baris)
- **Stateful Async button (loading -> drawn check / error shake):** [`stateful-button.tsx`](../../templates/goodui/buttons/stateful-button/stateful-button.tsx) (`goodui.dev`, 291 baris)
- **Rainbow / Prismatic focal CTA:** [`rainbow-button.tsx`](../../templates/goodui/buttons/rainbow-button/rainbow-button.tsx) (`goodui.dev`, 108 baris)
- **Ripple click feedback & inline Copy morph:** [`ripple-button.tsx`](../../templates/goodui/buttons/ripple-button/ripple-button.tsx) & [`copy-button.tsx`](../../templates/goodui/buttons/copy-button/copy-button.tsx) (`goodui.dev`)
- **Synthesized Web Audio micro-sounds (24 resep, tanpa file audio):** [`sounds.ts`](../../templates/goodui/lib/sounds/sounds.ts) (`goodui.dev`, 516 baris)
