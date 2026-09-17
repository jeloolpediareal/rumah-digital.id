// data.js - Storage & shared state (localStorage)

const RD_STORAGE_KEY = 'rd_users_v2';
const RD_SESSION_KEY = 'rd_session_v2';
const RD_RATE_KEY = 'rd_usd_idr_rate';
const RD_SERVERS_KEY = 'rd_servers_v1';
const RD_STATUS_KEY = 'rd_server_status_v1';
const RD_ADMIN_SESSION = 'rd_admin_session';

const DEFAULT_SERVERS = [
  { id: 'srv-1', name: 'Alpha Pool', rate: 0.07, active: true }
];

function getUsers() {
  try {
    const raw = localStorage.getItem(RD_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
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

function createUser(username, password, serverId) {
  const users = getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, message: 'Username sudah digunakan' };
  }
  if (username.length < 3) return { success: false, message: 'Username minimal 3 karakter' };
  if (password.length < 4) return { success: false, message: 'Password minimal 4 karakter' };

  const servers = getServers();
  const server = servers.find(s => s.id === serverId) || servers[0];

  const newUser = {
    username,
    password,
    balanceUSD: 0,
    balanceIDR: 0,
    unlockedWithdraw: false,
    withdrawHistory: [],
    serverId: server ? server.id : 'srv-1',
    lastActive: new Date().toISOString(),
    isMining: false,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, user: newUser };
}

function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  if (!user) return { success: false, message: 'Username atau password salah' };
  setSession(user.username);
  updateUser(user.username, { lastActive: new Date().toISOString() });
  return { success: true, user };
}

function getServers() {
  try {
    const raw = localStorage.getItem(RD_SERVERS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) return list;
    }
  } catch (e) {}
  localStorage.setItem(RD_SERVERS_KEY, JSON.stringify(DEFAULT_SERVERS));
  return [...DEFAULT_SERVERS];
}

function saveServers(servers) {
  localStorage.setItem(RD_SERVERS_KEY, JSON.stringify(servers));
}

function getServerStatus() {
  return localStorage.getItem(RD_STATUS_KEY) || 'online';
}

function setServerStatus(status) {
  localStorage.setItem(RD_STATUS_KEY, status);
}

function adminLogin(user, pass) {
  user = (user || '').trim();
  pass = (pass || '').trim();
  // Username: Jelool | Password: Kanaya Imut (spasi di tengah)
  if (user.toLowerCase() === 'jelool' && (pass === 'Kanaya Imut' || pass === 'KanayaImut' || pass.toLowerCase() === 'kanaya imut')) {
    localStorage.setItem(RD_ADMIN_SESSION, '1');
    return true;
  }
  return false;
}

function isAdminLoggedIn() {
  return localStorage.getItem(RD_ADMIN_SESSION) === '1';
}

function adminLogout() {
  localStorage.removeItem(RD_ADMIN_SESSION);
}

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
    return 17688;
  }
}

window.RD = {
  getUsers, saveUsers, getCurrentUser, setSession, clearSession,
  updateUser, createUser, loginUser,
  getServers, saveServers, getServerStatus, setServerStatus,
  adminLogin, isAdminLoggedIn, adminLogout,
  getUsdIdrRate
};
