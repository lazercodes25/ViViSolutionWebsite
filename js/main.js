/* ===== Điện tử E-Solution Đà Nẵng - Storefront ===== */

document.addEventListener("DOMContentLoaded", () => {
  ensureAdmin();
  renderCategories();
  renderStats();
  renderBanner();
  bindEvents();
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
  // Category
  document.getElementById("catBar").addEventListener("click", e => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;
    currentCategory = btn.dataset.cat;
    renderCategories();
    renderProducts();
  });

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
    if (btn.dataset.action === "add") addToCart(id);
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
    if (btn.dataset.act === "inc") changeQty(id, 1);
    if (btn.dataset.act === "dec") changeQty(id, -1);
    if (btn.dataset.act === "rm") removeFromCart(id);
  });

document.getElementById("checkoutBtn").addEventListener("click", checkout);

  // Auth
  document.getElementById("authBtn").addEventListener("click", openAuthModal);
  document.getElementById("authClose").addEventListener("click", () => document.getElementById("authModal").classList.remove("show"));
  document.getElementById("authSubmit").addEventListener("click", submitAuth);
  document.getElementById("authModal").addEventListener("click", e => { if (e.target.id === "authModal") e.target.classList.remove("show"); });
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
  document.getElementById("modalBody").innerHTML = `
    <button class="modal-close">✕</button>
    <div style="font-size:4rem;text-align:center;margin-bottom:.5rem">${imgHtml}</div>
    ${thumbs}
    <h2>${escapeHtml(p.name)}</h2>
    <div class="stars">${renderStars(p.rating)}</div>
    <div class="m-price">${formatPrice(p.price)}</div>
    <p class="m-desc">${escapeHtml(p.desc || "Chưa có mô tả.")}</p>
    <p class="pc-stock ${st.cls}">${st.label} (${p.stock} ${p.unit})</p>
    <button class="btn btn-accent" id="modalAdd" ${p.stock <= 0 ? "disabled" : ""} style="width:100%;margin-top:.8rem">
      ${p.stock <= 0 ? "Hết hàng" : "🛒 Thêm vào giỏ hàng"}
    </button>`;
  document.getElementById("detailModal").classList.add("show");
  // Close button for the dynamic detail modal
  const closeBtn = document.querySelector("#modalBody .modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("detailModal").classList.remove("show");
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
  if (add) add.addEventListener("click", () => { addToCart(id); });
}

// Determine if an image string is an actual image (URL / data URL), not an emoji.
function looksLikeImage(img) {
  return typeof img === "string" &&
    (/^data:image\//i.test(img) || /^https?:\/\//i.test(img) || /^blob:/i.test(img));
}

// ===== Cart logic =====
function addToCart(id) {
  const p = getProducts().find(p => Number(p.id) === Number(id));
  if (!p || p.stock <= 0) { toast("Sản phẩm này hiện hết hàng"); return; }
  const cart = getCart();
  const found = cart.find(c => Number(c.id) === Number(id));
  if (found) {
    if (found.qty >= p.stock) { toast("Số lượng vượt quá tồn kho"); return; }
    found.qty++;
  } else {
    cart.push({ id: Number(id), qty: 1 });
  }
  saveCart(cart);
  renderCart();
  toast("Đã thêm vào giỏ hàng 🛒");
}

function changeQty(id, delta) {
  const p = getProducts().find(p => Number(p.id) === Number(id));
  let cart = getCart();
  const found = cart.find(c => Number(c.id) === Number(id));
  if (!found) return;
  found.qty += delta;
  if (found.qty <= 0) cart = cart.filter(c => Number(c.id) !== Number(id));
  if (p && found.qty > p.stock) { found.qty = p.stock; toast("Vượt quá tồn kho"); }
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  let cart = getCart().filter(c => Number(c.id) !== Number(id));
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
    qty += c.qty;
    total += p.price * c.qty;
    return `
      <div class="cart-item">
        <div class="ci-img">${img}</div>
        <div class="ci-info">
          <div class="ci-name">${escapeHtml(p.name)}</div>
          <div class="ci-price">${formatPrice(p.price)} × ${c.qty}</div>
          <div class="qty-ctrl">
            <button data-act="dec" data-id="${p.id}">−</button>
            <span>${c.qty}</span>
            <button data-act="inc" data-id="${p.id}">+</button>
          </div>
        </div>
        <button class="ci-remove" data-act="rm" data-id="${p.id}">🗑️</button>
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
  const label = document.getElementById("authLabel");
  if (user) {
    label.textContent = user.name + " (" + (user.role === "admin" ? "Admin" : "User") + ")";
  } else {
    label.textContent = "Đăng nhập";
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
    // Logged in -> offer logout
    if (confirm("Bạn đang đăng nhập là " + user.name + ".\nNhấn OK để đăng xuất.")) {
      logout();
      updateAuthUI();
      renderProducts();
      toast("Đã đăng xuất");
    }
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
  // Show name/phone only for register
  document.querySelectorAll("#authForm .reg-only").forEach(el => el.style.display = mode === "register" ? "" : "none");
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
    if (!name) {
      msgEl.className = "auth-msg err";
      msgEl.textContent = "Vui lòng nhập họ & tên";
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
