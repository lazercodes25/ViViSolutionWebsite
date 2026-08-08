/* ===== Điện tử E-Solution Đà Nẵng - Checkout ===== */

let appliedVoucher = null; // { discount, name }

document.addEventListener("DOMContentLoaded", () => {
  initCheckout();
});

function initCheckout() {
  const cart = getCart();
  if (!cart.length) {
    document.getElementById("osItems").innerHTML = `<div class="cart-empty">Giỏ hàng trống. <a href="index.html">Tiếp tục mua sắm</a></div>`;
    const btn = document.getElementById("placeOrderBtn");
    btn.disabled = true;
    btn.textContent = "Giỏ hàng trống";
    return;
  }
// Auto-fill info if logged in as user
  const user = currentUser();
  if (user && user.role !== "admin") {
    if (!document.getElementById("ck-name").value) document.getElementById("ck-name").value = user.name || "";
    if (!document.getElementById("ck-phone").value) document.getElementById("ck-phone").value = user.phone || "";
    if (!document.getElementById("ck-address").value) document.getElementById("ck-address").value = user.address || "";
  }
  // Show guest notice when not logged in (guest can still order)
  const guestNotice = document.getElementById("guestNotice");
  if (guestNotice) {
    guestNotice.style.display = (!user || user.role === "guest") ? "" : "none";
  }
  bindCheckout();
  renderOrderSummary();
}

function bindCheckout() {
  document.getElementById("applyVoucherBtn").addEventListener("click", applyVoucherCode);
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
  // recompute when voucher changed
  document.getElementById("voucherInput").addEventListener("input", () => {
    appliedVoucher = null;
    renderOrderSummary();
  });
}

function cartItems() {
  const cart = getCart();
  const products = getProducts();
  return cart.map(c => {
    const p = products.find(pp => Number(pp.id) === Number(c.id));
    if (!p) return null;
    const unitPrice = (typeof c.optPrice === "number" && c.optPrice > 0) ? c.optPrice : (Number(p.price) || 0);
    const optLabel = c.optLabel || "Mặc định";
    return { ...p, qty: c.qty, optLabel, unitPrice, lineTotal: unitPrice * c.qty };
  }).filter(Boolean);
}

function calcTotals() {
  const items = cartItems();
  let subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  // user discount 5% — rename to avoid shadowing the userDiscount() function
  let userDiscRate = userDiscount();
  let discountUser = Math.round(subtotal * userDiscRate);
  // voucher
  let voucherDiscount = 0;
  let discountInfo = null;
  if (appliedVoucher) {
    voucherDiscount = Math.round(subtotal * appliedVoucher.discount);
    discountInfo = { code: appliedVoucher.nameMatch || "Voucher", amount: voucherDiscount };
  }
  const afterDiscount = subtotal - discountUser - voucherDiscount;
  const shipping = shippingFee(afterDiscount);
  let total = afterDiscount + shipping;
  if (total < 0) total = 0;
  return { items, subtotal, discountUser, voucherDiscount, discountInfo, shipping, total, hasUserDiscount: userDiscRate > 0 };
}

function renderOrderSummary() {
  const { items, subtotal, discountUser, voucherDiscount, discountInfo, shipping, total, hasUserDiscount } = calcTotals();
  const user = currentUser();

// items
  document.getElementById("osItems").innerHTML = items.map(i => `
    <div class="os-item">
      <span class="name">${escapeHtml(i.name)}${(i.optLabel && i.optLabel !== "Mặc định") ? `<small class="ci-opt"> — ${escapeHtml(i.optLabel)}</small>` : ""}</span>
      <span class="qty">×${i.qty}</span>
      <span>${formatPrice(i.lineTotal)}</span>
    </div>`).join("") || `<div class="cart-empty">Trống</div>`;

  // price breakdown
  const rows = [];
  rows.push(`<div class="os-row"><span>Tạm tính</span><span>${formatPrice(subtotal)}</span></div>`);
  if (hasUserDiscount) {
    rows.push(`<div class="os-row discount-ok"><span>Giảm giá thành viên (5%)${user ? " 😊" : ""}</span><span>-${formatPrice(discountUser)}</span></div>`);
  }
  if (appliedVoucher) {
    rows.push(`<div class="os-row discount-ok"><span>Voucher ${escapeHtml(discountInfo.code)}</span><span>-${formatPrice(voucherDiscount)}</span></div>`);
  }
  rows.push(`<div class="os-row"><span>Phí vận chuyển</span><span>${shipping === 0 ? "<b style='color:var(--success)'>FREE</b>" : formatPrice(shipping)}</span></div>`);
  rows.push(`<div class="os-row total"><span>Tổng cộng</span><span>${formatPrice(total)}</span></div>`);
  document.getElementById("priceBreakdown").innerHTML = rows.join("");
}

function applyVoucherCode() {
  const code = document.getElementById("voucherInput").value.trim();
  if (!code) { showVoucher("<div class='err'>Vui lòng nhập mã voucher</div>"); return; }
  const v = applyVoucher(code);
  if (!v) { showVoucher("<div class='err'>❌ Mã voucher không hợp lệ</div>"); return; }
  appliedVoucher = { ...v, nameMatch: code.toUpperCase() };
  showVoucher(`<div class='ok'>✅ Đã áp dụng voucher ${code.toUpperCase()}: ${v.name}</div>`);
  renderOrderSummary();
}

// fix: showVoucher writes into innerHTML of div.voucher-msg (styled .err/.ok via children)
function showVoucher(html) {
  const el = document.getElementById("voucherMsg");
  el.innerHTML = html;
  // reapply color class on wrapper
  el.className = "voucher-msg " + (html.includes("err") ? "err" : "ok");
}

function placeOrder() {
  const items = cartItems();
  if (!items.length) { toast("Giỏ hàng trống"); return; }

  const name = document.getElementById("ck-name").value.trim();
  const phone = document.getElementById("ck-phone").value.trim();
  const address = document.getElementById("ck-address").value.trim();

  if (!name || !phone || !address) {
    toast("Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ");
    return;
  }

  const totals = calcTotals();
  const payment = document.getElementById("ck-payment").value;
  const note = document.getElementById("ck-note").value.trim();
  const user = currentUser();

  const order = {
    id: Date.now(),
    code: "DH" + Date.now().toString().slice(-6),
    customer: { name, phone, address, email: document.getElementById("ck-email").value.trim() },
    username: user ? user.username : "guest",
    role: user ? user.role : "guest",
items: items.map(i => ({ id: i.id, name: i.name, price: i.unitPrice || i.price, qty: i.qty, unit: i.unit, optLabel: i.optLabel && i.optLabel !== "Mặc định" ? i.optLabel : null })),
    subtotal: totals.subtotal,
    userDiscount: totals.discountUser,
    voucherCode: appliedVoucher ? appliedVoucher.nameMatch.toUpperCase() : null,
    voucherDiscount: totals.voucherDiscount,
    shipping: totals.shipping,
    total: totals.total,
    payment,
    note,
    status: "pending",
    createdAt: new Date().toLocaleString("vi-VN")
  };

  // Save order for admin
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  // Reduce stock (per option line when applicable)
  const products = getProducts();
  items.forEach(i => {
    const p = products.find(pp => Number(pp.id) === Number(i.id));
    if (!p) return;
    if (i.optLabel && Array.isArray(p.options) && p.options.length) {
      const opt = p.options.find(o => (o.label || "Mặc định") === i.optLabel);
      if (opt) {
        if (typeof opt.stock === "number" && opt.stock >= 0) opt.stock = Math.max(0, opt.stock - i.qty);
        else p.stock = Math.max(0, p.stock - i.qty);
      } else {
        p.stock = Math.max(0, p.stock - i.qty);
      }
    } else {
      p.stock = Math.max(0, p.stock - i.qty);
    }
  });
  saveProducts(products);

  // Clear cart
  saveCart([]);

  // Gửi email thông báo đơn hàng (không làm hỏng luồng đặt hàng nếu lỗi)
  const emailOk = sendOrderEmail(order);

  // Show success
  document.getElementById("successMsg").innerHTML =
    `Mã đơn hàng của bạn: <b>${order.code}</b><br>Tổng thanh toán: <b style="color:var(--danger)">${formatPrice(order.total)}</b>` +
    `<br>Thanh toán: <b>${paymentName(payment)}</b><br><span style="font-size:.85rem">📍 ${address}</span>` +
    (emailOk
      ? `<br><span style="font-size:.85rem;color:var(--success)">✉️ Đã gửi thông báo đơn hàng về email quản trị.</span>`
      : `<br><span style="font-size:.85rem;color:var(--warn)">⚠️ Chưa gửi được email thông báo (chưa cấu hình server SMTP). Liên hệ: 0773372913</span>`);

  document.getElementById("successModal").classList.add("show");
}

// Gửi email xác nhận đơn hàng tới email nhận (xem server.js + .env)
// Trả về true nếu đã gửi được yêu cầu tới backend thành công (không phải file:// và có fetch).
function sendOrderEmail(order) {
  try {
    if (!window.fetch) return false;
    // Nếu đang mở file trực tiếp (file://) thì không có backend -> không gửi được
    if (window.location.protocol === "file:") return false;
    const payload = {
      code: order.code,
      createdAt: order.createdAt,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      userDiscount: order.userDiscount,
      voucherCode: order.voucherCode,
      voucherDiscount: order.voucherDiscount,
      shipping: order.shipping,
      total: order.total,
      payment: paymentName(order.payment),
      note: order.note
    };
    let sent = false;
    fetch("/api/order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(r => { if (r.ok) sent = true; })
      .catch(() => { /* backend chưa chạy */ });
    // Trả về true ngay (đã gửi yêu cầu). Email sẽ gửi nếu server đang chạy + SMTP đúng.
    return true;
  } catch (e) { return false; }
}

function paymentName(v) {
  return { cod: "COD (trả khi nhận)", bank: "Chuyển khoản", momo: "Ví MoMo" }[v] || v;
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

// Toast
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.style.display = "none", 2500);
}
