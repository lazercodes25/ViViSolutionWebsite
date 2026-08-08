/* ===== Điện tử E-Solution Đà Nẵng - Authentication & Users ===== */

const USERS_KEY = "dnd_users";
const SESSION_KEY = "dnd_session";

// Default users: 1 admin
const DEFAULT_USERS = [
  { id: 1, username: "admin", password: "admin123", name: "Quản trị viên", role: "admin", phone: "", address: "" }
];

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return clone(DEFAULT_USERS);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function setSession(u) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(u));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function currentUser() {
  return getSession();
}
function isLoggedIn() {
  return !!getSession();
}
function isAdmin() {
  const u = getSession();
  return u && u.role === "admin";
}

// Register a new user
function registerUser(username, password, name, phone, address) {
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, msg: "Tên đăng nhập đã tồn tại" };
  }
  const newUser = {
    id: Math.max(0, ...users.map(u => u.id)) + 1,
    username,
    password,
    name: name || username,
    role: "user",
    phone: phone || "",
    address: address || ""
  };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

// Login
function loginUser(username, password) {
  const users = getUsers();
  const u = users.find(x => x.username.toLowerCase() === username.toLowerCase() && x.password === password);
  if (!u) return { ok: false, msg: "Sai tên đăng nhập hoặc mật khẩu" };
  const session = { id: u.id, username: u.username, name: u.name, role: u.role, phone: u.phone, address: u.address };
  setSession(session);
  return { ok: true, user: session };
}

function logout() {
  clearSession();
}

// Change password for the currently logged-in user
function changePassword(username, currentPwd, newPwd) {
  const users = getUsers();
  const u = users.find(x => x.username.toLowerCase() === username.toLowerCase());
  if (!u) return { ok: false, msg: "Không tìm thấy tài khoản." };
  if (u.password !== currentPwd) return { ok: false, msg: "Mật khẩu hiện tại không đúng." };
  if (!newPwd || newPwd.length < 6) return { ok: false, msg: "Mật khẩu mới phải có ít nhất 6 ký tự." };
  u.password = newPwd;
  saveUsers(users);
  return { ok: true };
}

// User discount: user accounts get 5% off
function userDiscount() {
  return isLoggedIn() && !isAdmin() ? 0.05 : 0;
}

function clone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

// Ensure admin exists (in case users cleared)
function ensureAdmin() {
  const users = getUsers();
  if (!users.some(u => u.role === "admin")) {
    users.push({ id: 1, username: "admin", password: "admin123", name: "Quản trị viên", role: "admin", phone: "", address: "" });
    saveUsers(users);
  }
}
