# TODO - Cải thiện website E-Solution

## Đã hoàn thành trước đó
- Bỏ tồn kho/tổng giá trị khỏi trang chủ → hiển thị SĐT 0773372913 + Gmail xuantung2521@gmail.com
- Xuất Excel/CSV bỏ cột ảnh (giữ nguyên tính năng xuất)
- Sửa dấu ✕ đóng modal chi tiết sản phẩm
- Fix responsive trang thanh toán trên mobile
- Chỉ giữ phương thức thanh toán COD
- Cải thiện hero responsive + danh mục sidebar + tài liệu email

## Phần A — Supabase đồng bộ ảnh + sản phẩm + đơn hàng dùng chung
- [ ] Tạo `js/supabase.js` (helper REST + storage dùng fetch)
- [ ] Cập nhật `js/data.js` đồng bộ products/orders/banners với Supabase (kèm fallback localStorage)
- [ ] Cập nhật admin upload ảnh → Supabase Storage lấy public URL
- [ ] Cập nhật banner → Supabase Storage
- [ ] Ghi hướng dẫn setup Supabase (bucket, SQL bảng) vào README

## Phần B — Option sản phẩm
- [ ] `admin.html`: thêm trình soạn "Tùy chọn" (nhãn + giá + tồn kho)
- [ ] `js/admin.js`: logic option trong form + lưu
- [ ] `js/main.js`: modal sản phẩm hiển thị dropdown option, thêm giỏ kèm option
- [ ] `js/main.js` giỏ hàng hiển thị option
- [ ] `js/checkout.js`: checkout + giảm đúng tồn kho option

## Kiểm thử
- [ ] Chạy local, kiểm tra option, ảnh upload, đặt hàng

