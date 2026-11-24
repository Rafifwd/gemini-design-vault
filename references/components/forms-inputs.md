# Referensi Komponen — Forms & Inputs

> **Status:** `seeded` — terhubung dengan template Lego produksi (`shadcn/ui` & `Emil Kowalski / Sonner`).

## Prinsip Dasar Komponen Ini
- Label harus jelas, helper/error message muncul tepat di dekat field tanpa menggeser layout secara liar, dan target sentuh minimal `44x44px` di mobile.
- Empty state bukan hanya "Tidak ada data", melainkan memberi aksi lanjutan yang jelas.

## Verbatim Lego Templates (`templates/forms/` & `templates/motion/`)
- **Accessible Input dengan focus-visible ring tokens:** [`shadcn-input.tsx`](../../templates/forms/shadcn-input.tsx) (`shadcn-ui/ui`, 20 baris)
- **Accessible Radix Modal Dialog:** [`shadcn-dialog.tsx`](../../templates/forms/shadcn-dialog.tsx) (`shadcn-ui/ui`, 158 baris)
- **Accordion / Inline Disclosure halus:** [`motion-primitives-disclosure.tsx`](../../templates/motion/motion-primitives-disclosure.tsx) (`ibelick/motion-primitives`, 191 baris)
- **Production Toast CSS (easing, stacking, shadow):** [`sonner-styles.css`](../../templates/motion/sonner-styles.css) (`emilkowalski/sonner`, 729 baris)

---

## Koleksi Referensi

### Crisp Input, Modal & Toast Feedback Stack (shadcn/ui + Sonner)
- **Sumber:** [`../../templates/forms/shadcn-input.tsx`](../../templates/forms/shadcn-input.tsx), [`../../templates/forms/shadcn-dialog.tsx`](../../templates/forms/shadcn-dialog.tsx), & [`../../templates/motion/sonner-styles.css`](../../templates/motion/sonner-styles.css)
- **Tag:** `form`, `input`, `dialog`, `toast`
- **Kenapa bagus:** Menggabungkan aksesibilitas Radix (`Dialog`, `aria-invalid`, keyboard `Escape`) dengan kurva animasi dan *stacking shadow* produksi nyata dari `sonner-styles.css`.
- **Aturan konkret:**
  - **Layout & Spacing:** Tinggi input `34px–40px` di desktop (`44px` area sentuh di mobile); jarak label-input `6px`, jarak antar field `14px–16px`.
  - **Radius, Border & Elevation:** Radius input/dialog selaras dengan kontrol tombol (`6px–10px`); border `1px` netral halus saat diam dan ring fokus jelas saat `:focus-visible`.
  - **Tipografi & Warna:** Placeholder lebih redup daripada nilai input; pesan validasi memakai warna semantik kontras tinggi tanpa mengubah posisi elemen lain.
  - **States & Interaksi:** Dukung `default`, `focus-visible`, `aria-invalid`, `disabled`, dan umpan balik simpan via toast stack (`sonner-styles.css`) atau banner inline.
  - **Motion / Timing (jika relevan):** Transisi input `140ms`; toast/dialog memakai kurva cepat-di-awal (`cubic-bezier(0.16, 1, 0.3, 1)` seperti di `sonner-styles.css`).
- **Cocok untuk:** Halaman pengaturan, form filter dashboard, modal konfirmasi, dan alur CRUD aplikasi.
- **Hindari saat:** Menampilkan terlalu banyak field sekaligus tanpa pengelompokan atau disclosure bertahap.
