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
    const primary = getPrimaryImage(p);
    const imgHtml = looksLikeImage(primary)
      ? `<img src="${primary}" alt="${p.name}" onerror="this.onerror=null;this.replaceWith('🔧')" />`
      : `<span>${primary}</span>`;
    const st = stockStatus(p.stock);
    const stars = renderStars(p.rating);
    const disabled = p.stock <= 0 ? "disabled" : "";
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="img-wrap">${imgHtml}</div>
        <div class="pc-body">
          <div class="pc-cat">${p.category}</div>
          <div class="pc-name">${escapeHtml(p.name)}</div>
          <div class="stars">${stars}</div>
          <div class="pc-price">${formatPrice(p.price)}</div>
          <div class="pc-stock ${st.cls}">${st.label} (${p.stock} ${p.unit})</div>
          <div class="pc-actions">
            <button class="btn btn-outline btn-sm" data-action="view" data-id="${p.id}">Chi tiết</button>
            <button class="btn btn-accent btn-sm" data-action="add" data-id="${p.id}" ${disabled}>${disabled ? "Hết hàng" : "Thêm giỏ"}</button>
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
  const st = stockStatus(p.stock);
  const imgs = getProductImages(p);
  const imgHtml = looksLikeImage(imgs[0])
    ? `<img src="${imgs[0]}" style="max-height:220px;margin:0 auto" alt="${p.name}" id="galleryMainImg" />`
    : `<div style="font-size:5rem;text-align:center">${imgs[0] || "🔧"}</div>`;
  // Thumbnail gallery (if multiple images)
  const thumbs = imgs.length > 1
    ? `<div class="gallery-thumbs" style="display:flex;gap:.5rem;justify-content:center;margin-top:.6rem;flex-wrap:wrap">
        ${imgs.map((img, i) => {
          const tContent = looksLikeImage(img)
            ? `<img src="${img}" alt="">`
            : `<span>${img}</span>`;
          return `<button type="button" class="gallery-thumb ${i === 0 ? "active" : ""}" data-gidx="${i}" style="width:56px;height:56px;border:2px solid ${i === 0 ? "var(--primary)" : "transparent"};border-radius:8px;overflow:hidden;cursor:pointer;background:#f1f4fa;display:flex;align-items:center;justify-content:center">${tContent}</button>`;
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
    <div style="font-size:4rem;text-align:center;margin-bottom:.5rem">${imgHtml}</div>
    ${thumbs}
    <h2>${escapeHtml(p.name)}</h2>
    <div class="stars">${renderStars(p.rating)}</div>
    <div class="m-price" id="modalPrice">${formatPrice(optionPrice(p, opts[0]))}</div>
    <p class="m-desc">${escapeHtml(p.desc || "Chưa có mô tả.")}</p>
    ${optHtml}
    <p class="pc-stock ${st.cls}" id="modalStock">${st.label} (${optionStock(p, opts[0])} ${p.unit})</p>
    <button class="btn btn-accent" id="modalAdd" style="width:100%;margin-top:.8rem">
      ${optionStock(p, opts[0]) <= 0 ? "Hết hàng" : "🛒 Thêm vào giỏ hàng"}
    </button>`;
  document.getElementById("detailModal").classList.add("show");

  // Track the currently selected option index
  let selOpt = 0;
  // Close button for the dynamic detail modal
  const closeBtn = document.querySelector("#modalBody .modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("detailModal").classList.remove("show");
    });
  }
  // Option chip selection
  const chips = document.querySelectorAll("#modalBody .opt-chip");
  if (chips.length) {
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        selOpt = Number(chip.dataset.opt);
        const curOpt = opts[selOpt];
        const priceEl = document.getElementById("modalPrice");
        const stockEl = document.getElementById("modalStock");
        const addBtn = document.getElementById("modalAdd");
        if (priceEl) priceEl.textContent = formatPrice(optionPrice(p, curOpt));
        const os = optionStock(p, curOpt);
        const ost = stockStatus(os);
        if (stockEl) {
          stockEl.className = "pc-stock " + st.cls;
          stockEl.textContent = ost.label + " (" + os + " " + p.unit + ")";
        }
        if (addBtn) {
          addBtn.disabled = os <= 0;
          addBtn.textContent = os <= 0 ? "Hết hàng" : "🛒 Thêm vào giỏ hàng";
        }
      });
    });
  }
  // Gallery switching
  document.querySelectorAll(".gallery-thumb").forEach(t => {
    t.addEventListener("click", () => {
      const idx = Number(t.dataset.gidx);
      const cur = getProductImages(getProducts().find(pp => Number(pp.id) === Number(id)));
      const main = document.getElementById("galleryMainImg");
      document.querySelectorAll(".gallery-thumb").forEach(x => { x.style.borderColor = "transparent"; });
      t.style.borderColor = "var(--primary)";
      if (main && main.tagName === "IMG" && looksLikeImage(cur[idx])) {
        main.src = cur[idx];
      }
    });
  });
  const add = document.getElementById("modalAdd");
  if (add) {
    add.setAttribute("data-sel", "0");
    add.addEventListener("click", () => {
      const curOpt = opts[selOpt];
      if (curOpt && optionStock(p, curOpt) <= 0) { toast("Phân loại này hiện hết hàng"); return; }
      addToCart(id, curOpt);
    });
  }
}

// Determine if an image string is an actual image (URL / data URL), not an emoji.
function looksLikeImage(img) {
  return typeof img === "string" &&
    (/^data:image\//i.test(img) || /^https?:\/\//i.test(img) || /^blob:/i.test(img));
}

// ===== Cart logic =====
// Cart item: { id, qty, optLabel?, optPrice?, optStock? }
function addToCart(id, opt) {
  const p = getProducts().find(p => Number(p.id) === Number(id));
  if (!p) return;
  // Determine unit price & stock for this line
  const unitPrice = opt && typeof opt.price === "number" && opt.price > 0 ? Number(opt.price) : Number(p.price) || 0;
  const unitStock = opt && typeof opt.stock === "number" && opt.stock >= 0 ? Number(opt.stock) : Number(p.stock) || 0;
  const optLabel = opt && opt.label ? String(opt.label) : "Mặc định";
  if (unitStock <= 0) { toast("Phân loại này hiện hết hàng"); return; }
  const cart = getCart();
  const found = cart.find(c => Number(c.id) === Number(id) && c.optLabel === optLabel);
  if (found) {
    if (found.qty >= unitStock) { toast("Số lượng vượt quá tồn kho"); return; }
    found.qty++;
  } else {
    cart.push({ id: Number(id), qty: 1, optLabel, optPrice: unitPrice, optStock: unitStock });
  }
  saveCart(cart);
  renderCart();
  toast("Đã thêm vào giỏ hàng 🛒");
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
      ? `<img src="${primary}" alt="" />` : `<span style="font-size:1.3rem">${primary}</span>`;
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
