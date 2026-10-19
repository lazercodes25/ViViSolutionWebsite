/* ===== ViVi Solution - Chế độ giao diện Sáng / Tối =====
 * Nạp file này trong <head> (không defer) để áp dụng theme trước khi trang vẽ,
 * tránh nháy màu. Các nút có thuộc tính data-theme-set="light|dark" sẽ tự gắn sự kiện.
 */
(function () {
  var KEY = "vivi_ui_mode";
  var root = document.documentElement;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(mode) {
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    var btns = document.querySelectorAll("[data-theme-set]");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-theme-set") === mode;
      btns[i].classList.toggle("is-on", on);
      btns[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "dark" ? "#070b10" : "#ffffff");
  }

  apply(read() === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.classList.contains("dark") ? "dark" : "light");
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-theme-set]");
      if (!b) return;
      var mode = b.getAttribute("data-theme-set");
      try { localStorage.setItem(KEY, mode); } catch (err) {}
      apply(mode);
    });
  });
})();
