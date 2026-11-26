# Adaptasi Lego — Stack-Agnostic, Zero Forced Dependencies

> **Status:** `ready` — aturan menerjemahkan komponen di `templates/` (28 unggulan + 195 `goodui.dev`) ke stack apa pun tanpa memaksa dependency baru. Buka file ini tepat sebelum merakit kode (Fase 2 `SKILL.md`), bukan saat riset tema.

## Prinsip Dasar

- Isi `templates/` adalah **cetak biru craft dan perilaku**, bukan paket yang wajib dipasang. Default: bangun ulang pola di stack milik project.
- Dependency baru (`motion`, `radix-ui`, `tailwindcss`, `lucide-react`, `cmdk`, `class-variance-authority`) hanya masuk jika `package.json` project sudah memilikinya atau user menyetujuinya secara eksplisit.
- Pilih Lego dengan `python3 <skill_dir>/scripts/query_vault.py lego ...`, lalu buka hanya 2–4 file hasilnya.

## Langkah: Pilih Mode (Selesai bila mode tercatat sebelum menulis kode)

1. Baca `package.json` / `composer.json` / `pubspec.yaml` / config styling project.
2. Cocokkan dengan matriks:

| Kondisi project | Mode | Artinya |
| --- | --- | --- |
| React 19 + Tailwind + `motion` sudah terpasang | **B — Direct Drop-in** | Salin `.tsx`, ganti alias import (`@/lib/utils`, `@/lib/goodui-motion`, `@/lib/goodui-locale`), skin ulang dengan token Color World & Style Pack proyek |
| React 18, atau React tanpa Tailwind / `motion` | **A — Blueprint Translation** | Ambil token, timing, state machine, ARIA; tulis ulang dengan styling & animasi project |
| Vue/Nuxt, Svelte, Astro, Angular, Laravel/Blade, PHP, Vanilla HTML/CSS/JS, Flutter, React Native | **A — Blueprint Translation** | Sama; gunakan primitive native stack tersebut |
| User secara eksplisit mengizinkan install package | **B**, hanya untuk package yang disebut user | Catat izin di ringkasan tema |

Tier dari `query_vault.py lego`: `css-token-only` (ambil nilainya langsung), `light-behavior` (porting ringan ke JS biasa), `blueprint-translate` (wajib lewat Mode A kecuali stack cocok).

## Mode A — Blueprint Translation: 5 Hal yang Diekstrak

1. **Geometri & token:** radius, padding, tinggi, hairline, elevation. Sumber: file Lego, `rea/*.json`, `STYLE-PACKS.md`. Jadikan CSS custom property (`--radius-btn`, `--radius-card`, `--radius-inner`, `--accent`, `--canvas`, `--surface`).
2. **Fisika & timing:** kurva `cubic-bezier(.23,1,.32,1)` (out), `cubic-bezier(.16,1,.3,1)` (out-expo), `cubic-bezier(.77,0,.175,1)` (in-out), `cubic-bezier(.32,.72,0,1)` (drawer); spring `snap` ≈ `180ms`, `ui` ≈ `280ms`, `morph` ≈ `400ms`, `sheet` ≈ `450ms` (nilai dari `templates/goodui/lib/goodui-motion/motion.tsx`). Press feedback: `scale(.97)` dengan transisi `120ms`.
3. **State machine:** tulis tabel state sebelum kode. Contoh: `HoldToConfirm` = `idle → holding(progress 0..1) → confirmed → reset` dengan rewind `200ms` bila dilepas dini; `StatefulButton` = `idle → loading → success | error → idle`.
4. **Kontrak aksesibilitas:** peran ARIA, `aria-pressed`, teks `sr-only` untuk status async, keyboard (`Enter`, `Space`, `Escape`, panah), `focus-visible`, `prefers-reduced-motion`.
5. **Web API murni:** `templates/goodui/lib/sounds/sounds.ts` berisi resep Web Audio (`tone`, `noise`, `RECIPES`, `schedule`, `play`) yang dapat dipindah ke JS biasa; hanya `useSound` dan `SoundProvider` yang bergantung pada React. Suara tetap mati secara default dan hanya berbunyi dalam user gesture.

## Peta Translasi Lintas Stack

| Sumber di Lego | Terjemahan zero-dependency |
| --- | --- |
| `motion/react` (`spring`, `layoutId`, `AnimatePresence`) | CSS `transition` + `cubic-bezier` atau `linear()`; Web Animations API; View Transitions API untuk shared-layout; `<Transition>` (Vue), `svelte/transition` (Svelte) |
| `radix-ui` (`Dialog`, `Tabs`, `Popover`, `Slot`) | `<dialog>`, `<details>`, atribut `popover`, roving tabindex manual; atau headless library yang sudah ada di repo |
| `cmdk` (command palette) | Input + `role="listbox"` + `aria-activedescendant`, filter fuzzy kecil buatan sendiri |
| `lucide-react` | Icon set yang sudah dipakai repo; inline SVG hanya untuk primitif geometris sederhana (lihat aturan ikon di bawah) |
| Kelas Tailwind (`bg-primary`, `rounded-lg`) | Custom property + CSS Modules / SCSS / UnoCSS / styling project; pertahankan nilai angkanya |
| `class-variance-authority` | Atribut `data-variant` / `data-size` + selector CSS |
| `cn()` helper | Gabung class manual atau utilitas bawaan framework |

## Aturan Ikon Brand & Ikon Kompleks (Mode A)

Zero forced dependency **bukan** izin untuk menggambar logo brand atau ikon rumit dari ingatan LLM:
- **Primitif geometris sederhana** (panah, chevron, plus, silang, centang, cari, menu, kalender): boleh ditulis sebagai inline SVG bersih (`viewBox="0 0 24 24"`, `stroke-width` `1.5–1.75`).
- **Logo brand** (WhatsApp, Google, Instagram, GitHub, X, TikTok, logo pembayaran): **DILARANG** digambar manual dari ingatan dan **DILARANG** menyalin path hasil ringkasan web search. Selalu ambil **raw canonical SVG** langsung dari [Simple Icons](https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/) (`cdn.jsdelivr.net/npm/simple-icons@latest/icons/<slug>.svg`) atau brand kit resmi (`fill="currentColor"`, `stroke="none"`).
- **Ikon UI kompleks** (roda gigi/settings, globe, piala, dll.): pakai icon library yang sudah ada di proyek, ambil raw canonical SVG dari `lucide-static` / Tabler / Heroicons, atau minta izin user memasang `lucide-react` bila layar membutuhkan `>10` ikon UI.

## Catatan Khusus Registry `goodui.dev`

- `lib/goodui-motion/motion.tsx` merender `<style href="pc-tokens" precedence="default">`, fitur **React 19**. Di React 18 atau stack lain, salin isi `TOKENS_CSS` ke stylesheet global lalu hapus komponennya.
- Komponen mengimpor `@/lib/goodui-locale` (label, formatter `Intl`) dan sering `@/lib/goodui-sounds`. Ganti dengan i18n project atau string literal, dan hapus prop `sound` bila project tidak memakai suara.
- 100 dari 195 item memakai `motion`; 77 memakai `lucide-react`; cek `deps` di output `query_vault.py lego` sebelum memutuskan mode.
- Kategori `blocks` (39 section utuh) adalah inspirasi struktur layout. Ambil ritme dan hierarkinya, rakit ulang dari komponen kecil, dan jangan salin satu blok utuh.
- Lisensi: `goodui.dev` (registry publik gratis) dan sumber MIT lain tertera di `templates/INDEX.json`; pertahankan atribusi bila menyalin kode verbatim pada Mode B.

## Cek Akhir (Selesai bila semua `Ya`)

- Tidak ada dependency baru di `package.json` / manifest tanpa persetujuan user.
- Setiap Lego yang dipakai sudah di-skin ke token proyek (tidak ada warna demo bawaan).
- State, ARIA, keyboard, dan `prefers-reduced-motion` dari file asal tetap ada di hasil.
- Maksimal 2–4 Lego aktif per layar.
