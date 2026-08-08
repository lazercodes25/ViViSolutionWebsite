/* ===== Điện tử E-Solution Đà Nẵng - Data & Excel engine ===== */

// Categories
const CATEGORIES = [
  "Vi xử lý",
  "Bo mạch",
  "Cảm biến",
  "Màn hình",
  "Nguồn & Sạc",
  "Linh kiện thụ động",
  "Kết nối",
  "Công cụ",
  "Phụ kiện"
];

// Default products (seed data)
// Each product: id, name, category, price, stock, unit, image (emoji or URL), desc, rating
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Arduino Uno R3", category: "Bo mạch", price: 220000, stock: 45, unit: "cái", image: "🔌", desc: "Bo mạch vi điều khiển ATmega328P, phổ biến cho các dự án DIY.", rating: 4.8 },
  { id: 2, name: "Raspberry Pi 4 Model B", category: "Bo mạch", price: 1250000, stock: 12, unit: "cái", image: "🍓", desc: "Máy tính mini 4 nhân, RAM 4GB, phù hợp làm server, học lập trình.", rating: 4.9 },
  { id: 3, name: "ESP32 DevKit V1", category: "Bo mạch", price: 135000, stock: 80, unit: "cái", image: "📡", desc: "Vi điều khiển có WiFi + Bluetooth, lý tưởng cho IoT.", rating: 4.7 },
  { id: 4, name: "Cảm biến nhiệt độ DHT22", category: "Cảm biến", price: 75000, stock: 120, unit: "cái", image: "🌡️", desc: "Đo nhiệt độ & độ ẩm, độ chính xác cao, giao tiếp 1-wire.", rating: 4.6 },
  { id: 5, name: "Camera OV2640", category: "Cảm biến", price: 95000, stock: 30, unit: "cái", image: "📷", desc: "Camera 2MP cho ESP32-CAM, chụp ảnh và stream video.", rating: 4.5 },
  { id: 6, name: "Màn hình LCD 16x2", category: "Màn hình", price: 60000, stock: 60, unit: "cái", image: "🖥️", desc: "Màn hình ký tự 16 cột 2 dòng, có đèn nền xanh.", rating: 4.4 },
  { id: 7, name: "Màn hình OLED 0.96 inch", category: "Màn hình", price: 85000, stock: 90, unit: "cái", image: "🖼️", desc: "Màn hình OLED 128x64, giao tiếp I2C, tiết kiệm điện.", rating: 4.7 },
  { id: 8, name: "Nguồn tổ ong 12V 5A", category: "Nguồn & Sạc", price: 180000, stock: 25, unit: "cái", image: "🔋", desc: "Bộ nguồn chuyển mạch 12V 5A dùng cho CNC, LED, động cơ.", rating: 4.6 },
  { id: 9, name: "Bộ sạc TP4056", category: "Nguồn & Sạc", price: 25000, stock: 200, unit: "cái", image: "💡", desc: "Module sạc pin Lithium 1 cell, có bảo vệ.", rating: 4.5 },
  { id: 10, name: "Điện trở carbon 1/4W (bộ 100)", category: "Linh kiện thụ động", price: 12000, stock: 500, unit: "bộ", image: "🔶", desc: "Điện trở carbon 1/4W các giá trị thông dụng, đóng bộ 100. Chọn giá trị ở chi tiết sản phẩm.", rating: 4.8, options: [
    { label: "10Ω", price: 12000, stock: 300 },
    { label: "100Ω", price: 12000, stock: 300 },
    { label: "220Ω", price: 12000, stock: 280 },
    { label: "470Ω", price: 12000, stock: 260 },
    { label: "1kΩ", price: 12000, stock: 320 },
    { label: "10kΩ", price: 12000, stock: 300 },
    { label: "100kΩ", price: 12000, stock: 220 },
    { label: "1MΩ", price: 12000, stock: 180 }
  ] },
  { id: 11, name: "Tụ gốm nhiều giá trị (bộ 500)", category: "Linh kiện thụ động", price: 15000, stock: 300, unit: "bộ", image: "🔷", desc: "Tụ gốm (ceramic) nhiều giá trị điện dung thông dụng, đóng bộ 500. Chọn giá trị ở chi tiết sản phẩm.", rating: 4.6, options: [
    { label: "1nF", price: 15000, stock: 200 },
    { label: "10nF", price: 15000, stock: 200 },
    { label: "22nF", price: 15000, stock: 180 },
    { label: "100nF", price: 15000, stock: 250 },
    { label: "220nF", price: 15000, stock: 160 },
    { label: "1µF", price: 15000, stock: 220 }
  ] },
  { id: 12, name: "LED 5mm (bộ 100)", category: "Linh kiện thụ động", price: 20000, stock: 400, unit: "bộ", image: "🔴", desc: "LED 5mm các màu, đóng bộ 100. Chọn màu ở chi tiết sản phẩm.", rating: 4.7, options: [
    { label: "Đỏ", price: 20000, stock: 300 },
    { label: "Xanh lá", price: 20000, stock: 300 },
    { label: "Xanh dương", price: 20000, stock: 280 },
    { label: "Vàng", price: 20000, stock: 260 },
    { label: "Trắng", price: 20000, stock: 240 }
  ] },
  { id: 13, name: "Cáp nhảy đực-cái (bộ 40)", category: "Kết nối", price: 35000, stock: 150, unit: "bộ", image: "🪢", desc: "Dây nhảy jumper 20cm đủ màu cho breadboard.", rating: 4.5 },
  { id: 14, name: "KIT Breadboard MB-102", category: "Kết nối", price: 45000, stock: 70, unit: "cái", image: "🧩", desc: "Breadboard 830 lỗ + dây cắm, dùng test mạch nhanh.", rating: 4.8 },
  { id: 15, name: "Mỏ hàn 60W", category: "Công cụ", price: 150000, stock: 18, unit: "cái", image: "🛠️", desc: "Mỏ hàn điện 60W có đầu chống dính.", rating: 4.4 },
  { id: 16, name: "Đồng hồ VOM DT830B", category: "Công cụ", price: 120000, stock: 22, unit: "cái", image: "⏱️", desc: "Đồng hồ vạn năng số đo điện áp, dòng, trở kháng.", rating: 4.5 },
  { id: 17, name: "IC 555 (bộ 10)", category: "Linh kiện thụ động", price: 30000, stock: 100, unit: "bộ", image: "🔳", desc: "IC định thời 555 chân DIP8, dùng cho mạch hẹn giờ.", rating: 4.6 },
{ id: 18, name: "Nút nhấn 6mm (bộ 20)", category: "Phụ kiện", price: 15000, stock: 250, unit: "bộ", image: "🔘", desc: "Nút bấm nhỏ 6x6mm cho bàn phím và mạch điều khiển.", rating: 4.7 },
  // ===== Sản phẩm từ dientukhaidinh.com (55 sản phẩm) =====
  { id: 19, name: "Module mạch thu sóng FM TEA5767 5V anten ngoài giao tiếp I2C kde0001", category: "Bo mạch", price: 120000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0001.jpg?v=1755597444923", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0001-3.jpg?v=1755597444923", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0001-4.jpg?v=1755597444923"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0001.jpg?v=1755597444923", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 20, name: "2sa966 TO-92MOD PNP-transistor 1.5A 30V kde0201", category: "Linh kiện thụ động", price: 1000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/7454c410a997cf3a785bd23abc1628.jpg?v=1703234450180", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/937c133e01f28d7550bef760534427.jpg?v=1703234450180"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/7454c410a997cf3a785bd23abc1628.jpg?v=1703234450180", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 21, name: "MODULE CẢM BIẾN MƯA OUT 4 PIN (DO, AO), PANEL hứng nước mưa 4x5cm kde0304", category: "Cảm biến", price: 25000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/4e67d3e9b01557d809b45c6561aa20.jpg?v=1703320324977", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/792ff677593e04dc87124596fc9aac.jpg?v=1703320324977"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/4e67d3e9b01557d809b45c6561aa20.jpg?v=1703320324977", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 22, name: "Chốt đầu nối tắt jumper 2.54mm đủ màu kde0498", category: "Kết nối", price: 400, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0497-0501.jpg?v=1703491270017"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0497-0501.jpg?v=1703491270017", desc: "Linh kiện phong phú - giá giả phải chăng - chất lượng đảm bảo - hỗ trợ nhiệt tình.", rating: 4.5 },
  { id: 23, name: "2SA1216 A1216 2SC2922 C2922 MT-200 TRANS PNP / NPN 17A 180V 200W IC công suất âm ly sanken kde9416", category: "Linh kiện thụ động", price: 34000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9416.jpg?v=1704934826903", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9417.jpg?v=1704934843890"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9416.jpg?v=1704934826903", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 24, name: "Module esp32-wroom-32 ESP32 Wifi bluetooth BLE IC CP2102 microusb / ESP-WROOM-32U ESP32U không socket kde9513", category: "Vi xử lý", price: 95000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9513.jpg?v=1704869983223", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9513b.jpg?v=1704869983223", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9513a.jpg?v=1704869983223"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9513.jpg?v=1704869983223", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 25, name: "LM741CN LM741 LM741N DIP-8 OPAMP khuếch đại độ lợi cao kde8400", category: "Linh kiện thụ động", price: 4500, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8400.jpg?v=1704786995340", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8400a.jpg?v=1747930880140", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8400b.jpg?v=1747930881617"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8400.jpg?v=1704786995340", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 26, name: "HY1707P HY1707 1707 HY1707B TO-220 / TO-263 Mosfet kênh N 80A 70V kde9206", category: "Linh kiện thụ động", price: 10000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9206.jpg?v=1704770794193", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9522.jpg?v=1704770814097"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9206.jpg?v=1704770794193", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 27, name: "Đai Ốc vặn ECU Eru nắp chụp bán cầu nhựa trắng DIN1587 M3 ~ M8 3mm ~ 8mm kde9630", category: "Phụ kiện", price: 750, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9630.jpg?v=1703922754430", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9630a.jpg?v=1703922761167", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9630b.jpg?v=1703922761167"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9630.jpg?v=1703922754430", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 28, name: "HY5DU561622FTP-D43 HY5DU561622FTP 561622 TSSOP-66 IC chip nhớ DRAM tháo máy kde8163", category: "Linh kiện thụ động", price: 18000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8163.jpg?v=1704696954400"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8163.jpg?v=1704696954400", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 29, name: "Đèn báo có điện áp nguồn XD10-6 lỗ 10mm điện áp 220Vac 380Vac 24Vdc 12Vdc có 3 màu kde8055", category: "Phụ kiện", price: 6500, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8055-8066b.jpg?v=1704532918523", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8055-8066a.jpg?v=1704532919303", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8055-8066.jpg?v=1704532920090"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8055-8066b.jpg?v=1704532918523", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 30, name: "còi hú báo động 7 TIẾNG chống trộm 12VDC, LOẠI NHỎ kde7785", category: "Phụ kiện", price: 39000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7785a.jpg?v=1704529731067", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7785.jpg?v=1704529732020"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7785a.jpg?v=1704529731067", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 31, name: "A6061H STR-A6061H DIP-7 IC dao động PWM nguồn xung kde7465", category: "Linh kiện thụ động", price: 21000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7465.jpg?v=1704526445053"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7465.jpg?v=1704526445053", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 32, name: "Đầu Cos mỏ vịt cốt trần bấm dây nối CB, APTOMAT… ĐỒNG mạ thiếc C45 cho dây 2.5mm2 4mm2 ~ 50mm2 kde7103", category: "Phụ kiện", price: 2300, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7103-7109.jpg?v=1704509550187", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7103-7109a.jpg?v=1704509550187", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7103-7109b.jpg?v=1755272131530"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7103-7109.jpg?v=1704509550187", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 33, name: "BC140-16 Vỏ sắt TO-39 Hàng chính hãng NPN-TRANS 1A 40V kde6720", category: "Linh kiện thụ động", price: 33000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6720.jpg?v=1704443970433"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6720.jpg?v=1704443970433", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 34, name: "động cơ giảm tốc 12-35VDC 35-110RPM 100W cực mạnh kéo 100kg, nặng 1,9kg trục 10mm kde6847", category: "Phụ kiện", price: 690000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6847.jpg?v=1704438263467", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6847e.jpg?v=1704438263467", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6847-1.jpg?v=1704438263467"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6847.jpg?v=1704438263467", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 35, name: "lượt cái khay cắm EDGE connector slot TAT NDK S-100-2.54-5 S-100P 2x50P 100 chân 32 chân 30 chân kde6862", category: "Kết nối", price: 17000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6862-3.jpg?v=1704357016470", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6862-2.jpg?v=1704357017103", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6862b.jpg?v=1704357017930"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6862-3.jpg?v=1704357016470", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 36, name: "100 cái Đầu cos khuyên tròn chữ O bọc nhựa RV2-4S màu đen / đỏ kde7587", category: "Phụ kiện", price: 35000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7587.jpg?v=1704350288523", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7588.jpg?v=1704350289407"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7587.jpg?v=1704350288523", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 37, name: "TOP267VG TOP268VG TOP267 TOP267V TOP268 TOP268V eDIP-12 IC nguồn hiệu suất cao kde7774", category: "Linh kiện thụ động", price: 36000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7774.jpg?v=1722331756887"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7774.jpg?v=1722331756887", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 38, name: "XL6006E1 XL6006 6006 TO-263-5L 5A 180khz input 0.3-36V output 0.3-60V IC nguồn boost nâng áp kde6384", category: "Nguồn & Sạc", price: 22000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6384.jpg?v=1703928330307"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6384.jpg?v=1703928330307", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 39, name: "Biến áp cách ly Biến thế hàng CHINT NDK-150VA 150W áp vào: 220V/380V áp ra: 6V 12V 24V 36V nặng 2.6kg kde6411", category: "Nguồn & Sạc", price: 645000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6411.jpg?v=1703922057187"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde6411.jpg?v=1703922057187", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 40, name: "Bulong bu lông vít pake DIN7380 đầu dù, lỗ lục giác chìm, inoc inox 201 M8 M8+20mm kde7593", category: "Phụ kiện", price: 2900, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7593.jpg?v=1703906468253", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7593a.jpg?v=1703906468930"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde7593.jpg?v=1703906468253", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 41, name: "dao rọc giấy loại lớn lưỡi 18mm, kích thước: 20x40x160mm, vỏ nhựa chắc chắn kde5796", category: "Công cụ", price: 25000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5796.jpg?v=1703841422540", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5796-2.jpg?v=1703841423443"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5796.jpg?v=1703841422540", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 42, name: "LA78040 78040 TO-220-7 TV, CRT Display Vertical Output IC kde5637", category: "Linh kiện thụ động", price: 15000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5637.jpg?v=1703817111513"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5637.jpg?v=1703817111513", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 43, name: "Biến áp cách ly, biến áp thường, biến áp hàn mạch, on board IN: 220Vac OUT: 12V 8W 8VA kde5459", category: "Nguồn & Sạc", price: 99000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5459.jpg?v=1703755276363", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5459-2.jpg?v=1703755277223"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5459.jpg?v=1703755276363", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 44, name: "Dây điện đơn dây mềm lõi nhiều sợi nhỏ RV VCm 0.5mm hàng 100% đồng, đủ màu kde5253", category: "Kết nối", price: 3300, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5253-5258-3.jpg?v=1703748407173", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5253-5276.jpg?v=1703748408057", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5253-5276-2.jpg?v=1703748408717"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde5253-5258-3.jpg?v=1703748407173", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 45, name: "10 con Điện trở công suất 4 vạch màu sai số 5% 3W các loại 5.6K ~ 470K Ohm kde1084", category: "Linh kiện thụ động", price: 10000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0866-1190-2-96e94954-5c34-448e-b565-2c0c4871232b.jpg?v=1705714095813", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1142-1161.jpg?v=1705714112333"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde0866-1190-2-96e94954-5c34-448e-b565-2c0c4871232b.jpg?v=1705714095813", desc: "Linh kiện phong phú - giá giả phải chăng - chất lượng đảm bảo - hỗ trợ nhiệt tình.", rating: 4.5 },
  { id: 46, name: "đĩa ròng rọc 182A đường kính 18mm lỗ trục 2mm kde4953", category: "Phụ kiện", price: 2900, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4953.jpg?v=1706835746243"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4953.jpg?v=1706835746243", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 47, name: "DIODE chỉnh lưu đầu vặn ốc ZP100A 2CZ100A 100A 1600V, đầu M16 kde4807", category: "Linh kiện thụ động", price: 154000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4807-2.jpg?v=1706770126313", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4807.jpg?v=1706770126780"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4807-2.jpg?v=1706770126313", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 48, name: "ĐỘNG CƠ BRUSHLESS KHÔNG CHỔI THAN UAV MOTOR DJI2008 1400KV, thuận/nghịch kde4593", category: "Phụ kiện", price: 150000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4593.jpg?v=1706753884010", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4593-4594-3.jpg?v=1706753884010", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4593-4594-2.jpg?v=1706753884010"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4593.jpg?v=1706753884010", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 49, name: "83T03GH AP83T03GH 83T03 N-chanel Mofet 75A 30V TO-252 kde4446", category: "Linh kiện thụ động", price: 10000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4446.jpg?v=1706690217750"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4446.jpg?v=1706690217750", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 50, name: "Dây kéo dài cổng 3.5mm, cổng tai nghe, cổng phone kde4321", category: "Kết nối", price: 13000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4321.jpg?v=1706685121380", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4321-4323.jpg?v=1706685121977"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4321.jpg?v=1706685121380", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 51, name: "KEO DÁN TIANMU 704 705 708 704-7 Kafuter K-705 K-704 K-704B 45g, cố định linh kiện màu TRẮNG SỮA / ĐEN / TRONG kde3999", category: "Phụ kiện", price: 30000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8871.jpg?v=1783848133027", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3999.jpg?v=1783848133027", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8870.jpg?v=1783848133027"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde8871.jpg?v=1783848133027", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 52, name: "ĐẦU CỔNG MICROUSB CÁI 5P CHÂN DÁN TRỤ CẮM 4P kde3768", category: "Kết nối", price: 2000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3768.jpg?v=1706661916563"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3768.jpg?v=1706661916563", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 53, name: "Bộ JACK JST, JST CONNECTOR ĐẦU ĐỰC + ĐẦU CÁI, DC JACK kde3547", category: "Kết nối", price: 5000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3547-35248ef0-bc47-4040-b5cb-04f6db20514a.jpg?v=1759111130453", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3547.jpg?v=1759111130453"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3547-35248ef0-bc47-4040-b5cb-04f6db20514a.jpg?v=1759111130453", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 54, name: "TEST BOARD nhựa trắng 8.5x5.5cm 400 lỗ kde3302", category: "Bo mạch", price: 20000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3302.jpg?v=1706328222633"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3302.jpg?v=1706328222633", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 55, name: "Dây header 6.3mm jack xe OTO đầu ĐỰC/CÁI/ĐỰC+CÁI 2P, bấm sẵn dây kde3232", category: "Kết nối", price: 4000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3232-3234.jpg?v=1706320860347"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3232-3234.jpg?v=1706320860347", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 56, name: "Bộ thành phần xe mô hình 2 tầng KDE-04 dễ lắp đặt kde3102", category: "Phụ kiện", price: 210000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3102.jpg?v=1706317241180", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3102-4.jpg?v=1706317241180", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3102-3.jpg?v=1706317241180"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde3102.jpg?v=1706317241180", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 57, name: "Miếng nhựa giữ động cơ N20, màu CAM kde2972", category: "Phụ kiện", price: 4500, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2972.jpg?v=1706259279433"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2972.jpg?v=1706259279433", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 58, name: "cảm biến từ báo động, vừa 32mm, sắt kde2828", category: "Cảm biến", price: 80000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2828.jpg?v=1706252183503"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2828.jpg?v=1706252183503", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 59, name: "led thanh nhôm ngoài trời full màu KDE1, 24V, 1m kde2685", category: "Phụ kiện", price: 280000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2685.jpg?v=1706236147223", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2685-2.jpg?v=1706236147223"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2685.jpg?v=1706236147223", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 60, name: "BULONG đồng dẫn điện tốt 5x40mm kde2470", category: "Phụ kiện", price: 5000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2470-2.jpg?v=1706231599620", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2470-2471.jpg?v=1706231600467"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2470-2.jpg?v=1706231599620", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 61, name: "nguồn xung, nguồn tổ ong 12V 25A 300W OUTDOOR, có quạt, hàng TỐT kde4190", category: "Nguồn & Sạc", price: 310000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4190-2.jpg?v=1706170481110", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4190.jpg?v=1706170481957"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4190-2.jpg?v=1706170481110", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 62, name: "thước kẹp Caliper số, sắt không gỉ 0-200mm kde2474", category: "Công cụ", price: 340000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2474-3.jpg?v=1706156469727", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2474.jpg?v=1706156469727", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2474-2.jpg?v=1706156469727"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2474-3.jpg?v=1706156469727", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 63, name: "cuộn cảm cuộn dây chân dán SMD CDRH127 kde2334", category: "Linh kiện thụ động", price: 5500, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2334-2343a.jpg?v=1706085790320", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2334-2343-2.jpg?v=1706085790950", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2334-2343.jpg?v=1706085791603"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2334-2343a.jpg?v=1706085790320", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 64, name: "công tắc nút nhấn giữ / nhả mini dùng trong đồng hồ vạn năng 8.5mm 8.5x8.5mm 6p 6 chân kde2092", category: "Phụ kiện", price: 2600, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2092.jpg?v=1706077487947"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde2092.jpg?v=1706077487947", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 65, name: "Dây PIN 9V, dây DÀI 15CM kde1940", category: "Kết nối", price: 2000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1940-2.jpg?v=1706065070693"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1940-2.jpg?v=1706065070693", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 66, name: "tụ cao áp, tụ xanh dương, tụ không phân cực 1kV 2kV kde1707", category: "Linh kiện thụ động", price: 500, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1707-1719.jpg?v=1706001067927", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1707-1719-2.jpg?v=1706001068637"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1707-1719.jpg?v=1706001067927", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 67, name: "TL431 SOT-23 chân dán diode zener có thể điều chỉnh điện áp kde1547", category: "Linh kiện thụ động", price: 1000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1547.jpg?v=1705993816477"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1547.jpg?v=1705993816477", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 68, name: "74HC541D 74HC541 HC541 SOP-20 IC 8 cổng đệm không đảo kde1498", category: "Linh kiện thụ động", price: 11000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1498.jpg?v=1705971511723", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1498-2.jpg?v=1705971512357"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1498.jpg?v=1705971511723", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 69, name: "IC 74HC04 SN74HC04N 74HC04D DIP-14 IC 6 cổng logic đệm, đảo NOT kde1416", category: "Linh kiện thụ động", price: 4000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1416.jpg?v=1705911231767"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1416.jpg?v=1705911231767", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 70, name: "TOP226YN 【TO-220】 IC điều khiển nguồn TV, LCD, monitor… KDE1582", category: "Linh kiện thụ động", price: 25000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1582.jpg?v=1705897559900"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1582.jpg?v=1705897559900", desc: "chất lượng đảm bảo - giá cả phải chăng", rating: 4.5 },
  { id: 71, name: "Bộ linh kiện 11 led 7 màu nháy theo nhạc âm thanh IC CD417 kde9645", category: "Linh kiện thụ động", price: 27000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9645a.jpg?v=1707982268417", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9645.jpg?v=1707982269257", "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9645b.jpg?v=1707982269633"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde9645a.jpg?v=1707982268417", desc: "Linh kiện phong phú - giá giả phải chăng - chất lượng đảm bảo - hỗ trợ nhiệt tình.", rating: 4.5 },
  { id: 72, name: "Công tắc quạt treo tường xoay chuyển đổi tốc độ 4 vị trí 3 chế độ màu đen kde1846", category: "Phụ kiện", price: 13000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1846.jpg?v=1712301037757"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde1846.jpg?v=1712301037757", desc: "Linh kiện phong phú - giá giả phải chăng - chất lượng đảm bảo - hỗ trợ nhiệt tình.", rating: 4.5 },
  { id: 73, name: "RELAY nhiệt Rơ le bảo vệ thiết bị quá tải quá dòng tự reset đặt lại MR1 250Vac 32Vdc 5A 10A 15A 20A kde4204", category: "Bo mạch", price: 20000, stock: 50, unit: "cái", images: ["https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4204-193956e9-141c-4f2b-b55f-828f4496610f.jpg?v=1717143408787"], image: "https://bizweb.dktcdn.net/thumb/grande/100/496/926/products/kde4204-193956e9-141c-4f2b-b55f-828f4496610f.jpg?v=1717143408787", desc: "Linh kiện phong phú - giá giả phải chăng - chất lượng đảm bảo - hỗ trợ nhiệt tình", rating: 4.5 }
];

// Storage keys
const STORAGE_KEY = "dnd_products";
const CART_KEY = "dnd_cart";
const BANNER_KEY = "dnd_banners";

// ---- Product CRUD ----
// Có đồng bộ Supabase (dùng chung) + fallback localStorage.
let _sbConnected = false;

function isSupabaseOn() {
  return typeof window !== "undefined" && window.encodeURIComponent === encodeURIComponent &&
    typeof sbFetch === "function";
}

// Khởi tạo: seed sản phẩm lên Supabase nếu bảng trống (nếu cấu hình có sẵn)
async function initSupabaseSync() {
  try {
    if (typeof sbFetch !== "function") return;
    const local = localProducts();
    const remote = await sbSeedProductsIfEmpty(local);
    if (remote && remote.length) _sbConnected = true;
  } catch (e) {
    _sbConnected = false;
  }
}

function localProducts() {
  let list;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) list = JSON.parse(raw);
  } catch (e) {}
  if (!list || !list.length) list = clone(DEFAULT_PRODUCTS);
  return mergeSeedProducts(list);
}

/**
 * Hợp nhất các sản phẩm seed mới (id <= 73, đặc biệt 55 sản phẩm từ
 * dientukhaidinh.com) vào danh sách sản phẩm đang có.
 * - Sản phẩm đã tồn tại (cùng id) → GIỮ NGUYÊN dữ liệu hiện có (giá/tồn kho/ảnh do admin sửa).
 * - Sản phẩm seed chưa có → thêm vào cuối.
 * Điều này đảm bảo 55 sản phẩm mới luôn xuất hiện kể cả khi localStorage/Supabase
 * đã có dữ liệu cũ (chỉ chứa 18 sản phẩm ban đầu).
 */
function mergeSeedProducts(list) {
  if (!list) return clone(DEFAULT_PRODUCTS);
  const out = list.slice();
  const seen = new Set(out.map(p => String(p.id)));
  DEFAULT_PRODUCTS.forEach(sp => {
    if (!seen.has(String(sp.id))) {
      out.push(clone(sp));
      seen.add(String(sp.id));
    }
  });
  return out;
}

let _productsCache = null;
async function getProductsAsync() {
  try {
    if (typeof sbFetch === "function") {
      const remote = await sbLoadProducts();
      if (remote && remote.length) {
        _productsCache = mergeSeedProducts(remote);
        return _productsCache;
      }
    }
  } catch (e) {}
  return localProducts();
}

function getProducts() {
  if (_productsCache && _productsCache.length) return _productsCache;
  return localProducts();
}

// Lưu lỗi đồng bộ Supabase cuối cùng (để admin biết nguyên nhân thật).
let _lastSbError = null;
function getLastSbError() { return _lastSbError; }

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  _productsCache = products;
  // Đồng bộ lên Supabase (không await để không chặn UI)
  if (typeof sbFetch === "function") {
    sbSaveProducts(products).catch(e => {
      _lastSbError = e && e.message ? e.message : String(e);
      console.error("[Supabase] saveProducts:", _lastSbError);
    });
  }
}

function resetProducts() {
  saveProducts(clone(DEFAULT_PRODUCTS));
}

function nextId(products) {
  return products.length ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
}

function clone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

// ---- Product images (support multiple images per product) ----
// Returns an array of image strings (URL or base64 data URL or emoji).
// Backward compatible: uses p.images if present, otherwise wraps p.image.
function getProductImages(p) {
  if (!p) return [];
  if (Array.isArray(p.images) && p.images.length) return p.images;
  if (p.image) return [p.image];
  return ["🔧"];
}

// Return the primary (first) image for display.
function getPrimaryImage(p) {
  return getProductImages(p)[0] || "🔧";
}

// Normalize a product so it always has an images array.
function ensureImagesArray(p) {
  if (!p) return p;
  if (!Array.isArray(p.images) || !p.images.length) {
    p.images = p.image ? [p.image] : ["🔧"];
  }
  p.image = p.images[0];
  return p;
}

// ---- Banners (quảng cáo) ----
// Banners is an array of image strings (URL or base64 data URL or emoji).
const DEFAULT_BANNERS = [
  "https://placehold.co/1200x400/0d47a1/ffffff?text=KHUY%E1%BA%BEN+M%C3%83I+E-SOLUTION",
  "https://placehold.co/1200x400/ff9800/ffffff?text=Linh+ki%E1%BB%87n+%C4%91i%E1%BB%87n+t%E1%BB%AD+ch%E1%BA%A5t+cao",
  "https://placehold.co/1200x400/2e7d32/ffffff?text=Mi%E1%BB%85n+ph%C3%AD+v%E1%BA%ADn+chuy%E1%BB%83n+t%E1%BB%AB+500k"
];

let _bannersCache = null;
function getBanners() {
  if (_bannersCache && _bannersCache.length) return _bannersCache;
  try {
    const raw = localStorage.getItem(BANNER_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch (e) {}
  return clone(DEFAULT_BANNERS);
}
function saveBanners(banners) {
  localStorage.setItem(BANNER_KEY, JSON.stringify(banners));
  _bannersCache = banners;
  if (typeof sbFetch === "function") {
    sbSaveBanners(banners).catch(() => {});
  }
}
async function getBannersAsync() {
  try {
    if (typeof sbFetch === "function") {
      const remote = await sbLoadBanners();
      if (remote && remote.length) {
        _bannersCache = remote;
        return remote;
      }
    }
  } catch (e) {}
  return getBanners();
}

// ---- Product options ----
// Mỗi product có thể có `options`: mảng { label, price, stock }.
// Sản phẩm không có option sẽ có 1 option mặc định dùng giá/tồn kho của sản phẩm.
function getProductOptions(p) {
  if (!p) return [{ label: "Mặc định", price: 0, stock: 0 }];
  if (Array.isArray(p.options) && p.options.length) {
    return p.options.map(o =>
      typeof o === "string"
        ? { label: o, price: p.price || 0, stock: p.stock || 0 }
        : { label: o.label || "Mặc định", price: Number(o.price) || p.price || 0, stock: Number(o.stock) >= 0 ? Number(o.stock) : (p.stock || 0) }
    );
  }
  return [{ label: "Mặc định", price: p.price || 0, stock: p.stock || 0 }];
}

// Lấy giá theo option; nếu option không ghi đè giá thì dùng giá sản phẩm.
function optionPrice(p, opt) {
  if (opt && typeof opt.price === "number" && Number(opt.price) > 0) return Number(opt.price);
  return Number(p.price) || 0;
}

// Lấy tồn kho theo option; nếu option không ghi đè thì dùng tồn kho sản phẩm.
function optionStock(p, opt) {
  if (opt && typeof opt.stock === "number" && opt.stock >= 0) return Number(opt.stock);
  return Number(p.stock) || 0;
}

// Lấy tên hiển thị của option.
function optionLabel(opt) {
  return (opt && opt.label) || "Mặc định";
}

// ---- Cart ----
function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ---- Formatting ----
function formatPrice(n) {
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

// ---- Orders ----
const ORDER_KEY = "dnd_orders";

function getOrders() {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}
function saveOrders(orders) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  if (typeof sbFetch === "function") {
    sbSaveOrders(orders).catch(() => {});
  }
}
async function getOrdersAsync() {
  try {
    if (typeof sbFetch === "function") {
      const remote = await sbLoadOrders();
      if (remote && remote.length) return remote;
    }
  } catch (e) {}
  return getOrders();
}

// ---- Shipping & Vouchers ----
// Shipping fee based on order total
function shippingFee(subtotal) {
  if (subtotal >= 500000) return 0; // free ship
  return 30000; // flat 30k
}

// Known vouchers
const VOUCHERS = {
  "DN10": { discount: 0.10, name: "Giảm 10%" },
  "DN20": { discount: 0.20, name: "Giảm 20%" },
  "DN30": { discount: 0.30, name: "Giảm 30%" }
};

function applyVoucher(code) {
  const c = String(code || "").trim().toUpperCase();
  const v = VOUCHERS[c];
  if (!v) return null;
  return v;
}

// ---- Excel engine (SheetJS) ----
// Load SheetJS from CDN (lazy)
let SheetJS = null;
function loadSheetJS() {
  return new Promise((resolve, reject) => {
    if (SheetJS) return resolve(SheetJS);
    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js";
    script.onload = () => { SheetJS = window.XLSX; resolve(SheetJS); };
    script.onerror = () => reject(new Error("Không tải được thư viện Excel. Kiểm tra kết nối Internet."));
    document.head.appendChild(script);
  });
}

// Export products to Excel/CSV
async function exportProducts(format = "xlsx") {
  const products = getProducts();
  const wsData = [
    ["Mã SP", "Tên sản phẩm", "Danh mục", "Giá (VNĐ)", "Tồn kho", "Đơn vị", "Mô tả", "Đánh giá"]
  ];
products.forEach(p => {
    wsData.push([
      p.id, p.name, p.category, p.price, p.stock, p.unit, p.desc, p.rating
    ]);
  });
  const ws = SheetJS.utils.aoa_to_sheet(wsData);
  // Column widths for readability
  ws["!cols"] = [
    { wch: 8 }, { wch: 32 }, { wch: 20 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 40 }, { wch: 10 }
  ];
  const wb = SheetJS.utils.book_new();
  SheetJS.utils.book_append_sheet(wb, ws, "SanPham");

  if (format === "csv") {
    SheetJS.writeFile(wb, "danh_sach_hang_" + dateStamp() + ".csv");
  } else {
    SheetJS.writeFile(wb, "danh_sach_hang_" + dateStamp() + ".xlsx");
  }
  return products.length;
}

// Parse any file (xlsx/xls/csv) into product rows
async function parseImportFile(file) {
  const data = await file.arrayBuffer();
  const wb = SheetJS.read(data, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = SheetJS.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  return rows; // array of arrays
}

// Convert raw rows to products
function rowsToProducts(rows) {
  const products = [];
  // find header row
  let headerIdx = -1;
  const headerNorm = r => String(r).toLowerCase().replace(/đ/g, "d").trim();
  for (let i = 0; i < rows.length; i++) {
    const joined = rows[i].map(headerNorm).join("|");
    if (joined.includes("ten") || joined.includes("name") || joined.includes("san pham")) {
      headerIdx = i;
      break;
    }
  }
  const start = headerIdx >= 0 ? headerIdx + 1 : 0;
  const headers = headerIdx >= 0 ? rows[headerIdx].map(h => headerNorm(h)) : [];

  const colMap = {
    id: -1, name: -1, category: -1, price: -1, stock: -1, unit: -1, desc: -1, image: -1, rating: -1
  };
  headers.forEach((h, idx) => {
    if (h.includes("ma") || h.includes("id")) colMap.id = idx;
    if (h.includes("ten") || h.includes("name")) colMap.name = idx;
    if (h.includes("danh muc") || h.includes("category") || h.includes("loai")) colMap.category = idx;
    if (h.includes("gia") || h.includes("price")) colMap.price = idx;
    if (h.includes("ton") || h.includes("stock") || h.includes("sl")) colMap.stock = idx;
    if (h.includes("don vi") || h.includes("unit")) colMap.unit = idx;
    if (h.includes("mo ta") || h.includes("desc")) colMap.desc = idx;
    if (h.includes("hinh") || h.includes("image") || h.includes("anh")) colMap.image = idx;
    if (h.includes("danh gia") || h.includes("rating")) colMap.rating = idx;
  });

  const existing = getProducts();
  const maxId = nextId(existing);

  for (let i = start; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every(c => String(c).trim() === "")) continue;
    const name = colMap.name >= 0 ? String(row[colMap.name] || "").trim() : "";
    if (!name) continue;

    let id = colMap.id >= 0 && row[colMap.id] !== "" ? Number(row[colMap.id]) : (maxId + products.length);
    if (!id) id = maxId + products.length;
    // avoid duplicate id
    while (existing.some(p => Number(p.id) === Number(id)) || products.some(p => Number(p.id) === Number(id))) id++;

    const price = colMap.price >= 0 ? Number(String(row[colMap.price]).replace(/[^\d]/g, "")) || 0 : 0;
    const stock = colMap.stock >= 0 ? Number(String(row[colMap.stock]).replace(/[^\d]/g, "")) || 0 : 0;
    const rating = colMap.rating >= 0 ? Number(row[colMap.rating]) || 4.5 : 4.5;
    const rawImages = colMap.image >= 0 && row[colMap.image] !== "" && row[colMap.image] != null
      ? String(row[colMap.image]).trim()
      : "🔧";
    // Multiple images are separated by " || " in export; support comma too.
    const imagesArr = rawImages
      .split(/\s*\|\|\s*/
    )
      .map(s => s.trim())
      .filter(Boolean);
    const images = imagesArr.length ? imagesArr : ["🔧"];

    products.push({
      id,
      name,
      category: colMap.category >= 0 ? String(row[colMap.category] || "Linh kiện thụ động").trim() : "Linh kiện thụ động",
      price,
      stock,
      unit: colMap.unit >= 0 ? String(row[colMap.unit] || "cái").trim() : "cái",
      desc: colMap.desc >= 0 ? String(row[colMap.desc] || "").trim() : "",
      images,
      image: images[0],
      rating: rating > 5 ? 5 : rating
    });
  }
  return products;
}

function dateStamp() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

// Stock status
function stockStatus(stock) {
  if (stock <= 0) return { label: "Hết hàng", cls: "empty" };
  if (stock <= 10) return { label: "Sắp hết", cls: "low" };
  return { label: "Còn hàng", cls: "ok" };
}
