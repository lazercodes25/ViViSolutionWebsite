# Điện tử E-Solution Đà Nẵng — Website bán linh kiện điện tử

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
- **Quản lý banner quảng cáo**: vào nút "Quảng cáo" để thêm/sửa/xóa ảnh banner hiển thị trên trang chủ.

## 📱 Trang chủ & Thanh toán
- Trang chủ hiển thị **số điện thoại** `0773372913` và **email** `xuantung2521@gmail.com` (thay cho thông tin tồn kho/tổng giá trị).
- Trang thanh toán hỗ trợ **COD** (thanh toán khi nhận hàng).

## 📧 Gửi email thông báo đơn hàng

Khi khách đặt hàng thành công, hệ thống gửi email thông báo về địa chỉ **xuantung2521@gmail.com**. Để tính năng này hoạt động, **bắt buộc** phải có môi trường Node.js và cấu hình SMTP:

> ⚠️ **Lý do email chưa gửi được**: dự án này hiện **chưa có file `.env`** (chỉ có `.env.example`) và **chưa cài `node_modules`**, đồng thời máy đang chưa cài **Node.js**. Bên cạnh đó, nếu bạn vừa mở thẳng `index.html` (file tĩnh) thì không có máy chủ để nhận yêu cầu gửi email.

### Các bước cấu hình (1 lần duy nhất)

1. **Cài Node.js** (nếu chưa có): tải tại https://nodejs.org (bản LTS). Sau đó mở lại Command Prompt / Terminal.

2. **Cài thư viện**: trong thư mục dự án chạy:
   ```bash
   npm install
   ```

3. **Tạo file `.env`**: sao chép nội dung `.env.example` thành file tên `.env` rồi điền đúng mật khẩu ứng dụng:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=xuantung2521@gmail.com
   SMTP_PASS=XXXX XXXX XXXX XXXX
   ORDER_RECIPIENT=xuantung2521@gmail.com
   PORT=3000
   ```

   > **Cách lấy `SMTP_PASS` (mật khẩu ứng dụng Gmail):**
   > 1. Bật **Xác minh 2 bước** cho tài khoản Gmail: https://myaccount.google.com/security
   > 2. Vào **Mật khẩu ứng dụng**: https://myaccount.google.com/apppasswords
   > 3. Tạo một mật khẩu ứng dụng rồi dán vào `SMTP_PASS` (gồm 4 cụm, có hoặc không có dấu cách đều được).
   > ❌ *Không dùng mật khẩu đăng nhập Gmail thường* — Gmail sẽ chặn.

4. **Chạy server** (bắt buộc, không mở thẳng `index.html`):
   ```bash
   npm start
   ```
   Rồi mở trình duyệt tại địa chỉ: **http://localhost:3000**
   (Server đọc file tĩnh và nhận yêu cầu gửi email qua `/api/order-email`.)

> Khi chạy bằng server, địa chỉ trang chủ và thanh toán phải là `http://localhost:3000`. Nếu bạn mở `index.html` trực tiếp từ thư mục (đường dẫn `file://`), email sẽ **không** gửi được vì không có backend.

### Dùng dịch vụ mail khác
Bạn có thể đổi `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` tương ứng (ví dụ Zoho, Outlook...) trong file `.env`.

## 🖥️ Danh mục sản phẩm ở bên trái
- Trên **màn hình lớn (máy tính)**: danh mục nằm cố định ở **cột trái** (Tất cả / Vi xử lý / Bo mạch ...).
- Trên **điện thoại**: danh mục thu gọn thành nút **"☰ Danh mục"**; bấm vào để mở panel danh mục từ bên trái, chọn xong sẽ tự đóng.

## ☁️ Đồng bộ dữ liệu dùng chung qua Supabase (sản phẩm, ảnh, banner, đơn hàng)

Website đã được tích hợp **Supabase** để đồng bộ **sản phẩm + ảnh + banner + đơn hàng** giữa các trình duyệt/máy (kể cả cửa sổ ẩn danh). Nhờ đó:
- Ảnh quản trị viên tải lên được lưu vào **Supabase Storage** (URL công khai) → **trình duyệt ẩn danh / máy khác đều hiển thị ảnh**.
- Danh sách sản phẩm, banner, đơn hàng được lưu trên đám mây dùng chung.
- Vẫn có **fallback localStorage** nếu không kết nối được Supabase.

> 🟢 **Giải pháp cho lỗi "tải ảnh lên nhưng mở trình duyệt ẩn danh không thấy":** ảnh trước đây được lưu dạng base64 trong localStorage của trình duyệt (chỉ tồn tại trên máy đó). Nay ảnh được upload lên Supabase Storage và lưu **URL công khai**, nên bất kỳ thiết bị/trình duyệt nào cũng tải được.

### 1. Tạo bảng trong Supabase (SQL Editor → Run)
```sql
create table if not exists public.products (
  id bigint primary key,
  raw text
);
create table if not exists public.orders (
  id bigint primary key,
  raw text
);
create table if not exists public.banners (
  id bigint primary key,
  raw text
);
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.banners enable row level security;
create policy "public read products" on public.products for select using (true);
create policy "public read orders" on public.orders for select using (true);
create policy "public read banners" on public.banners for select using (true);
create policy "public insert products" on public.products for insert with check (true);
create policy "public insert orders" on public.orders for insert with check (true);
create policy "public insert banners" on public.banners for insert with check (true);
create policy "public update products" on public.products for update using (true) with check (true);
create policy "public update orders" on public.orders for update using (true) with check (true);
create policy "public update banners" on public.banners for update using (true) with check (true);
```

### 2. Tạo bucket Storage `product-images` (đặt **public**)
- Vào **Storage → New bucket** → tên: `product-images` → chọn **Public bucket**.
- Trong file `js/supabase.js`, cập nhật `SB_URL` và `SB_KEY` (anon/publishable key) cho đúng project của bạn nếu khác.

> **Lưu ý:** Ảnh/banner tải lên sẽ upload vào bucket này. Nếu bucket chưa tồn tại/không public, hệ thống tự động **fallback về lưu base64 cục bộ** (ảnh vẫn hiển thị trên máy đã upload nhưng không hiển thị trên trình duyệt khác). Vì vậy hãy đảm bảo bucket đúng tên và public.

## ⚠️ Lưu ý quan trọng về dữ liệu
- Dữ liệu (sản phẩm, giỏ hàng, đơn hàng, tài khoản) lưu trong **localStorage** của Trình duyệt, **và được đồng bộ lên Supabase** khi có kết nối.
- **Admin** dùng trên máy này → dữ liệu kho/đơn hàng được đồng bộ lên đám mây → có thể xem trên máy/trình duyệt khác hoặc cửa sổ ẩn danh.
- Tài khoản người dùng (đăng ký) vẫn lưu trong localStorage của từng trình duyệt.

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
