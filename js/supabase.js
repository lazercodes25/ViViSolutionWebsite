/* ===== Supabase helper (REST via fetch, không cần npm) =====
 * URL + anon key từ project Supabase.
 * Dùng để đồng bộ sản phẩm, đơn hàng, banner dùng chung cho mọi người
 * và upload ảnh lên Storage (public URL → ai cũng xem được).
 */
const SB_URL = "https://duiqlkfdsmjwbalipfta.supabase.co";
const SB_KEY = "sb_publishable_cos3vW4XFmFgoPmZol4bww_mHL_LOOp";

const SB_BUCKET = "product-images";
const SB_HEADERS = {
  "apikey": SB_KEY,
  "Authorization": "Bearer " + SB_KEY,
  "Content-Type": "application/json"
};

// ---- Generic REST helpers ----
function sbFetch(path, options = {}) {
  const url = SB_URL + path;
  const opts = { headers: SB_HEADERS, ...options };
  if (opts.body && typeof opts.body !== "string") {
    opts.body = JSON.stringify(opts.body);
  }
  return fetch(url, opts).then(async r => {
    const text = await r.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!r.ok) throw new Error("Supabase lỗi " + r.status + ": " + (data && data.message ? data.message : text));
    return data;
  });
}

// ---- Products table ----
async function sbLoadProducts() {
  const data = await sbFetch("/rest/v1/products?select=*&order=id.asc");
  // data là mảng; mỗi dòng có cột raw (JSON string) chứa toàn bộ sản phẩm
  return (data || []).map(row => {
    try { return JSON.parse(row.raw); } catch (e) { return null; }
  }).filter(Boolean);
}

async function sbSaveProducts(products) {
  // Đồng bộ đầy đủ danh sách, bao gồm các sản phẩm đã bị xóa ở admin.
  const existing = await sbLoadProducts();
  const currentIds = new Set(products.map(p => Number(p.id)));
  const deletedIds = existing
    .map(p => Number(p.id))
    .filter(id => !currentIds.has(id));

  if (deletedIds.length) {
    await sbFetch("/rest/v1/products?id=in.(" + deletedIds.join(",") + ")", {
      method: "DELETE"
    });
  }

  if (!products.length) return [];

  // Upsert: mỗi sản phẩm 1 dòng theo id
  const rows = products.map(p => ({ id: Number(p.id), raw: JSON.stringify(p) }));
  const data = await sbFetch("/rest/v1/products", {
    method: "POST",
    headers: { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates" },
    body: rows
  });
  return data;
}

// ---- Orders table ----
async function sbLoadOrders() {
  const data = await sbFetch("/rest/v1/orders?select=*&order=id.desc");
  return (data || []).map(row => {
    try { return JSON.parse(row.raw); } catch (e) { return null; }
  }).filter(Boolean);
}

async function sbSaveOrders(orders) {
  const rows = orders.map(o => ({ id: Number(o.id), raw: JSON.stringify(o) }));
  const data = await sbFetch("/rest/v1/orders", {
    method: "POST",
    headers: { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates" },
    body: rows
  });
  return data;
}

// ---- Banners table ----
async function sbLoadBanners() {
  const data = await sbFetch("/rest/v1/banners?select=*&order=id.asc");
  return (data || []).map(row => {
    try { return JSON.parse(row.raw); } catch (e) { return []; }
  }).filter(Array.isArray).flat();
}

async function sbSaveBanners(banners) {
  const data = await sbFetch("/rest/v1/banners", {
    method: "POST",
    headers: { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates" },
    body: [{ id: 1, raw: JSON.stringify(banners) }]
  });
  return data;
}

// ---- Storage upload ----
// Upload 1 file (Blob/File) lên bucket, trả về public URL.
async function sbUploadImage(file, folder = "products") {
  const ext = (file.name ? file.name.split(".").pop() : "png").toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const name = folder + "/" + Date.now() + "_" + Math.random().toString(36).slice(2, 8) + "." + ext;
  const url = SB_URL + "/storage/v1/object/" + SB_BUCKET + "/" + name;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": SB_KEY,
      "Authorization": "Bearer " + SB_KEY,
      "Content-Type": "image/" + (ext === "jpg" ? "jpeg" : ext),
      "x-upsert": "true"
    },
    body: file
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error("Upload ảnh lỗi " + res.status + ": " + t);
  }
  // Trả về public URL
  return SB_URL + "/storage/v1/object/public/" + SB_BUCKET + "/" + name;
}

// Kiểm tra bucket tồn tại/chỉ public (gọi thử) - trả boolean
async function sbStorageReady() {
  try {
    await sbUploadImage(new Blob([" "], { type: "image/png" }), "test");
    return true;
  } catch (e) {
    return false;
  }
}

// Public helper: lấy URL ảnh từ storage
function sbPublicUrl(name) {
  return SB_URL + "/storage/v1/object/public/" + SB_BUCKET + "/" + name;
}

// ---- Chẩn đoán kết nối Supabase ----
// Kiểm tra REST (đọc bảng) + Storage (upload 1 ảnh thử) và trả về lỗi cụ thể (nếu có).
// Dùng để hiển thị nguyên nhân thật khi không đồng bộ được (CORS, auth, RLS, bucket...).
async function sbCheckConnection() {
  const out = { rest: false, storage: false, errors: {}, ok: false };
  // 1. REST: đọc bảng products
  try {
    await sbLoadProducts();
    out.rest = true;
  } catch (e) {
    out.errors.rest = e && e.message ? e.message : String(e);
  }
  // 2. Storage: upload thử 1 file rỗng vào folder "test"
  try {
    const probe = new File([new Blob([" "], { type: "image/png" })], "probe.png", { type: "image/png" });
    await sbUploadImage(probe, "test");
    out.storage = true;
  } catch (e) {
    out.errors.storage = e && e.message ? e.message : String(e);
  }
  out.ok = out.rest && out.storage;
  return out;
}
