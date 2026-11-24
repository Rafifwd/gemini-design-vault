# AGENTS.md — Gemini Design Vault

## 1. Peran Workspace

Direktori ini adalah *Personal Design Reference Vault* dan tempat pengembangan skill `gemini-design`. Tujuan utamanya adalah mengumpulkan referensi desain nyata (komponen, halaman, motion, mood board) dan menerjemahkannya menjadi aturan konkret yang langsung bisa dipakai agent di sesi lain untuk menghindari AI slop.

## 2. Struktur Direktori

```text
HANDOFF.md                      # Brief project, status, backlog, starter prompt
AGENTS.md                       # Aturan kerja & skema entri referensi (file ini)
skill/
└── SKILL.md                    # Draft / versi kerja skill gemini-design
source/
└── *.md                        # Transkrip atau catatan sumber prinsip desain
references/
├── INDEX.md                    # Router kategori -> file referensi
├── TASTE-PROFILE.md            # Profil selera pribadi & personal anti-slop ban list
├── assets/                     # Screenshot, UI crop, mood board lokal
├── components/                 # Referensi per komponen (buttons, cards, nav, forms, data-viz)
└── pages/                      # Referensi per halaman/format (landing, dashboard, motion)
```

## 3. Skema Wajib Entri Referensi

**Jangan pernah menyimpan referensi hanya sebagai link atau nama brand.** Setiap entri yang ditambahkan ke `references/components/*.md` atau `references/pages/*.md` wajib mengikuti format berikut agar dapat langsung dieksekusi oleh agent:

```markdown
### [Nama Referensi / Gaya]
- **Sumber:** <URL atau path gambar di `references/assets/...`>
- **Tag:** `<komponen/halaman>`, `<vibe>`, `<kasus-pakai>`
- **Kenapa bagus:** 1–2 kalimat inti alasan visual/UX-nya bekerja.
- **Aturan konkret:**
  - **Layout & Spacing:** <ukuran, padding, gap, alignment, grid/density>
  - **Radius, Border & Elevation:** <border-radius, border/shadow, kontras surface>
  - **Tipografi & Warna:** <peran font, ukuran/weight, tracking, peran warna/aksen>
  - **States & Interaksi:** <hover, active/pressed, focus-visible, disabled, loading>
  - **Motion / Timing (jika relevan):** <durasi, easing, jeda baca, transisi>
- **Cocok untuk:** <konteks kapan gaya ini dipilih>
- **Hindari saat:** <konteks kapan gaya ini tidak cocok>
```

Jika informasi spesifik (misalnya hex warna atau angka pixel pasti) belum tersedia dari screenshot/deskripsi, tulis kisaran atau relasinya secara jujur — **jangan mengarang angka palsu**.

## 4. Aturan Pemeliharaan

1. **Selalu update `references/INDEX.md`** setiap kali file baru dibuat atau entri penting ditambahkan agar agent di sesi lain tidak perlu membaca semua file secara membabi buta.
2. **Simpan aset visual di `references/assets/`** dengan nama file deskriptif kebab-case (misalnya `btn-linear-tactile-dark.png`) dan tautkan dari file `.md` terkait.
3. **Jangan duplikasi corpus eksternal:** Untuk rujukan full-site di luar koleksi pribadi, arahkan ke `/home/rafif/.agents/skills/better-ui/REFERENCE-INDEX.md` dan `/home/rafif/.agents/skills/ui-ux-pro-max/scripts/search.py`.
4. **Konfirmasi sebelum overwrite skill global:** Perubahan pada `skill/SKILL.md` dan `references/` hanya boleh disalin/disinkronkan ke `/home/rafif/.agents/skills/gemini-design/` setelah user menyetujuinya.
