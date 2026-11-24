# Referensi Komponen — Cards & Lists

> **Status:** `seeded` — dilengkapi observasi radius/surface dari REA Linear & Raycast serta template Lego produksi (`shadcn/ui`, `Magic UI`, `Motion Primitives`).

## Prinsip Dasar Komponen Ini
- Jangan otomatis membungkus setiap item dengan card + border + shadow + divider. Uji dulu apakah cukup dengan whitespace, tipografi, atau perubahan latar halus.
- Jika list padat, hindari subtitle berulang dan divider yang terlalu ramai; rapikan alignment ikon ke sel/baris.

## Verbatim Lego Templates (`templates/cards/` & `templates/motion/`)
- **Composable Card (`Card`, `CardHeader`, `CardContent`, `CardFooter`):** [`shadcn-card.tsx`](../../templates/cards/shadcn-card.tsx) (`shadcn-ui/ui`, 91 baris)
- **Semantic Badge variants:** [`shadcn-badge.tsx`](../../templates/cards/shadcn-badge.tsx) (`shadcn-ui/ui`, 47 baris)
- **Asymmetric 3-column Bento Grid showcase:** [`magicui-bento-grid.tsx`](../../templates/cards/magicui-bento-grid.tsx) (`magicuidesign/magicui`, 109 baris)
- **Subtle perimeter highlight (maks 1 focal card/viewport):** [`magicui-border-beam.tsx`](../../templates/cards/magicui-border-beam.tsx) (`magicuidesign/magicui`, 107 baris)
- **Shared-layout morphing card-to-dialog:** [`motion-primitives-morphing-dialog.tsx`](../../templates/motion/motion-primitives-morphing-dialog.tsx) (`ibelick/motion-primitives`, 422 baris)

---

## Koleksi Referensi

### Single-Layer Hairline Card & Bento Grid (Linear / Raycast + Magic UI)
- **Sumber:** [`../../rea/linear.json`](../../rea/linear.json), [`../../rea/raycast.json`](../../rea/raycast.json), & [`../../templates/cards/magicui-bento-grid.tsx`](../../templates/cards/magicui-bento-grid.tsx)
- **Tag:** `card`, `bento`, `surface`, `anti-slop`
- **Kenapa bagus:** Dari pengukuran REA Linear (`rgb(15, 16, 17)` di atas `rgb(8, 9, 10)`, radius `8px`) dan Raycast (`rgb(17, 18, 20)` di atas `rgb(7, 8, 10)`, radius `12px`), kartu dipisahkan lewat langkah surface halus dan `1px` border — bukan card bersarang atau garis aksen kiri.
- **Aturan konkret:**
  - **Layout & Spacing:** Gunakan maksimal 1 lapis kartu; di dalam grid bento (`magicui-bento-grid.tsx`), variasikan `col-span` agar tidak menjadi 3 kotak simetris membosankan.
  - **Radius, Border & Elevation:** Radius kartu `8px–12px` (`10px–12px` pada panel utama); pakai `1px` hairline border + shadow ultra-tipis, hindari `border-left: 4px` dekoratif.
  - **Tipografi & Warna:** Judul ringkas + maksimal 1 baris deskripsi sekunder yang diredam; badge status memakai latar *tinted* beropasitas rendah (`shadcn-badge.tsx`).
  - **States & Interaksi:** Pada bento showcase interaktif, CTA muncul halus di bagian bawah kartu saat hover/focus tanpa menggeser tata letak di atasnya.
  - **Motion / Timing (jika relevan):** `140ms–200ms ease-out`; jika memakai `magicui-border-beam.tsx`, batasi maksimal pada **1 focal card** saja per viewport.
- **Cocok untuk:** Feature showcase SaaS, ringkasan KPI datar (`.kpi-strip`), dan galeri produk.
- **Hindari saat:** Membungkus tabel atau list panjang di dalam nested card berlapis-lapis.
