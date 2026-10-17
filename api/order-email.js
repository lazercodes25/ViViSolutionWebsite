const nodemailer = require("nodemailer");

function text(value) {
  return value === undefined || value === null || value === "" ? "-" : String(value);
}

function escapeHtml(value) {
  return text(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[ch]));
}

function buildMessage(order) {
  const customer = order.customer || {};
  const items = (order.items || []).map(item =>
    `• ${text(item.name)}${item.option ? ` (${item.option})` : ""} ×${text(item.qty)} — ${Number(item.qty || 0) * Number(item.price || 0)}đ`
  );
  const lines = [
    "CÓ ĐƠN HÀNG MỚI 📦",
    "=================================",
    `Mã đơn hàng: ${text(order.code)}`,
    `Ngày đặt: ${text(order.createdAt)}`,
    "",
    "THÔNG TIN KHÁCH HÀNG",
    `- Họ tên: ${text(customer.name)}`,
    `- SĐT: ${text(customer.phone)}`,
    `- Email: ${text(customer.email)}`,
    `- Địa chỉ: ${text(customer.address)}`,
    "",
    "ĐƠN HÀNG",
    ...(items.length ? items : ["-"]),
    "",
    `Tạm tính: ${text(order.subtotal)}đ`,
    ...(order.userDiscount ? [`Giảm thành viên: -${order.userDiscount}đ`] : []),
    ...(order.voucherCode ? [`Voucher ${order.voucherCode}: -${order.voucherDiscount}đ`] : []),
    `Phí vận chuyển: ${text(order.shipping)}đ`,
    `TỔNG THANH TOÁN: ${text(order.total)}đ`,
    "",
    `Thanh toán: ${text(order.payment)}`,
    ...(order.note ? [`Lưu ý: ${order.note}`] : [])
  ];
  return lines;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const order = req.body || {};
    const lines = buildMessage(order);
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error("Chưa cấu hình SMTP_USER/SMTP_PASS trên Vercel");
    }

    const html = lines.map(line => {
      const safe = escapeHtml(line);
      if (line === "CÓ ĐƠN HÀNG MỚI 📦") return `<h2 style="color:#0d47a1">${safe}</h2>`;
      if (/^(THÔNG TIN KHÁCH HÀNG|ĐƠN HÀNG)$/.test(line)) return `<h3>${safe}</h3>`;
      if (line.startsWith("TỔNG THANH TOÁN")) return `<p style="font-weight:bold;color:#d32f2f">${safe}</p>`;
      if (line.startsWith("===")) return "<hr>";
      return `<p style="margin:2px 0">${safe}</p>`;
    }).join("\n");

    await transporter.sendMail({
      from: `"ViVi Solution" <${process.env.SMTP_USER}>`,
      to: process.env.ORDER_RECIPIENT || process.env.SMTP_USER,
      subject: `Đơn hàng mới ${text(order.code)}`,
      text: lines.join("\n"),
      html
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Order email error:", error);
    return res.status(500).json({ ok: false, error: "Không thể gửi email đơn hàng" });
  }
};
