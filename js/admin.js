/* ===== Điện tử E-Solution Đà Nẵng - Admin ===== */

let searchTerm = "";
let editingId = null;

document.addEventListener("DOMContentLoaded", () => {
  ensureAdmin();
  bindAuth();
  if (isAdmin()) {
    showAdminContent();
  } else {
    document.getElementById("loginModal").classList.add("show");
  }
});

function bindAuth() {
  document.getElementById("admLoginBtn").addEventListener("click", doAdminLogin);
  document.getElementById("adm-password").addEventListener("keydown", e => {
    if (e.key === "Enter") doAdminLogin();
  });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
    location.reload();
  });
}

function doAdminLogin() {
  const u = document.getElementById("adm-username").value.trim();
  const p = document.getElementById("adm-password").value.trim();
  const msgEl = document.getElementById("admMsg");
  const res = loginUser(u, p);
  if (!res.ok) {
    msgEl.className = "auth-msg err";
    msgEl.textContent = res.msg;
    return;
  }
  if (res.user.role !== "admin") {
    logout();
    msgEl.className = "auth-msg err";
    msgEl.textContent = "Tài khoản này không có quyền quản trị.";
    return;
  }
  msgEl.className = "auth-msg ok";
  msgEl.textContent = "Đăng nhập thành công!";
  setTimeout(() => {
    document.getElementById("loginModal").classList.remove("show");
    showAdminContent();
    toast("Chào mừng quản trị viên!");
  }, 500);
}

function showAdminContent() {
  const user = currentUser();
  document.getElementById("adminUserLabel").textContent = "👤 " + user.name;
  document.getElementById("logoutBtn").style.display = "";
  renderStats();
  renderTable();
  updateOrderBadge();
  bindEvents();
}

function updateOrderBadge() {
  const orders = getOrders();
  const pending = orders.filter(o => o.status === "pending").length;
  document.getElementById("orderBadge").textContent = pending ? " " + pending + " " : "";
}

function renderStats() {
  const products = getProducts();
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.stock <= 10).length;
  document.getElementById("statCount").textContent = products.length;
  document.getElementById("statStock").textContent = totalStock;
  document.getElementById("statValue").textContent = formatPrice(totalValue);
  document.getElementById("statLow").textContent = lowStock;
}

function renderTable() {
  const products = getProducts();
  const tbody = document.getElementById("tbody");
  let filtered = products;
  if (searchTerm) filtered = filtered.filter(p =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

tbody.innerHTML = filtered.map(p => {
    const st = stockStatus(p.stock);
    const imgs = getProductImages(p);
    const primary = imgs[0] || "🔧";
    const imgHtml = looksLikeImage(primary)
      ? `<img src="${primary}" alt="" onerror="this.style.display='none';this.nextSibling.textContent='🔧'" />`
      : `<span>${primary}</span>`;
    const imgCount = imgs.length > 1 ? `<div style="font-size:.68rem;color:var(--muted);margin-top:2px">+${imgs.length - 1}</div>` : "";
    return `
      <tr data-id="${p.id}">
        <td><span class="cell">${p.id}</span></td>
        <td><span class="cell" style="min-width:140px">${escapeHtml(p.name)}</span></td>
        <td><span class="cell" style="min-width:110px">${escapeHtml(p.category)}</span></td>
        <td><span class="cell input-price" >${p.price}</span></td>
        <td><span class="cell input-stock">${p.stock}</span></td>
        <td><span class="cell" style="min-width:70px">${escapeHtml(p.unit)}</span></td>
        <td><span class="badge ${st.cls}">${st.label}</span></td>
        <td class="thumb"><span class="cell"><div class="cell thumb-inner">${imgHtml}${imgCount}</div></span></td>
        <td><span class="cell" style="min-width:180px">${escapeHtml(p.desc || "")}</span></td>
        <td><span class="cell" style="min-width:70px">${p.rating}</span></td>
        <td class="actions-cell">
          <span class="cell actions">
            <button class="icon-mini icon-edit" data-act="edit" title="Sửa thông tin">✏️</button>
            <button class="icon-mini icon-upload" data-act="img" title="Tải ảnh lên">🖼️</button>
            <button class="icon-mini icon-cycle" data-act="reset" title="Khôi phục mặc định">↺</button>
            <button class="icon-mini icon-del" data-act="del" title="Xóa">🗑️</button>
          </span>
        </td>
      </tr>`;
  }).join("");

  // empty state
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="11"><div style="padding:2rem;color:#6b7688">Không có dữ liệu phù hợp.</div></td></tr>`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(m) {
    var amp = "&";
    var map = {
      "&": amp + "amp;",
      "<": amp + "lt;",
      ">": amp + "gt;",
      '"': amp + "quot;",
      "'": amp + "#39;"
    };
    return map[m];
  });
}

function bindEvents() {
  // Search
  document.getElementById("searchInput").addEventListener("input", e => {
    searchTerm = e.target.value.trim();
    renderTable();
  });

  // Add product button
  document.getElementById("btnAdd").addEventListener("click", () => openFormModal());

  // Add row button
  document.getElementById("addRowBtn").addEventListener("click", () => openFormModal());

  // Table actions delegation
  document.getElementById("tbody").addEventListener("click", e => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const tr = btn.closest("tr");
    const id = tr.dataset.id;
    const act = btn.dataset.act;
    if (act === "edit") openFormModal(id);
    if (act === "del") deleteProduct(id);
    if (act === "img") uploadImage(id);
    if (act === "reset") resetImage(id);
  });

  // Inline editing - commit on blur
  document.getElementById("tbody").addEventListener("blur", e => {
    const cell = e.target.closest(".cell");
    if (!cell) return;
    const tr = cell.closest("tr");
    if (!tr) return;
    const id = tr.dataset.id;
    const idx = Array.from(tr.children).indexOf(cell.closest("td"));
    commitInline(id, idx, cell.textContent.trim());
  }, true);

  // Prevent text-overflow issues on enter (span is contenteditable-less; we use simple click-to-edit)
  // We'll implement click-to-inline-edit double click
  document.getElementById("tbody").addEventListener("dblclick", e => {
    const cell = e.target.closest(".cell");
    if (!cell || cell.classList.contains("actions") || cell.classList.contains("thumb-inner")) return;
    makeEditable(cell);
  });

  // Export buttons
  document.getElementById("btnExportXlsx").addEventListener("click", async () => {
    try {
      await loadSheetJS();
      const n = await exportProducts("xlsx");
      toast("Đã xuất " + n + " sản phẩm ra file Excel (.xlsx)");
    } catch (err) { toast(err.message); }
  });
  document.getElementById("btnExportCsv").addEventListener("click", async () => {
    try {
      await loadSheetJS();
      const n = await exportProducts("csv");
      toast("Đã xuất " + n + " sản phẩm ra file CSV");
    } catch (err) { toast(err.message); }
  });

// Import button
  document.getElementById("btnImport").addEventListener("click", () => openImportModal());

  // Orders
  document.getElementById("btnOrders").addEventListener("click", openOrdersModal);
  document.getElementById("ordersClose").addEventListener("click", () => document.getElementById("ordersModal").classList.remove("show"));

  // Reset all
  document.getElementById("btnReset").addEventListener("click", () => {
    if (confirm("Khôi phục toàn bộ danh sách về dữ liệu mặc định? Dữ liệu hiện tại sẽ bị thay thế.")) {
      resetProducts();
      renderStats();
      renderTable();
      toast("Đã khôi phục dữ liệu mặc định");
    }
  });

  // Form modal
  document.getElementById("formModal").addEventListener("click", e => {
    if (e.target.id === "formModal") closeFormModal();
  });
document.getElementById("btnFormSave").addEventListener("click", saveForm);
  document.getElementById("btnFormCancel").addEventListener("click", closeFormModal);

  // Form multi-image upload: click, change, drag & drop, remove
  const imgDrop = document.getElementById("imgDropArea");
  const imgInput = document.getElementById("f-image-input");
  if (imgDrop && imgInput) {
    imgDrop.addEventListener("click", () => imgInput.click());
    imgInput.addEventListener("change", e => {
      addImageFiles(e.target.files);
      imgInput.value = "";
    });
    ["dragover", "dragenter"].forEach(ev => imgDrop.addEventListener(ev, e => { e.preventDefault(); imgDrop.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => imgDrop.addEventListener(ev, e => { e.preventDefault(); imgDrop.classList.remove("drag"); }));
    imgDrop.addEventListener("drop", e => {
      e.preventDefault();
      addImageFiles(e.dataTransfer.files);
    });
    document.getElementById("imgPreview").addEventListener("click", e => {
      const rm = e.target.closest(".img-remove");
      if (rm) removeFormImage(Number(rm.dataset.remove));
    });
  }

  // Import modal
  document.getElementById("importModal").addEventListener("click", e => {
    if (e.target.id === "importModal") closeImportModal();
  });
  document.getElementById("btnImportCancel").addEventListener("click", closeImportModal);
  document.getElementById("btnImportConfirm").addEventListener("click", confirmImport);

  // Drop area
  const drop = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  drop.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", e => handleFile(e.target.files[0]));
  ["dragover", "dragenter"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("drag"); }));
  ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("drag"); }));
  drop.addEventListener("drop", e => {
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  });
}

// ===== Preset categories for select =====
function fillCategorySelect(sel, selected) {
  sel.innerHTML = CATEGORIES.map(c => `<option ${c === selected ? "selected" : ""}>${c}</option>`).join("");
}

// ===== Form modal (add/edit) =====
// Temporary images array for the currently open form (not saved until saveForm).
let formImages = [];

function openFormModal(id) {
  editingId = null;
  const f = document.getElementById("productForm");
  f.reset();
  fillCategorySelect(document.getElementById("f-category"), CATEGORIES[0]);
  document.getElementById("f-unit").value = "cái";
  document.getElementById("f-rating").value = "4.5";

  if (id) {
    const p = getProducts().find(pp => Number(pp.id) === Number(id));
    if (!p) return;
    editingId = id;
    document.getElementById("f-name").value = p.name || "";
    document.getElementById("f-price").value = p.price || "";
    document.getElementById("f-stock").value = p.stock || "";
    document.getElementById("f-unit").value = p.unit || "cái";
    document.getElementById("f-desc").value = p.desc || "";
    document.getElementById("f-rating").value = p.rating || "4.5";
    fillCategorySelect(document.getElementById("f-category"), p.category);
    document.getElementById("formTitle").textContent = "Sửa sản phẩm";
    formImages = getProductImages(p).slice();
  } else {
    document.getElementById("formTitle").textContent = "Thêm sản phẩm mới";
    formImages = [];
  }
  renderFormImagePreview();
  document.getElementById("formModal").classList.add("show");
}

function closeFormModal() {
  document.getElementById("formModal").classList.remove("show");
  formImages = [];
}

// Render the image thumbnails in the form (with remove buttons)
function renderFormImagePreview() {
  const preview = document.getElementById("imgPreview");
  if (!formImages.length) {
    preview.innerHTML = "";
    preview.classList.remove("filled");
    return;
  }
  preview.classList.add("filled");
  preview.innerHTML = formImages.map((img, i) => {
    const isPrimary = i === 0;
    const content = looksLikeImage(img)
      ? `<img src="${img}" alt="">`
      : `<span class="thumb-emoji">${img}</span>`;
    return `
      <div class="img-thumb ${isPrimary ? "is-primary" : ""}" data-idx="${i}">
        ${content}
        ${isPrimary ? '<div class="img-primary-label">Ảnh chính</div>' : ""}
        <button type="button" class="img-remove" data-remove="${i}" title="Xóa ảnh">✕</button>
      </div>`;
  }).join("");
}

// Determine if an image string is an actual image (URL or data URL), not an emoji.
function looksLikeImage(img) {
  return typeof img === "string" &&
    (/^data:image\//i.test(img) || /^https?:\/\//i.test(img) || /^blob:/i.test(img));
}

// Read selected/dropped image files into base64 and append to formImages.
function addImageFiles(files) {
  const list = Array.from(files || []).filter(f => f && f.type && f.type.indexOf("image/") === 0);
  if (!list.length) { toast("Chỉ chấp nhận file ảnh (.png, .jpg, .gif, .webp...)"); return; }
  let remaining = list.length;
  list.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      formImages.push(ev.target.result);
      remaining--;
      if (remaining === 0) {
        renderFormImagePreview();
        toast("Đã thêm " + list.length + " ảnh");
      }
    };
    reader.readAsDataURL(file);
  });
}

// Remove an image from the form by index.
function removeFormImage(idx) {
  formImages.splice(idx, 1);
  renderFormImagePreview();
}

function saveForm() {
  const name = document.getElementById("f-name").value.trim();
  if (!name) { toast("Vui lòng nhập tên sản phẩm"); return; }
  const price = Number(document.getElementById("f-price").value) || 0;
  const stock = Number(document.getElementById("f-stock").value) || 0;
  const products = getProducts();
  const images = formImages.length ? formImages : ["🔧"];

  const data = {
    name,
    category: document.getElementById("f-category").value,
    price,
    stock,
    unit: document.getElementById("f-unit").value || "cái",
    desc: document.getElementById("f-desc").value.trim(),
    images: images,
    image: images[0],
    rating: Number(document.getElementById("f-rating").value) || 4.5
  };

  if (editingId) {
    const idx = products.findIndex(p => Number(p.id) === Number(editingId));
    if (idx >= 0) {
      data.id = Number(editingId);
      products[idx] = data;
    }
    toast("Đã cập nhật sản phẩm");
  } else {
    data.id = nextId(products);
    products.push(data);
    toast("Đã thêm sản phẩm mới");
  }
  saveProducts(products);
  closeFormModal();
  renderStats();
  renderTable();
}

function deleteProduct(id) {
  if (!confirm("Chắc chắn xóa sản phẩm này?")) return;
  let products = getProducts().filter(p => Number(p.id) !== Number(id));
  saveProducts(products);
  renderStats();
  renderTable();
  toast("Đã xóa sản phẩm");
}

// ===== Inline editing =====
function makeEditable(cell) {
  if (cell.querySelector("input") || cell.querySelector("textarea")) return;
  const current = cell.textContent;
  const isActions = cell.classList.contains("actions");
  if (isActions) return;
  const input = document.createElement("input");
  input.value = current;
  input.style.cssText = "width:100%;border:2px solid #0d47a1;border-radius:6px;padding:4px;font-size:.88rem;";
  cell.textContent = "";
  cell.appendChild(input);
  input.focus();
  input.select();
  input.addEventListener("blur", () => {
    const val = input.value.trim();
    cell.textContent = val;
    const tr = cell.closest("tr");
    const idx = Array.from(tr.children).indexOf(cell.closest("td"));
    commitInline(tr.dataset.id, idx, val);
  });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") { cell.textContent = current; }
  });
}

function commitInline(id, colIdx, value) {
  const products = getProducts();
  const idx = products.findIndex(p => Number(p.id) === Number(id));
  if (idx < 0) return;
  // Column order: 0 id,1 name,2 category,3 price,4 stock,5 unit,6 status,7 img,8 desc,9 rating
  let changed = false;
  switch (colIdx) {
    case 1: if (value) { products[idx].name = value; changed = true; } break;
    case 2: if (value) { products[idx].category = value; changed = true; } break;
    case 3: products[idx].price = Number(String(value).replace(/[^\d]/g, "")) || 0; changed = true; break;
    case 4: products[idx].stock = Number(String(value).replace(/[^\d]/g, "")) || 0; changed = true; break;
    case 5: if (value) { products[idx].unit = value; changed = true; } break;
    case 8: products[idx].desc = value; changed = true; break;
    case 9: products[idx].rating = Number(value) || 4.5; if (products[idx].rating > 5) products[idx].rating = 5; changed = true; break;
  }
  if (changed) {
    saveProducts(products);
    renderStats();
    renderTable();
    toast("Đã lưu thay đổi");
  }
}

// ===== Upload image (base64, multiple) =====
// Opens a file picker allowing multiple images; appends them to the product's images array.
function uploadImage(id) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/gif,image/webp,image/jpg";
  input.multiple = true;
  input.onchange = e => {
    const files = Array.from(e.target.files || []).filter(f => f && f.type && f.type.indexOf("image/") === 0);
    if (!files.length) { toast("Không có file ảnh hợp lệ"); return; }
    const products = getProducts();
    const idx = products.findIndex(p => Number(p.id) === Number(id));
    if (idx < 0) return;
    const existing = getProductImages(products[idx]);
    const newImgs = [];
    let remaining = files.length;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        newImgs.push(ev.target.result);
        remaining--;
        if (remaining === 0) {
          products[idx].images = existing.concat(newImgs);
          products[idx].image = products[idx].images[0];
          saveProducts(products);
          renderTable();
          toast("Đã thêm " + newImgs.length + " ảnh");
        }
      };
      reader.readAsDataURL(file);
    });
  };
  input.click();
}

function resetImage(id) {
  const products = getProducts();
  const idx = products.findIndex(p => Number(p.id) === Number(id));
  if (idx >= 0) {
    products[idx].images = ["🔧"];
    products[idx].image = "🔧";
    saveProducts(products);
    renderTable();
    toast("Đã đặt lại ảnh");
  }
}

// ===== Import =====
let importBuffer = [];
function openImportModal() {
  document.getElementById("importModal").classList.add("show");
  document.getElementById("importSummary").innerHTML = "";
  document.getElementById("fileInput").value = "";
  importBuffer = [];
}

function closeImportModal() {
  document.getElementById("importModal").classList.remove("show");
}

async function handleFile(file) {
  try {
    await loadSheetJS();
    const rows = await parseImportFile(file);
    const products = rowsToProducts(rows);
    importBuffer = products;
    const summary = document.getElementById("importSummary");
    if (!products.length) {
      summary.innerHTML = `<div class="import-summary">Không tìm thấy sản phẩm hợp lệ trong file. Hãy đảm bảo có cột "Tên sản phẩm".</div>`;
      return;
    }
    summary.innerHTML = `<div class="import-summary">
      ✅ Đọc được <b>${products.length}</b> sản phẩm từ file <b>${file.name}</b>.<br>
      Các dòng sẽ được <b>thêm vào</b> danh sách hiện tại (tổng ${products.length} sản phẩm mới).
      Kiểm tra và nhấn <b>"Xác nhận nhập"</b> để lưu.
    </div>`;
  } catch (err) {
    document.getElementById("importSummary").innerHTML = `<div class="import-summary" style="color:#d32f2f">❌ ${err.message}</div>`;
  }
}

function confirmImport() {
  if (!importBuffer.length) { toast("Chưa có dữ liệu để nhập"); return; }
  const products = getProducts();
  products.push(...importBuffer);
  saveProducts(products);
  closeImportModal();
  renderStats();
  renderTable();
  toast("Đã nhập " + importBuffer.length + " sản phẩm");
  importBuffer = [];
}

// ===== Orders Management =====
function openOrdersModal() {
  document.getElementById("ordersModal").classList.add("show");
  renderOrders();
}

function renderOrders() {
  const orders = getOrders();
  const list = document.getElementById("ordersList");
  if (!orders.length) {
    list.innerHTML = `<div class="cart-empty">Chưa có đơn hàng nào 📦</div>`;
    return;
  }
  // sort newest first
  orders.sort((a, b) => b.id - a.id);
  list.innerHTML = orders.map(o => {
    const items = (o.items || []).map(i => `<div style="font-size:.82rem">• ${escapeHtml(i.name)} ×${i.qty} — ${formatPrice(i.price * i.qty)}</div>`).join("");
    const discounts = [];
    if (o.userDiscount) discounts.push("Thành viên -5%: -" + formatPrice(o.userDiscount));
    if (o.voucherCode) discounts.push("Voucher " + escapeHtml(o.voucherCode) + ": -" + formatPrice(o.voucherDiscount));
    const discHtml = discounts.length ? `<div style="color:var(--success);font-size:.85rem">${discounts.join(" | ")}</div>` : "";
    return `
      <div style="border:1px solid var(--border);border-radius:10px;padding:1rem;margin-bottom:1rem;background:#fafcff">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem">
          <b style="color:var(--primary)">#${escapeHtml(o.code)}</b>
          <span style="font-size:.82rem;color:var(--muted)">${o.createdAt}</span>
          <span class="badge ${o.status === 'pending' ? 'empty' : 'ok'}">${o.status === 'pending' ? '⏳ Chờ xử lý' : '✅ Đã xử lý'}</span>
        </div>
        <div style="font-size:.9rem;margin-bottom:.4rem">
          👤 <b>${escapeHtml(o.customer.name)}</b> (${escapeHtml(o.username)})<br>
          📞 ${escapeHtml(o.customer.phone)} | 📍 ${escapeHtml(o.customer.address)}<br>
          🏦 ${paymentLabel(o.payment)}
        </div>
        <div style="background:#f1f4fa;border-radius:8px;padding:.5rem .7rem;margin:.5rem 0">${items}</div>
        ${o.note ? `<div style="font-size:.85rem;color:#7a5b1e">📝 Lưu ý: ${escapeHtml(o.note)}</div>` : ""}
        ${discHtml}
        <div style="border-top:1px dashed var(--border);margin-top:.5rem;padding-top:.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
          <b style="color:var(--danger);font-size:1.05rem">Tổng: ${formatPrice(o.total)}</b>
          ${o.status === 'pending'
            ? `<button class="abtn abtn-success abtn-sm" onclick="completeOrder(${o.id})">✓ Đã giao hàng</button>`
            : `<button class="abtn abtn-ghost abtn-sm" onclick="reopenOrder(${o.id})">↺ Mở lại</button>`}
        </div>
      </div>`;
  }).join("");
}

function paymentLabel(v) {
  return { cod: "COD", bank: "Chuyển khoản", momo: "Ví MoMo" }[v] || v;
}

function completeOrder(id) {
  let orders = getOrders();
  const o = orders.find(x => x.id === id);
  if (o) { o.status = "completed"; saveOrders(orders); }
  renderOrders();
  updateOrderBadge();
  toast("Đã đánh dấu đơn hàng đã giao");
}

function reopenOrder(id) {
  let orders = getOrders();
  const o = orders.find(x => x.id === id);
  if (o) { o.status = "pending"; saveOrders(orders); }
  renderOrders();
  updateOrderBadge();
  toast("Đã đưa đơn hàng về trạng thái chờ");
}

// ===== Toast =====
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.style.display = "none", 2500);
}
