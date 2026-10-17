/* ===== ViVi Solution Đà Nẵng - Backend (send email on order) ===== */

require("dotenv").config();
const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

// Serve static files (the website itself)
app.use(express.static(path.join(__dirname)));

// ---- Order email endpoint ----
// Frontend calls POST /api/order-email with the order payload.
app.post("/api/order-email", async (req, res) => {
  try {
    const order = req.body || {};

    // Build email content
    const orderItems = (order.items || [])
      .map(i => `• ${i.name}${i.option ? " (" + i.option + ")" : ""} ×${i.qty} — ${i.qty * i.price}đ`)
      .join("\n");

    const customer = order.customer || {};
    const lines = [];
    lines.push("CÓ ĐƠN HÀNG MỚI 📦");
    lines.push("=================================");
    lines.push(`Mã đơn hàng: ${order.code || "-"}`);
    lines.push(`Ngày đặt: ${order.createdAt || "-"}`);
    lines.push("");
    lines.push("THÔNG TIN KHÁCH HÀNG");
    lines.push(`- Họ tên: ${customer.name || "-"}`);
    lines.push(`- SĐT: ${customer.phone || "-"}`);
    lines.push(`- Email: ${customer.email || "-"}`);
    lines.push(`- Địa chỉ: ${customer.address || "-"}`);
    lines.push("");
    lines.push("ĐƠN HÀNG");
    lines.push(orderItems || "-");
    lines.push("");
    lines.push(`Tạm tính: ${order.subtotal !== undefined ? order.subtotal + "đ" : "-"}`);
    if (order.userDiscount) lines.push(`Giảm thành viên: -${order.userDiscount}đ`);
    if (order.voucherCode) lines.push(`Voucher ${order.voucherCode}: -${order.voucherDiscount}đ`);
    lines.push(`Phí vận chuyển: ${order.shipping !== undefined ? order.shipping + "đ" : "-"}`);
    lines.push(`TỔNG THANH TOÁN: ${order.total !== undefined ? order.total + "đ" : "-"}`);
    lines.push("");
    lines.push(`Thanh toán: ${order.payment || "-"}`);
    if (order.note) lines.push(`Lưu ý: ${order.note}`);

    const htmlContent = lines.map(l => {
      if (l.startsWith("==")) return "<hr style='border:none;border-top:1px solid #ddd;margin:10px 0'>";
      if (l.toUpperCase().startsWith("CÓ ĐƠN")) return `<h2 style="color:#0d47a1">${l}</h2>`;
      if (l.toUpperCase().startsWith("THÔNG TIN KHÁCH")) return `<h3 style="margin-top:14px">${l}</h3>`;
      if (l.toUpperCase().startsWith("ĐƠN HÀNG")) return `<h3 style="margin-top:14px">${l}</h3>`;
      if (l.startsWith("TỔNG THANH TOÁN")) return `<p style="font-weight:bold;color:#d32f2f;font-size:15px">${l}</p>`;
      return `<p style="margin:2px 0">${l}</p>`;
    }).join("\n");

    // SMTP config from environment / defaults
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465 ? true : false,
      auth: {
        user: process.env.SMTP_USER || "xuantung2521@gmail.com",
        pass: process.env.SMTP_PASS || ""
      }
    });

    await transporter.sendMail({
      from: `"Cửa hàng ViVi Solution" <${process.env.SMTP_USER || "xuantung2521@gmail.com"}>`,
      to: process.env.ORDER_RECIPIENT || "xuantung2521@gmail.com",
      subject: `Đơn hàng mới ${order.code || ""}`,
      text: lines.join("\n"),
      html: htmlContent
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log("✅ Server đang chạy tại http://localhost:" + PORT);
  console.log("   Nhớ tạo file .env với SMTP_PASS (xem .env.example)");
});

