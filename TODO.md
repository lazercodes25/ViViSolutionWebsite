# Kế hoạch thêm 55 sản phẩm từ điện tử Khải Định

## Mục tiêu
- Thêm 55 sản phẩm (id 19–73) từ `products_out.json` (dientukhaidinh.com) vào website.
- Đảm bảo 55 sản phẩm hiển thị kể cả khi đã có dữ liệu cũ trong localStorage/Supabase.

git ## Các bước
- [x] 0. Đọc & hiểu cấu trúc dữ liệu (js/data.js, js/main.js, js/supabase.js, convert_products.ps1).
- [x] 1. Tạo danh sách 55 sản phẩm (chạy convert_products.ps1 → products_entries.txt).
- [x] 2. Chèn 55 sản phẩm vào `DEFAULT_PRODUCTS` trong `js/data.js`.
  - [x] Sửa lỗi mã hoá đơn vị: `cÃ¡i` → `cái`.
  - [x] Sửa danh mục `"Ngồn & Sạc"` → `"Nguồn & Sạc"`.
  - [x] Sửa danh mục `"Vi xủ ly"` → `"Vi xử lý"`.
- [x] 3. Thêm hàm `mergeSeedProducts()` để hợp nhất sản phẩm seed vào dữ liệu hiện có.
- [x] 4. Áp dụng merge trong `getProductsAsync()`, `getProducts()`, `localProducts()` để 55 sản phẩm luôn xuất hiện.
- [x] 5. Kiểm tra lại logic, đảm bảo không trùng id và không ghi đè sản phẩm đã chỉnh sửa.

## Ghi chú
- `products_entries.txt` là file tạm lưu các dòng JS đã tạo (có thể xoá).
- Khi website có đồng bộ Supabase, nếu bảng `products` trên cloud đã có dữ liệu cũ, hàm `mergeSeedProducts()` sẽ tự bổ sung 55 sản phẩm mới mà không ghi đè các sản phẩm đã chỉnh sửa.
