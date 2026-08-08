# TODO - Cải thiện website E-Solution

## Đã hoàn thành trước đó
- Bỏ tồn kho/tổng giá trị khỏi trang chủ → hiển thị SĐT 0773372913 + Gmail xuantung2521@gmail.com
- Xuất Excel/CSV bỏ cột ảnh (giữ nguyên tính năng xuất)
- Sửa dấu ✕ đóng modal chi tiết sản phẩm
- Fix responsive trang thanh toán trên mobile
- Chỉ giữ phương thức thanh toán COD
- Cải thiện hero responsive + danh mục sidebar + tài liệu email

## Phần A — Supabase đồng bộ ảnh + sản phẩm + đơn hàng dùng chung
- [x] Tạo `js/supabase.js` (helper REST + storage dùng fetch)
- [x] Cập nhật `js/data.js` đồng bộ products/orders/banners với Supabase (kèm fallback localStorage)
- [x] Admin upload ảnh → Supabase Storage lấy public URL (thay base64 cục bộ)
- [x] Banner upload → Supabase Storage
- [x] Cập nhật `js/main.js` nạp dữ liệu dùng chung từ Supabase khi mở trang
- [x] Cập nhật `js/checkout.js` nạp sản phẩm từ Supabase khi mở trang
- [x] Thêm nút "Kiểm tra kết nối" hiển thị lỗi thật (CORS/auth/RLS/bucket)
- [x] Ghi hướng dẫn setup Supabase (bucket, SQL bảng) vào README

## Phần B — Option sản phẩm
- [ ] `admin.html`: thêm trình soạn "Tùy chọn" (nhãn + giá + tồn kho)
- [ ] `js/admin.js`: logic option trong form + lưu
- [ ] `js/main.js`: modal sản phẩm hiển thị dropdown option, thêm giỏ kèm option
- [ ] `js/main.js` giỏ hàng hiển thị option
- [ ] `js/checkout.js`: checkout + giảm đúng tồn kho option

## Kiểm thử
- [ ] Chạy local, kiểm tra option, ảnh upload, đặt hàng

