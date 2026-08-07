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
  { id: 10, name: "Điện trở 1/4W (bộ 100)", category: "Linh kiện thụ động", price: 12000, stock: 500, unit: "bộ", image: "🔶", desc: "Bộ điện trở carbon 1/4W nhiều giá trị, có hộp phân loại.", rating: 4.8 },
  { id: 11, name: "Tụ gốm 104 (bộ 500)", category: "Linh kiện thụ động", price: 15000, stock: 300, unit: "bộ", image: "🔷", desc: "Tụ gốm nhiều giá trị phổ biến cho mạch điện tử.", rating: 4.6 },
  { id: 12, name: "LED 5mm (bộ 100)", category: "Linh kiện thụ động", price: 20000, stock: 400, unit: "bộ", image: "🔴", desc: "LED 5mm nhiều màu: đỏ, xanh, vàng, trắng.", rating: 4.7 },
  { id: 13, name: "Cáp nhảy đực-cái (bộ 40)", category: "Kết nối", price: 35000, stock: 150, unit: "bộ", image: "🪢", desc: "Dây nhảy jumper 20cm đủ màu cho breadboard.", rating: 4.5 },
  { id: 14, name: "KIT Breadboard MB-102", category: "Kết nối", price: 45000, stock: 70, unit: "cái", image: "🧩", desc: "Breadboard 830 lỗ + dây cắm, dùng test mạch nhanh.", rating: 4.8 },
  { id: 15, name: "Mỏ hàn 60W", category: "Công cụ", price: 150000, stock: 18, unit: "cái", image: "🛠️", desc: "Mỏ hàn điện 60W có đầu chống dính.", rating: 4.4 },
  { id: 16, name: "Đồng hồ VOM DT830B", category: "Công cụ", price: 120000, stock: 22, unit: "cái", image: "⏱️", desc: "Đồng hồ vạn năng số đo điện áp, dòng, trở kháng.", rating: 4.5 },
  { id: 17, name: "IC 555 (bộ 10)", category: "Linh kiện thụ động", price: 30000, stock: 100, unit: "bộ", image: "🔳", desc: "IC định thời 555 chân DIP8, dùng cho mạch hẹn giờ.", rating: 4.6 },
  { id: 18, name: "Nút nhấn 6mm (bộ 20)", category: "Phụ kiện", price: 15000, stock: 250, unit: "bộ", image: "🔘", desc: "Nút bấm nhỏ 6x6mm cho bàn phím và mạch điều khiển.", rating: 4.7 }
];

// Storage keys
const STORAGE_KEY = "dnd_products";
const CART_KEY = "dnd_cart";

// ---- Product CRUD ----
function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return clone(DEFAULT_PRODUCTS);
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
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
    ["Mã SP", "Tên sản phẩm", "Danh mục", "Giá (VNĐ)", "Tồn kho", "Đơn vị", "Mô tả", "Hình (emoji/URL)", "Đánh giá"]
  ];
products.forEach(p => {
    wsData.push([
      p.id, p.name, p.category, p.price, p.stock, p.unit, p.desc, getProductImages(p).join(" || "), p.rating
    ]);
  });
  const ws = SheetJS.utils.aoa_to_sheet(wsData);
  // Column widths for readability
  ws["!cols"] = [
    { wch: 8 }, { wch: 32 }, { wch: 20 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 40 }, { wch: 22 }, { wch: 10 }
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
