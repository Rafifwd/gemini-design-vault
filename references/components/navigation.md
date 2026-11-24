# Referensi Komponen — Navigation

> **Status:** `ready` — dikalibrasi dari pengukuran REA (Apple, Linear, Vercel, Stripe) + template produksi verbatim (`shadcn/ui`, `motion-primitives`).

## Prinsip Dasar Komponen Ini
- Navigasi harus mencerminkan struktur mental pengguna tanpa membanjiri layar dengan link yang tidak perlu.
- Pastikan state aktif, fokus keyboard, dan perilaku responsif di layar sempit (`360px`–`390px`) jelas.

## Real Production Measurements (REA)

| Situs | Tag | Height | Background & Backdrop Filter | Border Bottom | Catatan |
| --- | --- | --- | --- | --- | --- |
| **Apple** | `nav` | `44px` | `rgba(245, 245, 247, 0.8)` + `saturate(1.8) blur(20px)` | `0px none` | Super tipis, frosted glass khas desktop/product bar |
| **Linear** | `header` | `73px` | `rgba(0, 0, 0, 0)` + `blur(20px)` | `1px solid rgba(255, 255, 255, 0.08)` | `12` link; hairline border sangat halus memisahkan nav dari canvas |
| **Vercel** | `header` | `64px` | `rgba(0, 0, 0, 0)` | `0px` | Navbar compact dengan tombol `32px` radius `6px` |
| **Stripe** | `header` | `76px` | `rgba(0, 0, 0, 0)` | `0px` | `14` link; dropdown terstruktur tanpa kotak berlebih |

## Verbatim Lego Templates (`templates/navigation/`)
- **Shared-layout sliding active tab/pill:** [`motion-primitives-animated-background.tsx`](../../templates/navigation/motion-primitives-animated-background.tsx) (`ibelick/motion-primitives`, 90 baris)
- **Accessible Tabs primitive (Radix):** [`shadcn-tabs.tsx`](../../templates/navigation/shadcn-tabs.tsx) (`shadcn-ui/ui`, 90 baris)
- **Command Palette (`Cmd+K`, ala Raycast/Linear):** [`shadcn-command.tsx`](../../templates/navigation/shadcn-command.tsx) (`shadcn-ui/ui`, 184 baris)

---

## Koleksi Referensi

### Frosted Hairline Top Header (Linear / Apple REA Pattern)
- **Sumber:** [`../../rea/linear.json`](../../rea/linear.json) & [`../../rea/apple.json`](../../rea/apple.json) · Screenshot [`../assets/rea-linear.png`](../assets/rea-linear.png)
- **Tag:** `navigation`, `header`, `frosted-glass`, `hairline`
- **Kenapa bagus:** Tetap ringan dan menyatu dengan kanvas konten di bawahnya saat di-scroll berkat `blur(20px)` dan hairline border `1px` beropasitas rendah.
- **Aturan konkret:**
  - **Layout & Spacing:** Tinggi `44px` (compact product bar ala Apple) hingga `64px–73px` (SaaS header ala Vercel/Linear); batasi item utama `≤ 6–7` link di bar atas agar tidak penuh sesak.
  - **Radius, Border & Elevation:** Tanpa drop shadow; cukup `border-bottom: 1px solid rgba(...)` beropasitas `0.08` (dark) atau `0.09` (light), plus `backdrop-filter: blur(20px)`. Pada halaman scroll panjang dengan banyak elemen interaktif, gunakan latar semi-solid beropasitas tinggi (`rgba(..., 0.94–0.96)`) tanpa `backdrop-filter: blur()` berat agar scroll tetap mulus tanpa GPU repaint di setiap frame.
  - **Tipografi & Warna:** Ukuran link `13px–14px`, `font-weight: 500`, teks netral sekunder yang naik ke primer saat hover/aktif.
  - **States & Interaksi:** Item aktif memakai pergeseran kontras teks atau *sliding pill* (lihat `motion-primitives-animated-background.tsx`); wajib punya `focus-visible` ring bersih.
  - **Motion / Timing (jika relevan):** `140ms–180ms ease-out`.
- **Cocok untuk:** Marketing landing page SaaS, workspace app header, dan dokumentasi produk.
- **Hindari saat:** Isi header punya lebih dari 2 baris teks atau tombol CTA berukuran terlalu tinggi (>40px) di dalam bar `44px–64px`.

### Command Palette & Sliding Tab Switcher (Lego Assembly)
- **Sumber:** [`../../templates/navigation/shadcn-command.tsx`](../../templates/navigation/shadcn-command.tsx) & [`../../templates/navigation/motion-primitives-animated-background.tsx`](../../templates/navigation/motion-primitives-animated-background.tsx)
- **Tag:** `navigation`, `command-palette`, `tabs`, `keyboard-first`
- **Kenapa bagus:** Mengadopsi komponen Radix/cmdk + Motion `layoutId` produksi secara verbatim menjamin navigasi keyboard, ARIA attributes, dan transisi pill yang mulus tanpa bug buatan sendiri.
- **Aturan konkret:**
  - **Layout & Spacing:** Tab pill track memakai padding `3px–4px` dan radius konsentris (`radius_track - padding` untuk pill aktif); command dialog lebar `~520px–640px`.
  - **Radius, Border & Elevation:** Gunakan `1px` hairline border pada container dialog dan track tab; hindari shadow tebal berlapis.
  - **Tipografi & Warna:** Label mono kecil (`11px–12px`) untuk petunjuk `⌘K` / shortcut; ikuti palet *tinted neutrals* proyek.
  - **States & Interaksi:** Dukung penuh panah atas/bawah, `Enter`, `Escape`, dan `focus-visible`.
  - **Motion / Timing (jika relevan):** Spring ketat / `180ms` *shared layout* pada `animated-background.tsx`; hormati `prefers-reduced-motion`.
- **Cocok untuk:** Aplikasi produktivitas, dashboard admin, katalog data, dan toolbar filter.
- **Hindari saat:** Halaman statis sederhana yang hanya butuh 2–3 anchor link biasa.
