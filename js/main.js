/* ===== ViVi Solution Đà Nẵng - Storefront ===== */

document.addEventListener("DOMContentLoaded", async () => {
  ensureAdmin();
  bindEvents();
  // Nạp dữ liệu dùng chung từ Supabase (sản phẩm + banner) để mọi thiết bị/trình duyệt
  // đều thấy đúng danh sách sản phẩm và ảnh do quản trị viên tải lên.
  try {
    await getProductsAsync();
    await getBannersAsync();
  } catch (e) { /* fallback localStorage đã có sẵn */ }
  renderCategories();
  renderStats();
  renderBanner();
  renderProducts();
  renderCart();
  updateAuthUI();
});

// State
let currentCategory = "Tất cả";
let searchTerm = "";

function renderCategories() {
  const cats = ["Tất cả", ...CATEGORIES];
  const bar = document.getElementById("catBar");
  bar.innerHTML = cats.map(c =>
    `<button class="cat-btn ${c === currentCategory ? "active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");

  // Populate the responsive dropdown selector (hidden on wide screens)
  const sel = document.getElementById("catSelect");
  if (sel) {
    sel.innerHTML = cats.map(c =>
      `<option value="${escapeHtml(c)}" ${c === currentCategory ? "selected" : ""}>${escapeHtml(c)}</option>`
    ).join("");
  }
}

function renderStats() {
  const products = getProducts();
  const el = document.getElementById("statCount");
  if (el) el.textContent = products.length;
  const catEl = document.getElementById("statCats");
  if (catEl && typeof CATEGORIES !== "undefined") catEl.textContent = CATEGORIES.length;
}

// ===== Banner slider (quảng cáo) =====
let bannerTimer = null;
let bannerIndex = 0;

function renderBanner() {
  const banners = getBanners();
  const slider = document.getElementById("bannerSlider");
  if (!slider) return;
  if (!banners.length) {
    slider.innerHTML = "";
    return;
  }
  slider.innerHTML = banners.map((b, i) => {
    const content = looksLikeImage(b)
      ? `<img src="${b}" alt="Quảng cáo ${i + 1}" onerror="this.parentNode.remove()" />`
      : `<span style="font-size:4rem">${b}</span>`;
    return `<div class="banner-slide ${i === 0 ? "active" : ""}" data-bi="${i}">${content}</div>`;
  }).join("");

  // auto-rotate every 5 seconds
  if (bannerTimer) clearInterval(bannerTimer);
  if (banners.length > 1) {
    bannerTimer = setInterval(() => {
      bannerIndex = (bannerIndex + 1) % banners.length;
      showBanner(bannerIndex);
    }, 5000);
  }
}

function showBanner(idx) {
  const slides = document.querySelectorAll(".banner-slide");
  slides.forEach(s => s.classList.remove("active"));
  const target = sliderForIdx(idx);
  if (target) target.classList.add("active");
}

function sliderForIdx(idx) {
  return document.querySelector(`.banner-slide[data-bi="${idx}"]`);
}

function renderProducts() {
  const products = getProducts();
  const grid = document.getElementById("productGrid");

  let filtered = products;
  if (currentCategory !== "Tất cả") filtered = filtered.filter(p => p.category === currentCategory);
  if (searchTerm) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty"><i>🔍</i>Không tìm thấy sản phẩm phù hợp.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const imgHtml = carouselHtml(getProductImages(p), p.name);
    const firstOpt = getProductOptions(p)[0];
    const oldP = optionOldPrice(p, firstOpt);
    const pct = oldP ? discountPercent(oldP, optionPrice(p, firstOpt)) : 0;
    const st = stockStatus(p.stock);
    const stars = renderStars(p.rating);
    const disabled = p.stock <= 0 ? "disabled" : "";
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="img-wrap">${imgHtml}${pct ? `<span class="sale-badge">-${pct}%</span>` : ""}</div>
        <div class="pc-body">
          <div class="pc-cat">${p.category}</div>
          <div class="pc-name">${escapeHtml(p.name)}</div>
          <div class="stars">${stars}</div>
          ${priceBlockHtml(p, firstOpt, false)}
          <div class="pc-stock ${st.cls}">${st.label} (${p.stock} ${p.unit})</div>
          <div class="pc-actions">
            <button class="btn btn-outline-orange btn-sm pc-add" data-action="add" data-id="${p.id}" ${disabled} title="Thêm vào giỏ hàng" aria-label="Thêm vào giỏ hàng"><svg class="ico-cart" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.7-7.3H6.1"/><path d="M13 7.5v5M10.5 10h5"/></svg><span class="lbl-add">Thêm giỏ</span></button>
            <button class="btn btn-accent btn-sm" data-action="buy" data-id="${p.id}" ${disabled}>${disabled ? "Hết hàng" : "Mua ngay"}</button>
          </div>
        </div>
      </div>`;
  }).join("");
}

function renderStars(r) {
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  return Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "★";
    return "☆";
  }).join("");
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
  // Category sidebar toggle (mobile)
  const catToggle = document.getElementById("catToggle");
  const catSidebar = document.getElementById("catSidebar");
  const catScrim = document.getElementById("catScrim");
  function openCatSidebar() {
    catSidebar.classList.add("open");
    if (catScrim) catScrim.classList.add("show");
  }
  function closeCatSidebar() {
    catSidebar.classList.remove("open");
    if (catScrim) catScrim.classList.remove("show");
  }
  if (catToggle) catToggle.addEventListener("click", () => {
    if (catSidebar.classList.contains("open")) closeCatSidebar();
    else openCatSidebar();
  });
  if (catScrim) catScrim.addEventListener("click", closeCatSidebar);

  // Category
  document.getElementById("catBar").addEventListener("click", e => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;
    currentCategory = btn.dataset.cat;
    renderCategories();
    renderProducts();
    closeCatSidebar();
  });

  // Category dropdown (narrow screens)
  const catSelect = document.getElementById("catSelect");
  if (catSelect) {
    catSelect.addEventListener("change", e => {
      currentCategory = e.target.value;
      renderCategories();
      renderProducts();
      closeCatSidebar();
    });
  }

  // Search
  document.getElementById("searchInput").addEventListener("input", e => {
    searchTerm = e.target.value.trim();
    renderProducts();
  });
  document.getElementById("searchBtn").addEventListener("click", () => renderProducts());
  document.getElementById("searchInput").addEventListener("keydown", e => {
    if (e.key === "Enter") renderProducts();
  });

  // Product grid - delegation
  document.getElementById("productGrid").addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "add") {
      const p = getProducts().find(pp => Number(pp.id) === Number(id));
      // Nếu sản phẩm có option -> mở modal chi tiết để khách chọn option
      // (tránh thêm nhầm option "Mặc định"). Ngược lại thêm thẳng vào giỏ.
      if (p && getProductOptions(p).length > 1) {
        openDetail(id);
      } else {
        addToCart(id);
      }
    }
    if (btn.dataset.action === "view") openDetail(id);
    if (btn.dataset.action === "buy") {
      const p = getProducts().find(pp => Number(pp.id) === Number(id));
      if (p && getProductOptions(p).length > 1) openDetail(id); // cần chọn phân loại trước
      else buyNow(id, undefined, 1);
    }
  });
  // card click -> detail (unless add button)
  document.getElementById("productGrid").addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    const btn = e.target.closest("button");
    if (!card || (btn && btn.dataset.action)) return;
    openDetail(card.dataset.id);
  });

  // Modal close
  document.querySelectorAll(".modal-close").forEach(b => {
    b.addEventListener("click", () => document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("show")));
  });
  document.querySelectorAll(".modal-overlay").forEach(m => {
    m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show"); });
  });

  // Cart
  document.getElementById("cartBtn").addEventListener("click", () => document.getElementById("cartDrawer").classList.add("open"));
  document.getElementById("cartClose").addEventListener("click", () => document.getElementById("cartDrawer").classList.remove("open"));

document.getElementById("cartItems").addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    const opt = btn.dataset.opt || "Mặc định";
    if (btn.dataset.act === "inc") changeQty(id, 1, opt);
    if (btn.dataset.act === "dec") changeQty(id, -1, opt);
    if (btn.dataset.act === "rm") removeFromCart(id, opt);
  });

document.getElementById("checkoutBtn").addEventListener("click", checkout);

// Auth
  document.getElementById("authBtn").addEventListener("click", openAuthModal);
  document.getElementById("authClose").addEventListener("click", () => document.getElementById("authModal").classList.remove("show"));
  document.getElementById("authSubmit").addEventListener("click", submitAuth);
  document.getElementById("authModal").addEventListener("click", e => { if (e.target.id === "authModal") e.target.classList.remove("show"); });

  // Account dropdown
  const authToggle = document.getElementById("authToggle");
  const authDropdown = document.getElementById("authDropdown");
  if (authToggle) {
    authToggle.addEventListener("click", e => {
      e.stopPropagation();
      authDropdown.classList.toggle("show");
    });
  }
  document.addEventListener("click", e => {
    if (authDropdown && !e.target.closest(".auth-menu")) authDropdown.classList.remove("show");
  });

  // Change password
  document.getElementById("changePassBtn").addEventListener("click", () => {
    if (authDropdown) authDropdown.classList.remove("show");
    openPassModal();
  });
  document.getElementById("passClose").addEventListener("click", closePassModal);
  document.getElementById("passSaveBtn").addEventListener("click", doChangePassword);
  document.getElementById("passModal").addEventListener("click", e => { if (e.target.id === "passModal") closePassModal(); });
  document.getElementById("pass-confirm").addEventListener("keydown", e => { if (e.key === "Enter") doChangePassword(); });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (authDropdown) authDropdown.classList.remove("show");
    logout();
    updateAuthUI();
    renderProducts();
    toast("Đã đăng xuất");
  });
}

// ===== Change password =====
function openPassModal() {
  document.getElementById("pass-current").value = "";
  document.getElementById("pass-new").value = "";
  document.getElementById("pass-confirm").value = "";
  const msg = document.getElementById("passMsg");
  msg.className = "auth-msg";
  msg.textContent = "";
  document.getElementById("passModal").classList.add("show");
  document.getElementById("pass-current").focus();
}

function closePassModal() {
  document.getElementById("passModal").classList.remove("show");
}

function doChangePassword() {
  const user = currentUser();
  if (!user) return;
  const current = document.getElementById("pass-current").value;
  const next = document.getElementById("pass-new").value;
  const confirm = document.getElementById("pass-confirm").value;
  const msgEl = document.getElementById("passMsg");

  if (!current || !next || !confirm) {
    msgEl.className = "auth-msg err";
    msgEl.textContent = "Vui lòng điền đầy đủ thông tin.";
    return;
  }
  if (next !== confirm) {
    msgEl.className = "auth-msg err";
    msgEl.textContent = "Mật khẩu mới không khớp.";
    return;
  }
  const res = changePassword(user.username, current, next);
  if (!res.ok) {
    msgEl.className = "auth-msg err";
    msgEl.textContent = res.msg;
    return;
  }
  msgEl.className = "auth-msg ok";
  msgEl.textContent = "Đổi mật khẩu thành công!";
  setTimeout(() => {
    closePassModal();
    toast("Mật khẩu đã được đổi thành công");
  }, 600);
}

// ===== Product detail =====
function openDetail(id) {
  const p = getProducts().find(p => Number(p.id) === Number(id));
  if (!p) return;
  const imgs = getProductImages(p);
  const galleryHtml = carouselHtml(imgs, p.name, "modal-carousel");
  // Thumbnail gallery (if multiple images)
  const thumbs = imgs.length > 1
    ? `<div class="gallery-thumbs">
        ${imgs.map((img, i) => {
          const tContent = looksLikeImage(img)
            ? `<img src="${img}" alt="${escapeHtml(p.name)} - ảnh ${i + 1}" loading="lazy" decoding="async">`
            : `<span>${img}</span>`;
          return `<button type="button" class="gallery-thumb ${i === 0 ? "active" : ""}" data-gidx="${i}" aria-label="Ảnh ${i + 1}">${tContent}</button>`;
        }).join("")}
      </div>`
    : "";
  // Options (biến thể sản phẩm)
  const opts = getProductOptions(p);
  const hasMultiOpts = opts.length > 1;
  const optHtml = hasMultiOpts
    ? `<div class="opt-select">
        <label>Chọn phân loại</label>
        <div class="opt-chips">
        ${opts.map((o, i) => {
          const os = optionStock(p, o);
          const disabled = os <= 0 ? "disabled" : "";
          return `<button type="button" class="opt-chip ${i === 0 ? "active" : ""}" data-opt="${i}" data-ostock="${os}" ${disabled}>
            ${escapeHtml(optionLabel(o))}
            ${os <= 0 ? '<span class="opt-soldout">hết</span>' : ""}
          </button>`;
        }).join("")}
        </div>
      </div>`
    : "";
  document.getElementById("modalBody").innerHTML = `
    <button class="modal-close">✕</button>
    ${galleryHtml}
    ${thumbs}
    <h2>${escapeHtml(p.name)}</h2>
    <div class="stars">${renderStars(p.rating)}</div>
    <div class="m-price-box" id="modalPrice">${priceBlockHtml(p, opts[0], true)}</div>
    <p class="m-desc">${escapeHtml(p.desc || "Chưa có mô tả.")}</p>
    ${optHtml}
    <div class="qty-row">
      <span class="qty-label">Số lượng</span>
      <div class="qty-box">
        <button type="button" data-q="-1" aria-label="Giảm">−</button>
        <input type="number" id="modalQty" value="1" min="1" inputmode="numeric" aria-label="Số lượng">
        <button type="button" data-q="1" aria-label="Tăng">+</button>
      </div>
      <span class="pc-stock" id="modalStock"></span>
    </div>
    <div class="buy-actions">
      <button type="button" class="btn btn-outline-orange" id="modalAdd"><svg class="ico-cart" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2l1.7-7.3H6.1"/><path d="M13 7.5v5M10.5 10h5"/></svg> Thêm vào giỏ<span class="lbl-long"> hàng</span></button>
      <button type="button" class="btn btn-accent" id="modalBuy">Mua ngay</button>
    </div>`;
  document.getElementById("detailModal").classList.add("show");

  let selOpt = 0;
  const qtyInput = document.getElementById("modalQty");
  const addBtn = document.getElementById("modalAdd");
  const buyBtn = document.getElementById("modalBuy");

  // Cập nhật giá, tồn kho, giới hạn số lượng theo phân loại đang chọn
  function refresh() {
    const curOpt = opts[selOpt];
    const os = optionStock(p, curOpt);
    const ost = stockStatus(os);
    document.getElementById("modalPrice").innerHTML = priceBlockHtml(p, curOpt, true);
    const stockEl = document.getElementById("modalStock");
    stockEl.className = "pc-stock " + ost.cls;
    stockEl.textContent = ost.label + " (" + os + " " + p.unit + ")";
    qtyInput.max = Math.max(os, 1);
    clampQty();
    addBtn.disabled = os <= 0;
    buyBtn.disabled = os <= 0;
    buyBtn.textContent = os <= 0 ? "Hết hàng" : "Mua ngay";
  }
  function clampQty() {
    const os = optionStock(p, opts[selOpt]);
    let q = parseInt(qtyInput.value, 10);
    if (!q || q < 1) q = 1;
    if (os > 0 && q > os) { q = os; toast("Chỉ còn " + os + " " + p.unit); }
    qtyInput.value = q;
    return q;
  }

  document.querySelector("#modalBody .modal-close").addEventListener("click", () => {
    document.getElementById("detailModal").classList.remove("show");
  });
  document.querySelectorAll("#modalBody .opt-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#modalBody .opt-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      selOpt = Number(chip.dataset.opt);
      refresh();
    });
  });
  document.querySelectorAll("#modalBody .qty-box button").forEach(b => {
    b.addEventListener("click", () => {
      qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + Number(b.dataset.q);
      clampQty();
    });
  });
  qtyInput.addEventListener("change", clampQty);
  // Gallery switching: bấm ảnh nhỏ -> chuyển ảnh lớn
  document.querySelectorAll("#modalBody .gallery-thumb").forEach(t => {
    t.addEventListener("click", () => {
      const car = document.querySelector("#modalBody .img-carousel");
      if (car) carouselGo(car, Number(t.dataset.gidx));
    });
  });
  addBtn.addEventListener("click", () => {
    const curOpt = opts[selOpt];
    if (optionStock(p, curOpt) <= 0) { toast("Phân loại này hiện hết hàng"); return; }
    addToCart(id, curOpt, clampQty());
  });
  buyBtn.addEventListener("click", () => buyNow(id, opts[selOpt], clampQty()));
  refresh();
}

// Khối giá: giá gốc gạch ngang + "chỉ còn" giá bán + % giảm
function priceBlockHtml(p, opt, big) {
  const price = optionPrice(p, opt);
  const old = optionOldPrice(p, opt);
  if (!old) return `<div class="${big ? "m-price" : "pc-price"}">${formatPrice(price)}</div>`;
  const pct = discountPercent(old, price);
  return `<div class="price-old"><s>${formatPrice(old)}</s>${pct && big ? `<span class="off-badge">-${pct}%</span>` : ""}</div>
    <div class="${big ? "m-price" : "pc-price"}"><span class="price-only">chỉ còn</span> ${formatPrice(price)}</div>`;
}

// Mua ngay: thêm vào giỏ rồi chuyển thẳng sang trang thanh toán
function buyNow(id, opt, qty) {
  if (addToCart(id, opt, qty || 1, true)) window.location.href = "checkout.html";
}

// Determine if an image string is an actual image (URL / data URL), not an emoji.
function looksLikeImage(img) {
  return typeof img === "string" &&
    (/^data:image\//i.test(img) || /^https?:\/\//i.test(img) || /^blob:/i.test(img));
}

// ===== Cart logic =====
// Cart item: { id, qty, optLabel?, optPrice?, optStock? }
// Trả về true nếu thêm được (dùng cho "Mua ngay").
function addToCart(id, opt, qty, silent) {
  const p = getProducts().find(p => Number(p.id) === Number(id));
  if (!p) return false;
  qty = Math.max(1, parseInt(qty, 10) || 1);
  // Determine unit price & stock for this line
  const unitPrice = opt && typeof opt.price === "number" && opt.price > 0 ? Number(opt.price) : Number(p.price) || 0;
  const unitStock = opt && typeof opt.stock === "number" && opt.stock >= 0 ? Number(opt.stock) : Number(p.stock) || 0;
  const optLabel = opt && opt.label ? String(opt.label) : "Mặc định";
  if (unitStock <= 0) { toast("Phân loại này hiện hết hàng"); return false; }
  const cart = getCart();
  const found = cart.find(c => Number(c.id) === Number(id) && (c.optLabel || "Mặc định") === optLabel);
  const already = found ? found.qty : 0;
  if (already >= unitStock) {
    toast("Số lượng vượt quá tồn kho");
    return !!silent; // Mua ngay: vẫn sang thanh toán vì hàng đã có trong giỏ
  }
  let addQty = qty;
  if (already + addQty > unitStock) {
    addQty = unitStock - already;
    toast("Chỉ thêm được " + addQty + " (tồn kho " + unitStock + ")");
  }
  if (found) found.qty += addQty;
  else cart.push({ id: Number(id), qty: addQty, optLabel, optPrice: unitPrice, optStock: unitStock });
  saveCart(cart);
  renderCart();
  if (!silent) toast("Đã thêm " + addQty + " vào giỏ hàng 🛒");
  return true;
}

function lineKey(c) {
  return String(c.id) + "::" + (c.optLabel || "Mặc định");
}

function findLine(cart, id, optLabel) {
  const norm = optLabel || "Mặc định";
  return cart.find(c => Number(c.id) === Number(id) && (c.optLabel || "Mặc định") === norm);
}

function changeQty(id, delta, optLabel) {
  const p = getProducts().find(p => Number(p.id) === Number(id));
  let cart = getCart();
  const found = findLine(cart, id, optLabel);
  if (!found) return;
  let maxStock = Number(p && p.stock) || 0;
  if (typeof found.optStock === "number" && found.optStock >= 0) maxStock = found.optStock;
  found.qty += delta;
  if (found.qty <= 0) cart = cart.filter(c => lineKey(c) !== lineKey(found));
  if (p && maxStock >= 0 && found.qty > maxStock) { found.qty = maxStock; toast("Vượt quá tồn kho"); }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id, optLabel) {
  let cart = getCart();
  if (arguments.length >= 2 && optLabel) {
    cart = cart.filter(c => !(Number(c.id) === Number(id) && (c.optLabel || "Mặc định") === optLabel));
  } else {
    cart = cart.filter(c => Number(c.id) !== Number(id));
  }
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const products = getProducts();
  let qty = 0, total = 0;
  const itemsHtml = cart.map(c => {
    const p = products.find(pp => Number(pp.id) === Number(c.id));
    if (!p) return "";
    const primary = getPrimaryImage(p);
    const img = looksLikeImage(primary)
      ? `<img src="${primary}" alt="${escapeHtml(p.name)}" loading="lazy" decoding="async" />` : `<span style="font-size:1.3rem">${primary}</span>`;
    const unitPrice = (typeof c.optPrice === "number" && c.optPrice > 0) ? c.optPrice : (Number(p.price) || 0);
    const optLabel = c.optLabel || "Mặc định";
    qty += c.qty;
    total += unitPrice * c.qty;
    return `
      <div class="cart-item" data-line="${lineKey(c)}">
        <div class="ci-img">${img}</div>
        <div class="ci-info">
          <div class="ci-name">${escapeHtml(p.name)}</div>
          ${p.options && p.options.length > 1 ? `<div class="ci-opt">${escapeHtml(optLabel)}</div>` : ""}
          <div class="ci-price">${formatPrice(unitPrice)} × ${c.qty}</div>
          <div class="qty-ctrl">
            <button data-act="dec" data-id="${p.id}" data-opt="${escapeHtml(optLabel)}">−</button>
            <span>${c.qty}</span>
            <button data-act="inc" data-id="${p.id}" data-opt="${escapeHtml(optLabel)}">+</button>
          </div>
        </div>
        <button class="ci-remove" data-act="rm" data-id="${p.id}" data-opt="${escapeHtml(optLabel)}">🗑️</button>
      </div>`;
  }).join("");

  if (!cart.length) {
    document.getElementById("cartItems").innerHTML = `<div class="cart-empty">Giỏ hàng đang trống 🛒</div>`;
  } else {
    document.getElementById("cartItems").innerHTML = itemsHtml;
  }
  document.getElementById("cartQty").textContent = qty;
  document.getElementById("cartTotal").textContent = formatPrice(total);
}

function checkout() {
  const cart = getCart();
  if (!cart.length) { toast("Giỏ hàng trống"); return; }
  window.location.href = "checkout.html";
}

// ===== Authentication UI =====
let authMode = "login";

function updateAuthUI() {
  const user = currentUser();
  const authBtn = document.getElementById("authBtn");
  const authMenu = document.getElementById("authMenu");
  if (user) {
    // Show account dropdown menu
    if (authBtn) authBtn.style.display = "none";
    if (authMenu) {
      authMenu.style.display = "";
      document.getElementById("authLabel2").textContent = "👤 " + user.name + (user.role === "admin" ? " (Admin)" : "");
    }
  } else {
    // Show login button
    if (authMenu) authMenu.style.display = "none";
    if (authBtn) {
      authBtn.style.display = "";
      document.getElementById("authLabel").textContent = "Đăng nhập";
    }
  }
  // Chỉ hiện nút "Quản trị" khi đã đăng nhập với tài khoản admin
  const adminLink = document.getElementById("adminLink");
  if (adminLink) {
    adminLink.style.display = isAdmin() ? "" : "none";
  }
}

function openAuthModal() {
  const user = currentUser();
  if (user) {
    // Logged in -> toggle the account dropdown
    const dropdown = document.getElementById("authDropdown");
    if (dropdown) dropdown.classList.toggle("show");
    return;
  }
  authMode = "login";
  switchAuth("login");
  document.getElementById("authModal").classList.add("show");
}

function switchAuth(mode) {
  authMode = mode;
  document.getElementById("authTitle").textContent = mode === "login" ? "Đăng nhập" : "Đăng ký";
  document.getElementById("tabLogin").classList.toggle("active", mode === "login");
  document.getElementById("tabRegister").classList.toggle("active", mode === "register");
// Show name/phone/password-confirm only for register
  document.querySelectorAll("#authForm .reg-only").forEach(el => el.style.display = mode === "register" ? "block" : "none");
  document.getElementById("authSubmit").textContent = mode === "login" ? "Đăng nhập" : "Đăng ký";
  document.getElementById("authMsg").textContent = "";
}

function submitAuth() {
  const username = document.getElementById("a-username").value.trim();
  const password = document.getElementById("a-password").value.trim();
  const msgEl = document.getElementById("authMsg");
  if (!username || !password) {
    msgEl.className = "auth-msg err";
    msgEl.textContent = "Vui lòng nhập tên đăng nhập và mật khẩu";
    return;
  }
  if (authMode === "login") {
    const res = loginUser(username, password);
    if (!res.ok) {
      msgEl.className = "auth-msg err";
      msgEl.textContent = res.msg;
      return;
    }
    msgEl.className = "auth-msg ok";
    msgEl.textContent = "Đăng nhập thành công!";
    setTimeout(() => {
      document.getElementById("authModal").classList.remove("show");
      updateAuthUI();
      toast("Xin chào, " + res.user.name + "!");
    }, 600);
} else {
    // register
    const name = document.getElementById("a-name").value.trim();
    const phone = document.getElementById("a-phone").value.trim();
    const password2 = document.getElementById("a-password2").value.trim();
    if (!name) {
      msgEl.className = "auth-msg err";
      msgEl.textContent = "Vui lòng nhập họ & tên";
      return;
    }
    if (password.length < 6) {
      msgEl.className = "auth-msg err";
      msgEl.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
      return;
    }
    if (password !== password2) {
      msgEl.className = "auth-msg err";
      msgEl.textContent = "Mật khẩu xác nhận không khớp";
      return;
    }
    const res = registerUser(username, password, name, phone);
    if (!res.ok) {
      msgEl.className = "auth-msg err";
      msgEl.textContent = res.msg;
      return;
    }
    // auto login
    loginUser(username, password);
    msgEl.className = "auth-msg ok";
    msgEl.textContent = "Đăng ký thành công! Chào mừng bạn.";
    setTimeout(() => {
      document.getElementById("authModal").classList.remove("show");
      updateAuthUI();
      toast("Đăng ký thành công! Bạn được giảm 5% cho thành viên 😊");
    }, 600);
  }
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


// ===== Carousel ảnh sản phẩm (nút trái/phải, quay vòng, vuốt trên điện thoại) =====
function carouselHtml(imgs, name, extraCls) {
  const list = (imgs && imgs.length) ? imgs : ["🔧"];
  const n = list.length;
  const slides = list.map((img, i) => {
    const inner = looksLikeImage(img)
      ? `<img src="${img}" alt="${escapeHtml(name)}${n > 1 ? " - ảnh " + (i + 1) : ""}" loading="lazy" decoding="async" onerror="this.onerror=null;this.replaceWith('🔧')" />`
      : `<span class="img-emoji">${img}</span>`;
    return `<div class="img-slide ${i === 0 ? "active" : ""}">${inner}</div>`;
  }).join("");
  const nav = n > 1
    ? `<button type="button" class="img-nav prev" data-nav="-1" aria-label="Ảnh trước"><i class="fa-solid fa-chevron-left"></i></button>
       <button type="button" class="img-nav next" data-nav="1" aria-label="Ảnh sau"><i class="fa-solid fa-chevron-right"></i></button>
       <div class="img-dots">${list.map((_, i) => `<button type="button" class="img-dot ${i === 0 ? "active" : ""}" data-go="${i}" aria-label="Ảnh ${i + 1}"></button>`).join("")}</div>
       <span class="img-count">1/${n}</span>`
    : "";
  return `<div class="img-carousel ${extraCls || ""}" data-ci="0" data-n="${n}">${slides}${nav}</div>`;
}

function carouselGo(car, idx) {
  const slides = car.querySelectorAll(".img-slide");
  const n = slides.length;
  if (n < 2) return;
  const i = ((idx % n) + n) % n; // quay vòng
  car.dataset.ci = i;
  slides.forEach((s, k) => s.classList.toggle("active", k === i));
  car.querySelectorAll(".img-dot").forEach((d, k) => d.classList.toggle("active", k === i));
  const cnt = car.querySelector(".img-count");
  if (cnt) cnt.textContent = (i + 1) + "/" + n;
  if (car.closest("#modalBody")) {
    document.querySelectorAll("#modalBody .gallery-thumb").forEach((t, k) => t.classList.toggle("active", k === i));
  }
}

function carouselStep(car, delta) {
  carouselGo(car, Number(car.dataset.ci || 0) + delta);
}

// Bắt sự kiện ở pha capture để nút chuyển ảnh không mở trang chi tiết sản phẩm
document.addEventListener("click", e => {
  const nav = e.target.closest && e.target.closest(".img-nav, .img-dot");
  if (!nav) return;
  const car = nav.closest(".img-carousel");
  if (!car) return;
  e.stopPropagation();
  e.preventDefault();
  if (nav.classList.contains("img-dot")) carouselGo(car, Number(nav.dataset.go));
  else carouselStep(car, Number(nav.dataset.nav));
}, true);

// Vuốt trái/phải trên điện thoại
(function () {
  let sx = 0, sy = 0, car = null;
  document.addEventListener("touchstart", e => {
    car = e.target.closest && e.target.closest(".img-carousel");
    if (!car || Number(car.dataset.n) < 2) { car = null; return; }
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", e => {
    if (!car) return;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      carouselStep(car, dx < 0 ? 1 : -1);
      // chặn click "ma" sau khi vuốt để không mở chi tiết
      const stop = ev => { ev.stopPropagation(); ev.preventDefault(); };
      document.addEventListener("click", stop, { capture: true, once: true });
      setTimeout(() => document.removeEventListener("click", stop, true), 400);
    }
    car = null;
  }, { passive: true });
})();

// ===== Ô "Combo Tự lắp / Robot hoàn thiện / XiaoZhi78 AI" -> lọc danh mục sản phẩm =====
document.addEventListener("click", e => {
  const pick = e.target.closest && e.target.closest("[data-cat-pick]");
  if (!pick) return;
  currentCategory = pick.dataset.catPick;
  renderCategories();
  renderProducts();
  const target = document.getElementById("products");
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
});
