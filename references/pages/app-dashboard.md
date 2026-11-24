# Referensi Halaman — App & Dashboard

> **Status:** `ready` — 3 pola shell mode *Operate* dari `design-systems/` (Linear, Stripe, Vercel), dossier REA Linear/Raycast, dan Lego `navigation/`, `overlays/`, `lists/`. Gunakan bersama [`../components/data-viz.md`](../components/data-viz.md) dan [`../LEGO-ADAPTATION.md`](../LEGO-ADAPTATION.md).

## Prinsip Dasar Halaman Ini
- Mulai dari pola antarmuka yang sudah familiar bagi pengguna (*familiar mental models*) sebelum berinovasi di detail interaksi.
- Untuk dashboard, berani hadirkan pemotongan data yang eksploratif dan dapat diaudit sumbernya.
- Mode *Operate*: presisi, keterbacaan cepat, `tabular-nums`, kontrol tenang; satu titik fokus per viewport dan satu lapis surface (tanpa card bersarang).
- Rancang dari kedalaman rendah ke tinggi: layout (grid, kolom) dulu, lalu surface (3–4 langkah luminance), baru aksen.

## Sumber & Lego yang Dipakai
- Sistem brand: [`linear.app.md`](../../design-systems/linear.app.md), [`stripe.md`](../../design-systems/stripe.md), [`vercel.md`](../../design-systems/vercel.md) (komponen `ex-app-shell-row`, `ex-data-table-cell`), [`notion.md`](../../design-systems/notion.md).
- REA: [`../../rea/linear.json`](../../rea/linear.json), [`../../rea/raycast.json`](../../rea/raycast.json).
- Lego: [`shadcn-command.tsx`](../../templates/navigation/shadcn-command.tsx), [`bottom-nav.tsx`](../../templates/goodui/navigation/bottom-nav/bottom-nav.tsx), [`tabs-indicator.tsx`](../../templates/goodui/navigation/tabs-indicator/tabs-indicator.tsx), [`drawer-spring.tsx`](../../templates/goodui/overlays/drawer-spring/drawer-spring.tsx), [`table-row-presence.tsx`](../../templates/goodui/lists/table-row-presence/table-row-presence.tsx), [`kpi-trend.tsx`](../../templates/goodui/charts/kpi-trend/kpi-trend.tsx).

---

## Koleksi Referensi

### Keyboard-First Split Workspace Shell (Linear / Raycast Operate Pattern)
- **Sumber:** [`../../rea/linear.json`](../../rea/linear.json), [`../../rea/raycast.json`](../../rea/raycast.json), [`../../design-systems/linear.app.md`](../../design-systems/linear.app.md), [`../../templates/navigation/shadcn-command.tsx`](../../templates/navigation/shadcn-command.tsx)
- **Tag:** `app-shell`, `workspace`, `dark-low-glare`, `keyboard-first`, `operate`
- **Kenapa bagus:** Navigasi, daftar, dan detail hidup dalam satu kerangka tenang. Kedalaman dibangun dari langkah surface tipis dan hairline, sehingga ruang dipakai untuk data. Pengguna berpindah konteks lewat `⌘K` tanpa meninggalkan keyboard.
- **Aturan konkret:**
  - **Layout & Spacing:** Tiga zona: sidebar navigasi (kolom sempit, dapat dilipat), daftar utama, panel detail/inspector. Lebar sidebar tidak tercatat di dossier REA; tentukan di kisaran kolom nav ringkas (sekitar `220–260px`) lalu kunci sebagai token proyek. Topbar ringkas (`44–56px` seperti navbar produk Apple `44px` dan header Vercel `64px` sebagai batas atas); item navigasi tinggi `28–32px` selaras dengan tombol toolbar. Dialog `⌘K` lebar `~520–640px`.
  - **Radius, Border & Elevation:** Surface bertingkat: REA Linear `rgb(8, 9, 10)` → `rgb(15, 16, 17)` → `rgba(255,255,255,0.04)`; REA Raycast `rgb(7, 8, 10)` → `rgb(17, 18, 20)`. Radius panel `8px` (Linear) hingga `12px` (Raycast); kontrol `6–8px`. Pemisah antar zona: `1px` hairline `rgba(255,255,255,0.08)`, bukan shadow. Popover/dialog satu tingkat lebih terang plus inner top highlight tipis.
  - **Tipografi & Warna:** Teks UI `13–14px`, `font-weight` `500–510`; judul panel `14–16px`; ID/kode mono. Satu aksen (Linear `#5E6AD2`) hanya untuk item aktif, fokus, dan aksi primer. Ink `#F7F8F8`, muted `#D0D6E0`, bukan `#000` murni.
  - **States & Interaksi:** Item nav aktif = latar tinted + teks naik ke primer (atau sliding pill dari `motion-primitives-animated-background.tsx`); `hover` satu langkah neutral; `focus-visible` ring jelas karena tidak ada border permanen. Shortcut tampil sebagai `kbd` mono `11–12px`. Daftar mendukung panah atas/bawah, `Enter` membuka detail, `Escape` menutup panel.
  - **Motion / Timing (jika relevan):** Hover/press `120–160ms ease-out`; pembukaan panel detail dan palette `180–260ms`, tanpa bounce berlebih; `prefers-reduced-motion` dihormati.
- **Cocok untuk:** Issue tracker, CRM, tool internal, AI workbench, aplikasi dengan pengguna harian (*power user*).
- **Hindari saat:** Audiens awam yang butuh navigasi besar dan berlabel jelas, domain hangat (klinik, kuliner, edukasi anak), atau mobile-only.

### Operational Ledger & Analytics Dashboard (Stripe / Vercel Operate Pattern)
- **Sumber:** [`../../design-systems/stripe.md`](../../design-systems/stripe.md), [`../../design-systems/vercel.md`](../../design-systems/vercel.md), [`../../templates/goodui/charts/kpi-trend/kpi-trend.tsx`](../../templates/goodui/charts/kpi-trend/kpi-trend.tsx), [`../../templates/goodui/lists/table-row-presence/table-row-presence.tsx`](../../templates/goodui/lists/table-row-presence/table-row-presence.tsx)
- **Tag:** `dashboard`, `fintech`, `ledger`, `light-mode`, `operate`, `tabular-nums`
- **Kenapa bagus:** Hierarki baca tegas: strip KPI datar, satu chart utama, lalu tabel transaksi. Kepercayaan datang dari presisi angka dan ritme spasi, bukan dekorasi. Inspector samping menjaga konteks tabel saat memeriksa satu baris.
- **Aturan konkret:**
  - **Layout & Spacing:** Dari `stripe.md`: padding section `32–48px` pada permukaan dashboard/produk dan padding internal panel `24px`. Urutan vertikal: toolbar filter (rentang tanggal, status, pencarian sejajar satu baris) → `KpiTrendGroup` → chart → tabel. Komposisi asimetris `7fr / 5fr` atau chart lebar penuh + tabel; hindari 3 kartu setara berjejer.
  - **Radius, Border & Elevation:** Panel `12px` (`rounded.lg` pada Stripe); hairline `#E3E8EE` di atas canvas `#F6F9FC`/`#FFFFFF`; shadow level-2 Stripe `rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px` hanya untuk panel melayang (popover, inspector), bukan untuk setiap kartu.
  - **Tipografi & Warna:** Ink `#0D253D`, aksen tunggal `#533AFD` untuk aksi primer dan fokus; data pendamping `#EA2261`. Nominal dan tanggal `tabular-nums`; judul display Stripe memakai weight `300` dengan tracking negatif, di UI padat cukup `20–24px` terhadap body `13px`. Header tabel Vercel: mono kapital kecil di latar `canvas-soft`.
  - **States & Interaksi:** Baris tabel fokusable dan terbuka di inspector samping dengan `Enter`/`Space`; baris baru ditandai highlight singkat; sel yang berubah memakai `CellFlash`; filter aktif tampil sebagai chip yang dapat dihapus. Item sidebar aktif (pola Vercel `ex-app-shell-row`) memakai indikator aktif tipis, bukan blok warna penuh.
  - **Motion / Timing (jika relevan):** Angka KPI berputar sekali saat tampil; transisi filter `140–200ms`; drawer inspector spring `~450ms` (`springs.sheet`) dengan trap fokus dan `Escape` menutup.
- **Cocok untuk:** Fintech, billing, admin pembayaran, laporan operasional, back-office B2B.
- **Hindari saat:** Konten editorial atau pemasaran (pakai halaman *Persuade*), dan layar dengan data sangat sedikit (cukup daftar sederhana).

### Adaptive Mobile App Shell & Slide-Over Inspector (GoodUI Bottom-Nav & Drawer Pattern)
- **Sumber:** [`../../templates/goodui/navigation/bottom-nav/bottom-nav.tsx`](../../templates/goodui/navigation/bottom-nav/bottom-nav.tsx), [`../../templates/goodui/overlays/drawer-spring/drawer-spring.tsx`](../../templates/goodui/overlays/drawer-spring/drawer-spring.tsx)
- **Tag:** `app-shell`, `mobile`, `bottom-nav`, `drawer`, `responsive`
- **Kenapa bagus:** Satu konten, dua kerangka: sidebar di desktop, bar bawah di ponsel; panel detail menjadi bottom sheet dengan snap point yang dapat ditarik. Pengguna tetap memakai pola yang sudah ia kenal dari aplikasi native.
- **Aturan konkret:**
  - **Layout & Spacing:** Uji pada `360`, `390`, `768`, `1440px`. Bottom nav: item `{ value, label, icon, badge }`, ikon `20px`, varian `pill` (label selalu tampil) atau `expand` (tab aktif memperlihatkan label), opsi tombol tengah terangkat untuk aksi utama. Target sentuh minimal `44×44px`. Drawer: `side` `bottom`/`right`/`left`; bottom sheet dengan `snapPoints` (mis. `[0.5, 1]`) dan footer lengket untuk aksi.
  - **Radius, Border & Elevation:** Sheet membulat `20px` hanya di sisi yang menghadap layar (`rounded-t` untuk bottom sheet, `rounded-l` / `rounded-r` untuk drawer samping); lebar bottom sheet maks `max-w-xl`, drawer kanan `min(400px, 100vw − 40px)`, kiri `min(340px, 100vw − 40px)`; handle tarik `64×20px` dengan batang `36×4px`. Tombol tengah dan badge boleh pill, kontainer bar tidak berubah menjadi kapsul raksasa. Badge angka maks `99+`, dengan ring selaras warna latar agar terpisah dari ikon.
  - **Tipografi & Warna:** Label tab `11–12px`, angka badge `10px` `tabular-nums`; satu aksen untuk tab aktif. Judul drawer = nama aksesibel dialog (`aria-labelledby`), deskripsi lewat `aria-describedby`.
  - **States & Interaksi:** Bottom nav: panah kiri/kanan memindahkan fokus (dibalik pada RTL), badge dibacakan screen reader (`, 3 new`). Drawer: `role="dialog"` `aria-modal`, fokus terperangkap, `Escape`/klik backdrop/drag melewati titik terendah menutup (bisa dimatikan lewat `dismissible=false`); kecepatan lepas drag memilih snap atau menutup.
  - **Motion / Timing (jika relevan):** Pill tab meluncur dengan shared layout, ikon memantul singkat; badge muncul dengan spring `play`. Drawer spring `sheet` (`visualDuration 0.45`, `bounce 0`), kurva glide `cubic-bezier(.32,.72,0,1)` `500ms` untuk tombol/backdrop, ambang flick `400px/s` dan `25%` jarak. Semua menghormati `prefers-reduced-motion`.
- **Cocok untuk:** Aplikasi booking, kasir, tracker harian, dashboard yang sering dibuka dari ponsel.
- **Hindari saat:** Navigasi lebih dari 5 tujuan utama (pakai menu atau sidebar), atau aplikasi desktop murni.
