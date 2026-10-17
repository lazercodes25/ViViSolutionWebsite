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

// Storage keys
const STORAGE_KEY = "dnd_products";
const PRODUCT_CATALOG_VERSION_KEY = "dnd_product_catalog_version";
const PRODUCT_CATALOG_VERSION = "admin-only-v1";
const CART_KEY = "dnd_cart";
const BANNER_KEY = "dnd_banners";

// ---- Product CRUD ----
// Có đồng bộ Supabase (dùng chung) + fallback localStorage.
let _sbConnected = false;

function isSupabaseOn() {
  return typeof window !== "undefined" && window.encodeURIComponent === encodeURIComponent &&
    typeof sbFetch === "function";
}

// Khởi tạo kết nối Supabase. Sản phẩm chỉ do admin tạo, không có dữ liệu mẫu.
async function initSupabaseSync() {
  try {
    if (typeof sbFetch !== "function") return;
    await sbLoadProducts();
    _sbConnected = true;
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
  list = Array.isArray(list) ? list : [];

  // One-time migration: remove the 73 products previously bundled with the site.
  // Products created after that catalog used IDs from 74 onward and are preserved.
  if (localStorage.getItem(PRODUCT_CATALOG_VERSION_KEY) !== PRODUCT_CATALOG_VERSION) {
    list = list.filter(p => !Number.isInteger(Number(p.id)) || Number(p.id) > 73);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    localStorage.setItem(PRODUCT_CATALOG_VERSION_KEY, PRODUCT_CATALOG_VERSION);
  }

  return list;
}

let _productsCache = null;
async function getProductsAsync() {
  try {
    if (typeof sbFetch === "function") {
      const remote = await sbLoadProducts();
      if (Array.isArray(remote)) {
        _productsCache = remote;
        return _productsCache;
      }
    }
  } catch (e) {}
  return localProducts();
}

function getProducts() {
  if (Array.isArray(_productsCache)) return _productsCache;
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
  saveProducts([]);
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
