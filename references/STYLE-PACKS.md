# Style Packs & Material Systems (`goodui.dev` REA Architecture)

> **Status:** `ready` — disintesis dari arsitektur tema `https://goodui.dev/docs/styles`, `https://goodui.dev/materials`, dan REA capture [`../rea/goodui.json`](../rea/goodui.json). Semua token di bawah ditulis sebagai sistem CSS bersih untuk dipakai ulang oleh agent di proyek mana pun.

---

## 1. Orthogonal Theme Architecture (`8 × 8 × 2 = 128 Kombinasi`)

Alih-alih membuat tema hard-coded satu per satu, pisahkan sistem menjadi 3 sumbu independen pada `<html>` / `:root`:
1. **`data-style`** (mengatur geometri, ketebalan border, shadow, radius, dan pasangan font).
2. **`data-accent`** (mengatur `--primary`, `--primary-ink`, `--ring`, dan `--accent-soft`).
3. **`data-mode` (`light` | `dark`)** (membalik polaritas `--canvas`, `--surface`, `--surface-2`, `--ink`, dan `--border`).

---

## 2. Katalog 8 Style Packs (`[data-style]`)

### 1) `clean` — Calm Utility Default
- **Karakter:** Bersih, modern, proporsional (basis `shadcn/ui` modern).
- **Tokens:** `--radius-card: 12px`, `--radius-inner: 8px`, `--radius-btn: 8px`, `--border-w: 1px`, `--border-color: rgba(15,23,42,0.10)` (dark `rgba(255,255,255,0.10)`), `--shadow-card: 0 1px 2px rgba(0,0,0,0.04)`, `--font-display: Inter / Plus Jakarta Sans`, `--font-body: Inter`.
- **Cocok untuk:** SaaS produktivitas, CRM, booking app, admin dashboard netral.

### 2) `brutal` — Neobrutal Bold & Offset
- **Karakter:** Garis batas tebal hitam pekat, bayangan keras tanpa blur (`box-shadow: 4px 4px 0 #111`), warna latar berenergi tinggi.
- **Tokens:** `--radius-card: 8px`, `--radius-inner: 6px`, `--radius-btn: 8px`, `--border-w: 2.5px`, `--border-color: #111111` (dark `#F5F5F0`), `--shadow-card: 4px 4px 0 #111111` (hover tekan: `translate(2px, 2px)` + `2px 2px 0`), `--font-display: Space Grotesk / Syne`.
- **Cocok untuk:** Produk kreator, developer tool indie, campaign event, storefront berani.
- **Hindari saat:** Aplikasi medis klinis atau layanan keuangan konservatif yang butuh ketenangan tinggi.

### 3) `glass` — Frosted Translucent Over Aurora
- **Karakter:** Panel kaca buram bertumpuk di atas latar gradien aurora multi-hue yang lembut, dengan tepi cahaya atas `inset 0 1px 0 rgba(255,255,255,0.45)`.
- **Tokens:** `--radius-card: 18px`, `--radius-inner: 12px`, `--radius-btn: 999px`, `--border-w: 1px`, `--border-color: rgba(255,255,255,0.28)`, `--surface: rgba(255,255,255,0.58)` (dark `rgba(17,20,28,0.56)`), `backdrop-filter: blur(18px) saturate(165%)`, kontras teks dijamin `>= 4.5:1`.
- **Cocok untuk:** Media player, AI workspace modern, overlay control stage, dashboard visual di atas backdrop dinamis.
- **Hindari saat:** Diletakkan di atas canvas putih polos (kaca menjadi abu-abu kusam).

### 4) `retro98` — Classic Bevel & Teal Desktop
- **Karakter:** Nostalgia workstation 90-an: desktop teal `#008080`, jendela abu-abu `#C0C0C0`, title bar biru navy `#000080` → `#1084D0`, radius nol mutlak, bevel 3D 2-sisi (*highlight* putih + *shadow* gelap).
- **Tokens:** `--radius-card: 0px`, `--radius-inner: 0px`, `--radius-btn: 0px`, `--canvas: #008080` (dark `#0F2626`), `--surface: #C0C0C0` (dark `#2B2E33`), `--shadow-card: inset 1.5px 1.5px 0 #FFFFFF, inset -1.5px -1.5px 0 #404040, 2px 2px 0 rgba(0,0,0,0.35)`, `--shadow-inset: inset 1.5px 1.5px 0 #404040, inset -1.5px -1.5px 0 #FFFFFF`.
- **Cocok untuk:** Alat retro/synth, portofolio kreatif playful, interactive microsite nostalgia.

### 5) `pixel` — 8-Bit Arcade Stepped Grid
- **Karakter:** Sudut siku tajam `0px`, tipografi monospace/arcade, border ganda bertingkat (`2px solid`), bayangan stepped piksel keras, indikator terkuantisasi.
- **Tokens:** `--radius-card: 0px`, `--radius-inner: 0px`, `--radius-btn: 0px`, `--border-w: 2px`, `--shadow-card: 4px 0 0 0 currentColor, 0 4px 0 0 currentColor` atau offset pixel blok `4px 4px 0`, `--font-display: JetBrains Mono / Silkscreen`.
- **Cocok untuk:** Developer playground, game tool, retro hackathon, telemetry indie.

### 6) `soft` — Molded Claymorphism
- **Karakter:** Permukaan empuk seolah dicetak dari tanah liat/silikon matte: radius besar, tanpa garis border tajam, mengandalkan kombinasi shadow luar lembut + 2 inner shadow (terang di atas kiri, bayangan di bawah kanan).
- **Tokens:** `--radius-card: 24px`, `--radius-inner: 16px`, `--radius-btn: 999px`, `--border-w: 0px`, `--shadow-card: 0 14px 30px -10px rgba(15,23,42,0.14), inset 0 2px 3px rgba(255,255,255,0.85), inset 0 -4px 8px rgba(15,23,42,0.06)`.
- **Cocok untuk:** Aplikasi edukasi, wellness ramah, produk konsumen playful.

### 7) `swiss` — International Typographic Grid
- **Karakter:** Disiplin poster Swiss: grid rapat `0px` radius, hairline hitam/abu tajam, latar putih bersih (atau obsidian di dark), dan aksen tunggal menyala (standar klasik Swiss `#E10600`), angka `tabular-nums`.
- **Tokens:** `--radius-card: 0px`, `--radius-inner: 0px`, `--radius-btn: 0px`, `--border-w: 1px`, `--border-color: #111111` (dark `#3A3A3C`), `--shadow-card: none`, `--font-display: Inter / Space Grotesk (tight tracking -0.04em)`.
- **Cocok untuk:** Majalah digital, arsitektur, museum, katalog teknis, fintech editorial.

### 8) `luxe` — Editorial Gold & Obsidian Atelier
- **Karakter:** Ruang galeri gelap hangat (`#0B0B0D` light-switchable ke `#FAF8F4` ivory), judul serif berwibawa (`Instrument Serif`), garis rambut emas hangat (`#D4AF37` / `#B69121`) beropasitas rendah, ruang napas lega.
- **Tokens:** `--radius-card: 6px`, `--radius-inner: 4px`, `--radius-btn: 4px`, `--border-w: 1px`, `--border-color: rgba(212,175,55,0.28)`, `--accent: #D4AF37`, `--font-display: Instrument Serif`.
- **Cocok untuk:** Jam tangan/atelier mewah, otomotif flagship, perhotelan butik, fashion editorial.

---

## 3. 4 Material Surfaces (`goodui.dev/materials` Guardrails)

| Material | Mekanisme Cahaya & Shadow | Aturan Wajib Anti-Slop |
| --- | --- | --- |
| **Glassmorphism** | `backdrop-filter: blur(14px–20px) saturate(165%)` + rim atas `rgba(255,255,255,0.45)` | Pastikan opasitas tint panel cukup agar rasio teks `>= 4.5:1` di semua titik backdrop. |
| **Claymorphism** | Radius besar (`20px–26px`) + 1 outer shadow + 2 inner shadows berlawanan | Jangan pakai di tabel keuangan padat; jaga warna tetap ramah dan konsisten arah cahayanya. |
| **Skeuomorphism** | Brushed surface, well tertekan (*recessed*), sakelar mekanis, highlight searah | Arah sumber cahaya wajib seragam dari atas-kiri pada semua kontrol di satu layar. |
| **Neumorphism** | Extrude & indent dari satu warna dasar permukaan lewat dua shadow terarah | Wajib tambahkan `1px` border kontras rendah di `focus-visible` agar kontrol tetap jelas untuk aksesibilitas. |

---

## 4. 8 Accent Swatch Presets (`[data-accent]`)

| Preset | `--accent` | `--accent-ink` | `--accent-soft` |
| --- | --- | --- | --- |
| `ink` | `#18181B` (dark `#F4F4F5`) | `#FFFFFF` (dark `#18181B`) | `rgba(24,24,27,0.10)` |
| `cobalt` | `#2563EB` | `#FFFFFF` | `rgba(37,99,235,0.14)` |
| `violet` | `#7C3AED` | `#FFFFFF` | `rgba(124,58,237,0.14)` |
| `rose` | `#E11D48` | `#FFFFFF` | `rgba(225,29,72,0.14)` |
| `flame` | `#FA520F` | `#FFFFFF` | `rgba(250,82,15,0.14)` |
| `amber` | `#F59E0B` | `#181204` | `rgba(245,158,11,0.16)` |
| `lime` | `#9FE870` | `#163300` | `rgba(159,232,112,0.18)` |
| `forest` | `#0F766E` | `#FFFFFF` | `rgba(15,118,110,0.14)` |
