# Điện tử Đà Nẵng — Website bán linh kiện điện tử

Website bán linh kiện điện tử hoàn chỉnh với trang quản trị hỗ trợ nhập/xuất danh sách hàng & tồn kho giống bảng Excel.

## 🚀 Chạy tại địa phương
Mở `index.html` bằng trình duyệt (không cần cài đặt gì).

## 🌐 Deploy miễn phí lên web thật

Website là **tĩnh** (HTML/CSS/JS) nên deploy rất dễ. Chọn **1 trong 4** cách sau:

### Cách 1 — GitHub Pages (tên miền `https://<user>.github.io/WebLKDT`) ⭐ Đề xuất
1. Tạo tài khoản GitHub (miễn phí): https://github.com
2. Tạo repo mới tên `WebLKDT` (công khai).
3. Trong thư mục dự án, chạy:
   ```bash
   git init
   git add .
   git commit -m "Deploy website"
   git branch -M main
   git remote add origin https://github.com/<username>/WebLKDT.git
   git push -u origin main
   ```
4. Vào repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch `main` → Save.
5. Sau ~1 phút, web chạy tại: `https://<username>.github.io/WebLKDT/`

> ⚠️ Vì repo là tĩnh, luôn mở bằng `index.html`. Nếu cần tên miền riêng, vào Pages → Custom domain.

### Cách 2 — Netlify Drop (kéo-thả, không cần git) ⭐ Dễ nhất
1. Truy cập https://app.netlify.com/drop (đăng nhập miễn phí).
2. **Kéo nguyên thư mục `WebLKDT`** và thả vào trang web.
3. Netlify tự deploy, cấp tên miền `https://<ten-song>.netlify.app`.

### Cách 3 — Vercel
1. Truy cập https://vercel.com (đăng nhập miễn phí).
2. **New project → deploy** (có thể kéo thả hoặc import từ GitHub).
3. Framework Preset: **Other** (tĩnh). Deploy xong có tên miền `https://<ten>.vercel.app`.

### Cách 4 — Cloudflare Pages
1. https://pages.cloudflare.com → tạo project → upload thư mục `WebLKDT`.
2. Nhận tên miền `https://<ten>.pages.dev`.

## 🔑 Tài khoản quản trị mặc định
- **Admin:** `admin` / `admin123` (trang `admin.html`)
- **Voucher:** `DN10`, `DN20`, `DN30`

## 📊 Công cụ nhập/xuất hàng (Admin)
- **Xuất Excel (.xlsx)** / **CSV**: tải file danh sách sản phẩm + tồn kho về máy.
- **Nhập**: kéo-thả file Excel/CSV vào, xem trước rồi xác nhận.
- **Chỉnh sửa trực tiếp** như bảng Excel (nhấp đúp vào ô).
- **Quản lý đơn hàng** & tồn kho.

## ⚠️ Lưu ý quan trọng về dữ liệu
- Dữ liệu (sản phẩm, giỏ hàng, đơn hàng, tài khoản) lưu trong **localStorage** của Trình duyệt.
- **Admin** dùng trên máy này → dữ liệu kho/đơn hàng nằm ở máy này → hoạt động tốt.
- **Khách hàng online** sẽ có giỏ hàng riêng của họ. Đơn hàng khách đặt sẽ lưu trên trình duyệt khách đó — **không tự đồng bộ về máy admin**.
  - Nếu cần mọi đơn hàng gom về máy admin, cần thêm backend/database (ví dụ Google Sheets + Apps Script, hoặc backend nhỏ miễn phí). Hỏi để được hỗ trợ.

## 📁 Cấu trúc
```
index.html        cửa hàng
checkout.html     thanh toán
admin.html        quản trị
css/              giao diện
js/data.js        dữ liệu + Excel nhập/xuất
js/main.js        logic bán hàng
js/admin.js       logic quản trị
js/auth.js        đăng nhập
js/checkout.js    thanh toán
