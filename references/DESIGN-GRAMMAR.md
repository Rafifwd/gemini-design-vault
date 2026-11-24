# Design Grammar — Art Direction, Warna & Komposisi

> **Status:** `ready` — disintesis dari 10 brand `DESIGN.md` nyata ([`../../design-systems/INDEX.json`](../../design-systems/INDEX.json), `VoltAgent/awesome-design-md`) dan prinsip `pbakaus/impeccable`.

## 1. Aturan Anti-Mode-Collapse Warna (Wajib)

**Dilarang memaksakan satu palet default ("krem + teal") ke semua proyek.**
Warna latar (*canvas*), suhu netral (*cool*, *pure white*, *warm paper*, atau *obsidian*), serta warna aksen **harus dipilih berdasarkan domain dan mode permukaan**, bukan kebiasaan tunggal:
- **Mode Permukaan (*Impeccable Modes*):**
  1. **Persuade** (landing page, marketing, pricing): Komitmen penuh pada arah seni yang berani, *hero visual* kuat, skala display dramatis.
  2. **Operate** (app UI, dashboard, settings, admin, tabel): Presisi, keterbacaan cepat, hierarki angka `tabular-nums`, dan kontrol tenang lebih penting daripada hiasan.
  3. **Read** (dokumentasi, artikel, changelog): Ritme tipografi nyaman (`60–70ch`), kontras baca tinggi.
  4. **Experience** (portofolio, galeri, showcase interaktif): Karya/produk memimpin sejak viewport pertama; chrome antarmuka surut ke belakang.

---

## 2. Matriks Domain → Suhu Warna & Art Direction (Berdasarkan `design-systems/*.md`)

| Domain Produk | Sistem Referensi (`design-systems/`) | Suhu Canvas & Surface | Ink & Aksen Disiplin | Karakter Tipografi & Komposisi |
| --- | --- | --- | --- | --- |
| **Klinik / Kesehatan / Presisi Konsumen** | [`apple.md`](../../design-systems/apple.md) | Pure gallery white `#FFFFFF` + cool parchment `#F5F5F7` + kontras blok gelap `#272729` | Ink `#1D1D1F`, aksen tunggal biru klinis `#0066CC` / `#0071E3` (atau emerald bersih) | Foto/produk memimpin, chrome tipis transparan, judul tight tracking (`-0.28px`), ruang putih lega |
| **Fintech / Pembayaran / B2B Trust** | [`stripe.md`](../../design-systems/stripe.md) | Pure `#FFFFFF` + ice-blue tint `#F6F9FC`, hairline `#E3E8EE` | Deep navy ink `#0D253D` / `#273951`, aksen `#533AFD`, data `#EA2261` | Display light weight (`300`) ber-tracking negatif (`-0.96px` s/d `-1.4px`), `tabular-nums` untuk nominal |
| **Industri / Gudang / Logistik / Hardware** | [`vercel.md`](../../design-systems/vercel.md) + [`supabase.md`](../../design-systems/supabase.md) | Cool utilitarian `#FAFAFA` / `#FFFFFF` (light) atau `#171717` (dark), hairline `#DFDFDF` | Ink `#171717`, 1 aksen sinyal tegas (misal emerald `#3ECF8E` atau safety amber/cobalt) | Kepadatan *Operate* tinggi, mono SKU/kode jelas, pemisahan tabel bersih tanpa card bersarang |
| **DevTools / AI Workbench / Dark App** | [`linear.app.md`](../../design-systems/linear.app.md) + [`supabase.md`](../../design-systems/supabase.md) | Obsidian `#010102` / `#0F1011` / `#1C1C1C` (bukan `#000` + neon) | Ink `#F7F8F8`, muted `#D0D6E0`, aksen terkalibrasi `#5E6AD2` / `#3ECF8E` | Header *frosted* dengan `1px` border `0.08`, radius `6px–8px`, shortcut keyboard `⌘K` |
| **Editorial / Konten / AI Humanist** | [`claude.md`](../../design-systems/claude.md) + [`notion.md`](../../design-systems/notion.md) | Warm paper `#FAF9F5` / `#F5F0E8` *(krem hanya cocok di domain ini!)* atau crisp white `#FFFFFF` | Ink `#141413` / `#0A1530`, aksen terracotta `#CC785C` atau indigo `#5645D4` | Kontras serif display (`Copernicus`/`Newsreader`) + humanist sans untuk ritme baca editorial |
| **Kreatif / Kolaborasi / Media** | [`figma.md`](../../design-systems/figma.md) + [`spotify.md`](../../design-systems/spotify.md) | Crisp monochrome `#FFFFFF` + blok warna cerita (`#DCEEB1`, `#C5B0F4`, `#F4ECD6`) atau dark `#121212` / `#181818` | Ink `#000000` (light) / `#FFFFFF` (dark), warna hanya sebagai *story block* atau *media artwork* | Display besar (`48px–86px`), blok warna terkurasi sebagai pemisah naratif, bukan gradien acak |

---

## 3. Tata Bahasa Komposisi & Ritme Spasial

1. **Alokasi Warna 60–30–10:**
   - **60% Canvas & Whitespace:** Ruang napas yang menyatukan layar (putih galeri, ice-slate, obsidian, atau kertas hangat sesuai tabel di atas).
   - **30% Structural Surface & Ink:** Surface bertingkat tipis (`±3–6%` geseran luminance) + `1px` hairline border untuk memisahkan hierarki tanpa shadow berat.
   - **10% Chromatic Event:** Maksimal 1 aksen utama yang benar-benar memandu mata ke aksi terpenting (CTA primer, status aktif, atau fokus input).
2. **Asimetri & Bobot Visual (Anti-Grid 3-Kotak Simetris):**
   - Hindari selalu menaruh 3 kartu berukuran sama persis sejajar. Gunakan komposisi **Split Asimetris** (`7fr / 5fr`, `1.4fr / 1fr`), **Bento Grid**, atau **Strip Metrik Datar** (1 panel bersekat hairline, bukan 3 kartu terpisah dengan shadow).
3. **Kontras Skala Tipografi:**
   - Pastikan rasio ukuran `Display H1 : Body` tegas (minimal `2.2×–3.5×`, misalnya `48px–64px` dibanding `15px–16px` pada halaman *Persuade*, atau `20px–24px` dibanding `13px` pada mode *Operate*).
   - Gunakan *negative letter-spacing* pada display headline (`-0.02em` hingga `-0.04em`) dan *line-height* lega (`1.45–1.55`) pada teks body.
4. **Ruang Negatif sebagai Struktur:**
   - Gunakan perubahan jarak (*spacing rhythm*: `4px / 8px / 12px / 20px / 32px`) sebelum menambahkan garis divider atau kotak card baru.
