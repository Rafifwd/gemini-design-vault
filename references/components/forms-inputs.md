# Referensi Komponen — Forms & Inputs

> **Status:** `ready` — 3 pola form produksi (stack input/dialog/toast, validasi inline anti-popup native, dan auth form bersih) terhubung dengan template Lego.

## Prinsip Dasar Komponen Ini
- Label harus jelas, helper/error message muncul tepat di dekat field tanpa menggeser layout secara liar, dan target sentuh minimal `44x44px` di mobile.
- Empty state bukan hanya "Tidak ada data", melainkan memberi aksi lanjutan yang jelas.
- Wajib gunakan `noValidate` pada `<form>` dengan pesan validasi inline satu bahasa dengan antarmuka agar tidak memunculkan bubble popup bawaan browser.
- Pastikan tiap input memiliki satu ring fokus yang bersih (hindari `outline` default bertumpuk dengan `border`/`ring` kustom).

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

### Custom Inline Form Validation & Single Focus Ring (Anti-Native-Popup Pattern)
- **Sumber:** Temuan audit UI produksi `tennis-with-better-ui` + [`../../templates/forms/shadcn-input.tsx`](../../templates/forms/shadcn-input.tsx)
- **Tag:** `form`, `validation`, `inline-error`, `accessibility`, `anti-slop`
- **Kenapa bagus:** Menghilangkan tooltip popup HTML5 bawaan browser (`"Please fill out this field."`) yang bahasanya tidak konsisten dengan aplikasi dan sering merusak posisi visual form, sekaligus mencegah fokus ganda (`outline` browser + ring kustom bertumpuk).
- **Aturan konkret:**
  - **Layout & Spacing:** Taruh `<form noValidate>` di semua form interaktif (publik maupun admin); sisipkan pesan error inline tepat di bawah kolom terkait (`margin-top: 6px`) agar konteks tidak melompat.
  - **Radius, Border & Elevation:** Gunakan radius input konsisten (`6px–10px`), border `1px` netral saat diam, lalu ganti ke warna error semantik saat `aria-invalid="true"`; pakai tepat satu ring fokus (`outline: none` + `ring` tunggal 2px beropasitas rendah).
  - **Tipografi & Warna:** Pesan error memakai ukuran `12px`, `font-weight: 500`, satu bahasa dengan antarmuka (mis. Bahasa Indonesia di UI Indonesia), kontras tinggi pada latar halaman.
  - **States & Interaksi:** Validasi seluruh kolom wajib saat submit, pindahkan fokus ke kolom bermasalah pertama bila perlu, dan bersihkan pesan error kolom tersebut seketika saat pengguna mengetik ulang (`onChange`).
  - **Motion / Timing (jika relevan):** Transisi border/ring `120ms–150ms ease-out`; tanpa animasi getar agresif pada seluruh form.
- **Cocok untuk:** Form login admin, drawer booking/checkout, form modal CRUD, dan form pengaturan multi-kolom.
- **Hindari saat:** Mengandalkan atribut `required` tanpa `noValidate` atau menampilkan error hanya lewat toast yang hilang cepat.

### Clean Auth & Credential Form (Zero Dummy Placeholder Pattern)
- **Sumber:** Temuan audit portal admin `tennis-with-better-ui` + [`../../templates/forms/shadcn-input.tsx`](../../templates/forms/shadcn-input.tsx)
- **Tag:** `form`, `auth`, `login`, `security`, `anti-slop`
- **Kenapa bagus:** Kolom login dan kata sandi tanpa placeholder contoh fiktif (`admin@domain.id`, `••••••••`) tampak rapi, dewasa, dan autentik seperti produk siap pakai — bukan seperti mockup atau template demo AI.
- **Aturan konkret:**
  - **Layout & Spacing:** Pertahankan susunan vertikal bersih: label eksplisit di atas input (`gap 6px`), jarak antar field `16px`, dan satu tombol submit `StatefulButton` penuh atau sejajar.
  - **Radius, Border & Elevation:** Satu panel hairline `1px` bersih di atas canvas tenang; tanpa hiasan header pill atau ikon kunci dekoratif di dalam label yang sudah jelas.
  - **Tipografi & Warna:** Label wajib jelas (`Email Pengelola`, `Kata Sandi`), input `type="email"` dan `type="password"` dibiarkan kosong tanpa atribut `placeholder`; pertahankan `autoComplete="email"` / `"current-password"`.
  - **States & Interaksi:** Validasi panjang minimal atau format secara inline setelah submit via `noValidate`; tampilkan error kredensial salah dalam satu banner ringkas di form tanpa membocorkan detail teknis.
  - **Motion / Timing (jika relevan):** Status loading tombol submit menyatu di dalam tombol (`StatefulButton`) tanpa menggeser tata letak card login.
- **Cocok untuk:** Halaman login admin, portal masuk staf, form ubah kata sandi, dan input token/API key.
- **Hindari saat:** Memasukkan contoh format ke dalam `placeholder` untuk data sensitif (gunakan teks helper di bawah input hanya bila format benar-benar butuh penjelasan, mis. nomor WhatsApp).
