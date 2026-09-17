// data.js - Initial data store (users will be persisted in localStorage)
// Jangan edit manual kecuali untuk reset

const RD_INITIAL_USERS = [];

// Helper untuk load/save users
const RD_STORAGE_KEY = 'rd_users_v1';
const RD_SESSION_KEY = 'rd_session_v1';
const RD_RATE_KEY = 'rd_usd_idr_rate';

function getUsers() {
  try {
    const raw = localStorage.getItem(RD_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [...RD_INITIAL_USERS];
}

function saveUsers(users) {
  localStorage.setItem(RD_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  const session = localStorage.getItem(RD_SESSION_KEY);
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.username === session) || null;
}

function setSession(username) {
  localStorage.setItem(RD_SESSION_KEY, username);
}

function clearSession() {
  localStorage.removeItem(RD_SESSION_KEY);
}

function updateUser(username, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

function createUser(username, password) {
  const users = getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, message: 'Username sudah digunakan' };
  }
  if (username.length < 3) {
    return { success: false, message: 'Username minimal 3 karakter' };
  }
  if (password.length < 4) {
    return { success: false, message: 'Password minimal 4 karakter' };
  }
  const newUser = {
    username,
    password, // plain for simplicity (static site)
    balanceUSD: 0,
    balanceIDR: 0,
    unlockedWithdraw: false,
    withdrawHistory: [],
    createdAt: new Date().toISOString(),
    lastMine: null
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  if (!user) {
    return { success: false, message: 'Username atau password salah' };
  }
  setSession(user.username);
  return { success: true, user };
}

// Exchange rate helper (cache 1 jam)
async function getUsdIdrRate() {
  try {
    const cached = localStorage.getItem(RD_RATE_KEY);
    if (cached) {
      const { rate, ts } = JSON.parse(cached);
      if (Date.now() - ts < 3600000) return rate;
    }
  } catch (e) {}

  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await res.json();
    const rate = data.rates?.IDR || 17688;
    localStorage.setItem(RD_RATE_KEY, JSON.stringify({ rate, ts: Date.now() }));
    return rate;
  } catch (e) {
    return 17688; // fallback
  }
}

// Export for modules
window.RD = {
  getUsers,
  saveUsers,
  getCurrentUser,
  setSession,
  clearSession,
  updateUser,
  createUser,
  loginUser,
  getUsdIdrRate
};
