# Referensi Komponen — Data Visualization

> **Status:** `ready` — 3 pola berbasis kode produksi `goodui.dev` (`charts/` 14 item, `numbers/` 8 item), token `design-systems/stripe.md`, dan REA Linear. Terjemahkan lewat [`../LEGO-ADAPTATION.md`](../LEGO-ADAPTATION.md) bila stack bukan React 19 + Tailwind + `motion`.

## Prinsip Dasar Komponen Ini
- Angka metrik, tanggal, dan tabel wajib memakai `font-variant-numeric: tabular-nums`.
- Pisahkan data fetching dari visualisasi agar mendukung live reload, dan sediakan transparansi sumber/query (*sources mode*) agar angka bisa diverifikasi.
- Setiap chart punya padanan teks: ringkasan `aria-label`, tabel `sr-only` atau nilai terbaca saat scrub, dan legend yang bisa dioperasikan keyboard.
- Warna data diambil dari 1–3 token chart terkalibrasi (`--chart-1..n`); warna semantik naik/turun (hijau/merah) hanya untuk delta, bukan untuk dekorasi.

## Verbatim Lego Templates (`templates/goodui/charts/` & `templates/goodui/numbers/`)
Cari lewat `python3 <skill_dir>/scripts/query_vault.py lego --category charts` (atau `numbers`).
- **KPI tile + strip hairline:** [`kpi-trend.tsx`](../../templates/goodui/charts/kpi-trend/kpi-trend.tsx) (`KpiTrend`, `KpiTrendGroup`)
- **Angka berputar & delta:** [`number-flow.tsx`](../../templates/goodui/numbers/number-flow/number-flow.tsx), [`delta-badge.tsx`](../../templates/goodui/numbers/delta-badge/delta-badge.tsx), [`counter-up.tsx`](../../templates/goodui/numbers/counter-up/counter-up.tsx)
- **Sparkline & meter:** [`sparkline-draw.tsx`](../../templates/goodui/numbers/sparkline-draw/sparkline-draw.tsx), [`meter.tsx`](../../templates/goodui/numbers/meter/meter.tsx), [`circular-progress.tsx`](../../templates/goodui/numbers/circular-progress/circular-progress.tsx)
- **Chart utama:** [`area-chart.tsx`](../../templates/goodui/charts/area-chart/area-chart.tsx), [`line-chart.tsx`](../../templates/goodui/charts/line-chart/line-chart.tsx), [`bar-chart.tsx`](../../templates/goodui/charts/bar-chart/bar-chart.tsx), [`heatmap.tsx`](../../templates/goodui/charts/heatmap/heatmap.tsx)
- **Legend bersama:** [`chart-legend.tsx`](../../templates/goodui/charts/chart-legend/chart-legend.tsx)
- **Tabel hidup:** [`cell-flash.tsx`](../../templates/goodui/numbers/cell-flash/cell-flash.tsx), [`table-row-presence.tsx`](../../templates/goodui/lists/table-row-presence/table-row-presence.tsx)

---

## Koleksi Referensi

### Flat KPI Strip & Rolling Telemetry (Stripe / GoodUI KpiTrend Pattern)
- **Sumber:** [`../../templates/goodui/charts/kpi-trend/kpi-trend.tsx`](../../templates/goodui/charts/kpi-trend/kpi-trend.tsx), [`../../design-systems/stripe.md`](../../design-systems/stripe.md) (tabular-figure body, hairline `#E3E8EE`, ink `#0D253D`)
- **Tag:** `data-viz`, `kpi`, `dashboard`, `operate`, `tabular-nums`
- **Kenapa bagus:** Satu panel dengan sekat hairline 1px menggantikan 3–4 kartu terpisah ber-shadow, sehingga deretan metrik terbaca sebagai satu strip datar. Delta berwarna hanya di badge kecil, angka utama tetap netral.
- **Aturan konkret:**
  - **Layout & Spacing:** `KpiTrendGroup` memakai `grid` dengan `gap: 1px` di atas latar `var(--border)` (kolom 2/3/4, menumpuk jadi 1–2 kolom di layar sempit). Ukuran tile: `sm` padding `14px` angka `text-xl` sparkline `32px`; `md` padding `20px` angka `text-3xl` sparkline `44px`; `lg` padding `24px` angka `text-4xl` sparkline `56px`. Layout tile `stack` (sparkline di bawah) atau `row` (sparkline `~112–128px` di sisi akhir).
  - **Radius, Border & Elevation:** Satu border `1px` dan radius `12px` hanya pada pembungkus grup (`overflow: hidden`); tile di dalamnya `border: 0`, `radius: 0`. Tanpa shadow. Tile interaktif saja yang naik `translateY(-2px)` saat hover.
  - **Tipografi & Warna:** Label `text-xs`/`text-sm` redup (`muted-foreground`), angka `font-semibold` `leading-none` `tracking-tight` `tabular-nums`. Badge delta: pill `px 6px / py 2px`, `text-xs`, `font-semibold`; warna baik `oklch(0.53 0.13 155)`, buruk `oklch(0.56 0.21 27)` (dark: `oklch(0.72 0.16 155)` / `oklch(0.7 0.19 25)`), latar tint `13%`. Prop `invertDelta` membalik makna untuk metrik yang turunnya baik (churn, wait time).
  - **States & Interaksi:** Angka berputar saat masuk viewport (`IntersectionObserver`, threshold `0.3`) dan setiap nilai berubah; teks akhir tersedia di `sr-only` plus deskripsi `increase/decrease/no change`. Delta berdenyut saat nilainya berubah.
  - **Motion / Timing (jika relevan):** Delta pop `450ms` (kurva spring CSS), pulse `600ms ease-out` (ring `0 → 8px`), hover lift `200ms`. `prefers-reduced-motion` mematikan semua animasi dan menampilkan nilai akhir.
- **Cocok untuk:** Ringkasan metrik di atas dashboard (revenue, bookings, usage), halaman billing, kartu status admin.
- **Hindari saat:** Metrik berubah beberapa kali per detik (pulse jadi noise; pakai `cell-flash` pada tabel), atau layar hanya punya 1 angka (pakai satu tile besar tanpa strip).

### Interactive Multi-Series Area & Bar Charts (GoodUI Chart + Accessible Legend Pattern)
- **Sumber:** [`../../templates/goodui/charts/area-chart/area-chart.tsx`](../../templates/goodui/charts/area-chart/area-chart.tsx), [`../../templates/goodui/charts/bar-chart/bar-chart.tsx`](../../templates/goodui/charts/bar-chart/bar-chart.tsx), [`../../templates/goodui/charts/chart-legend/chart-legend.tsx`](../../templates/goodui/charts/chart-legend/chart-legend.tsx)
- **Tag:** `data-viz`, `chart`, `svg`, `legend`, `accessible`
- **Kenapa bagus:** Chart SVG murni dengan scrub, picker rentang (`1W / 1M / 1Y`), dan legend yang berupa tombol toggle sungguhan. Informasi tidak bergantung pada warna atau hover saja: ada ringkasan, tabel teks, dan live region.
- **Aturan konkret:**
  - **Layout & Spacing:** Header chart berisi judul + angka utama + delta di satu baris, picker rentang di sisi akhir. Sumbu: label `11px` `tabular-nums` redup, gutter kiri sekitar `8px` dari plot. Legend (`row`/`column`, align start/center/end, ukuran `sm`/`md`) ditaruh di bawah header atau di bawah plot, bukan melayang di atas data.
  - **Radius, Border & Elevation:** Plot tanpa border dan tanpa card bersarang; chart hidup langsung di surface halaman atau di satu panel hairline. Picker rentang: track `rounded-lg` berlatar `muted` dengan padding `2px`, item `rounded-md` (radius konsentris). Garis area bisa diberi `drop-shadow(0 3px 6px)` warna seri pada `35%` opasitas, dan grain film opsional (`grain` prop).
  - **Tipografi & Warna:** Warna seri dari `var(--chart-1..n)`; gradien area satu hue dengan fade ke transparan. Delta memakai badge yang sama dengan KPI. Swatch legend bentuk `square` (bar/area), `line` atau `dashed` (garis), `dot` (titik).
  - **States & Interaksi:** Legend: `aria-pressed`, toggle via klik/`Enter`/`Space`, judul tooltip `Hide X / Show X`, `onActiveChange` menyorot seri saat hover/focus. Area chart: `role="group"` + `aria-roledescription="area chart"` + `aria-label` ringkasan (awal, akhir, terendah, tertinggi), picker `radiogroup` dengan navigasi panah, `aria-live="polite"` membacakan titik yang di-scrub, tabel `sr-only` untuk seluruh data.
  - **Motion / Timing (jika relevan):** Garis menggambar masuk saat terlihat dan morph antar rentang; bar tumbuh dari baseline dan morph saat data berubah. Titik live berdenyut `2.4s` (ping) dan berhenti pada `prefers-reduced-motion`. Skala sumbu tidak melompat saat seri disembunyikan.
- **Cocok untuk:** Tren pendapatan/penggunaan, perbandingan periode, laporan performa dengan 2–4 seri.
- **Hindari saat:** Lebih dari ~4 seri sekaligus (pakai small multiples), atau data kategorikal ratusan titik (pakai tabel dengan filter). Hindari donut/pie untuk perbandingan presisi.

### Dense Operational Table & Live Cell Delta (Linear / GoodUI Cell-Flash Pattern)
- **Sumber:** [`../../templates/goodui/numbers/cell-flash/cell-flash.tsx`](../../templates/goodui/numbers/cell-flash/cell-flash.tsx), [`../../templates/goodui/lists/table-row-presence/table-row-presence.tsx`](../../templates/goodui/lists/table-row-presence/table-row-presence.tsx), [`../../rea/linear.json`](../../rea/linear.json) (surface `rgb(15, 16, 17)` di atas `rgb(8, 9, 10)`, hairline `rgba(255,255,255,0.08)`)
- **Tag:** `data-viz`, `table`, `live-data`, `operate`, `dense`
- **Kenapa bagus:** Perubahan nilai ditandai kilatan singkat di sel (hijau naik, merah turun) seperti terminal trading, dan baris baru atau hilang dianimasikan sehingga mata mengikuti perubahan tanpa dialog atau toast. Tidak ada layout shift.
- **Aturan konkret:**
  - **Layout & Spacing:** `CellFlash` membungkus nilai dengan padding horizontal `6px` dan margin negatif `-6px` agar teks tetap sejajar kolom. Panah indikator diposisikan di luar kotak teks (`start-full`) sehingga tidak menggeser lebar sel. Angka rata kanan (`align="right"`), tanggal/ID rata kiri; `TableRowPresence` mendukung RTL (kiri/kanan = start/end).
  - **Radius, Border & Elevation:** Sel flash `rounded-md`; tabel tanpa card pembungkus ganda: pemisah antar baris cukup hairline `1px` atau spacing. Latar header tabel satu tingkat surface di atas body, bukan border tebal.
  - **Tipografi & Warna:** `tabular-nums` wajib di semua sel numerik; font mono untuk ID/SKU. Flash: naik `emerald` `20%`, turun `rose` `20%`, netral `sky` `20%`; teks flash `emerald-700` / `rose-700` (dark: `*-400`) agar kontras terjaga. Baris baru ditint `primary` `11%` lalu memudar.
  - **States & Interaksi:** Arah ditentukan dengan membandingkan nilai lama vs baru (atau prop `direction`). Baris klik: fokusable, aktif dengan `Enter`/`Space`. State kosong tampil sebagai satu baris penuh dengan aksi lanjutan. `caption` tabel di bawah tabel.
  - **Motion / Timing (jika relevan):** Flash `900ms` (`ease-in-out`), panah `±3px` + fade; baris masuk/keluar spring `bounce: 0` `420ms` (tinggi sel `0 → auto` lewat pembungkus div); highlight baris baru `2.2s ease-out`. Reduced-motion: flash jadi fade latar tanpa gerak panah, highlight hampir instan.
- **Cocok untuk:** Daftar order/transaksi, monitoring, antrean tugas, tabel harga atau stok yang berubah live.
- **Hindari saat:** Tabel statis yang jarang berubah (kilatan hanya menambah noise), atau pembaruan massal sekaligus (kilat serentak di puluhan sel menghilangkan fokus; batasi ke kolom kunci).

---

## Catatan Stack-Agnostic
- Bila project bukan React 19 + Tailwind + `motion`: ambil **token, timing, state, ARIA** dari tabel di atas (Mode A di `LEGO-ADAPTATION.md`) dan render dengan SVG/Canvas atau library chart yang sudah ada di repo.
- Spring `motion` diganti `cubic-bezier(.23,1,.32,1)` atau `linear()` CSS; `IntersectionObserver` dan `Intl.NumberFormat` sudah native.
- *Sources mode:* sediakan tombol/popover kecil per metrik yang menampilkan query atau file sumber dan waktu refresh terakhir, sehingga angka dapat diaudit.
