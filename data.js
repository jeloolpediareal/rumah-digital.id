// data.js - Data persistence layer (localStorage + defaults)
// Semua data disimpan di localStorage agar tidak hilang

const STORAGE_KEYS = {
  users: 'rd_users_v1',
  servers: 'rd_servers_v1',
  global: 'rd_global_v1',
  session: 'rd_session_v1',
  withdrawals: 'rd_withdrawals_v1'
};

const DEFAULT_SERVERS = [
  { id: 'srv1', name: 'Alpha Mining Node', rate: 0.03, status: 'active' },
  { id: 'srv2', name: 'Beta Hash Farm', rate: 0.05, status: 'active' },
  { id: 'srv3', name: 'Gamma Power Core', rate: 0.08, status: 'active' }
];

const DEFAULT_GLOBAL = {
  serverOnline: true,
  exchangeRate: 17800 // IDR per 1 USD
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function saveJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Users
function getUsers() {
  return loadJSON(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
  saveJSON(STORAGE_KEYS.users, users);
}

function findUser(username) {
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
}

function createUser(username, password, selectedServerId) {
  const users = getUsers();
  if (findUser(username)) return { ok: false, msg: 'Username sudah digunakan' };
  const newUser = {
    id: 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    username,
    password, // plain for demo simplicity (production should hash)
    balance: 0,
    unlockedWithdraw: false,
    selectedServer: selectedServerId || (getServers()[0]?.id || null),
    isMining: false,
    lastMineAt: null,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

function updateUser(userId, updates) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], ...updates, lastActive: new Date().toISOString() };
  saveUsers(users);
  return true;
}

function getUserById(id) {
  return getUsers().find(u => u.id === id);
}

// Servers
function getServers() {
  const s = loadJSON(STORAGE_KEYS.servers, null);
  if (!s || s.length === 0) {
    saveJSON(STORAGE_KEYS.servers, DEFAULT_SERVERS);
    return DEFAULT_SERVERS;
  }
  return s;
}

function saveServers(servers) {
  saveJSON(STORAGE_KEYS.servers, servers);
}

function addServer(name, rate) {
  const servers = getServers();
  const id = 'srv' + Date.now();
  servers.push({ id, name, rate: parseFloat(rate) || 0.01, status: 'active' });
  saveServers(servers);
  return id;
}

// Global
function getGlobal() {
  return loadJSON(STORAGE_KEYS.global, DEFAULT_GLOBAL);
}

function saveGlobal(g) {
  saveJSON(STORAGE_KEYS.global, g);
}

function setServerOnline(online) {
  const g = getGlobal();
  g.serverOnline = !!online;
  saveGlobal(g);
}

// Session
function setSession(userId) {
  saveJSON(STORAGE_KEYS.session, { userId, ts: Date.now() });
}

function getSession() {
  return loadJSON(STORAGE_KEYS.session, null);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getCurrentUser() {
  const sess = getSession();
  if (!sess || !sess.userId) return null;
  return getUserById(sess.userId);
}

// Withdrawals
function getWithdrawals() {
  return loadJSON(STORAGE_KEYS.withdrawals, []);
}

function saveWithdrawals(list) {
  saveJSON(STORAGE_KEYS.withdrawals, list);
}

function addWithdrawal(userId, amountUSD, method, details) {
  const list = getWithdrawals();
  const w = {
    id: 'wd_' + Date.now(),
    userId,
    amountUSD: parseFloat(amountUSD),
    amountIDR: parseFloat(amountUSD) * getGlobal().exchangeRate,
    method,
    details,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  list.unshift(w);
  saveWithdrawals(list);
  return w;
}

function getUserWithdrawals(userId) {
  return getWithdrawals().filter(w => w.userId === userId);
}

// Utils
function formatUSD(n) {
  return '$' + (Number(n) || 0).toFixed(4);
}

function formatIDR(n) {
  return 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');
}

function toIDR(usd) {
  return (Number(usd) || 0) * getGlobal().exchangeRate;
}
