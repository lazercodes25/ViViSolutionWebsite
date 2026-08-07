# TODO — Website Điện tử Đà Nẵng

## ✅ Hoàn thành
- [x] Cấu trúc thư mục + giao diện (style.css, admin.css)
- [x] js/data.js — dữ liệu + Excel nhập/xuất
- [x] js/main.js — trang bán hàng (danh mục, tìm kiếm, giỏ hàng)
- [x] js/admin.js — trang quản trị (bảng Excel-like, nhập/xuất)
- [x] index.html, admin.html
- [x] Sửa lỗi escapeHtml

## ✅ Đợt 2 (Theo yêu cầu mới)
- [x] js/auth.js — hệ thống đăng nhập (admin + user)
- [x] js/data.js — thêm đơn hàng, phí vận chuyển, voucher, giảm giá user
- [x] checkout.html + js/checkout.js — trang thanh toán (thông tin, voucher, ghi chú, phí ship)
- [x] index.html + js/main.js — thêm login/register, giỏ hàng → chuyển trang thanh toán
- [x] admin.html + js/admin.js — bảo vệ bằng đăng nhập admin, quản lý đơn hàng, logout
- [x] css/style.css — thêm style checkout, auth modal, đơn hàng

## ✅ Đợt 3 (Phản hồi & Deploy)
- [x] **Sửa bug đặt hàng**: `calcTotals()` trong checkout.js ghi đè biến `userDiscRate` để không xung đột hàm `userDiscount()` → giờ khách (kể cả chưa đăng nhập) đặt hàng được
- [x] **Hiển thị giỏ hàng + tổng tiền** rõ ràng trên trang thanh toán (osItems + priceBreakdown)
- [x] **Thêm thông báo "đặt hàng như khách"** trên trang thanh toán cho người chưa đăng nhập
- [x] **Khởi tạo git repo** + commit toàn bộ để sẵn sàng deploy

## ⬜ Deploy (cần tài khoản cloud)
- [ ] Deploy lên GitHub Pages / Netlify / Vercel (xem README.md)
- [ ] Chạy thử trên trình duyệt ở địa phương
