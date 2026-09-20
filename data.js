/**
 * Rumah Digital - Data Layer
 * Persistent storage using localStorage
 */

const STORAGE_KEYS = {
  users: 'rd_users',
  currentUser: 'rd_current_user',
  serverStatus: 'rd_server_status',
  servers: 'rd_servers',
  withdrawals: 'rd_withdrawals',
  settings: 'rd_settings'
};

const DEFAULT_SERVERS = [
  { id: 'srv1', name: 'Alpha Miner', rate: 0.03, active: true },
  { id: 'srv2', name: 'Beta Node', rate: 0.05, active: true },
  { id: 'srv3', name: 'Gamma Farm', rate: 0.08, active: true }
];

const DEFAULT_SETTINGS = {
  usdToIdr: 17800,
  unlockThreshold: 10,
  unlockFeeUsd: 5,
  miningIntervalMs: 5000
};

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (!id) return null;
    const users = getUsers();
    return users.find(u => u.id === id) || null;
  } catch {
    return null;
  }
}

function setCurrentUser(userId) {
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.currentUser, userId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }
}

function updateUser(updated) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
    saveUsers(users);
  }
}

function getServerStatus() {
  const s = localStorage.getItem(STORAGE_KEYS.serverStatus);
  return s === null ? true : s === 'true';
}

function setServerStatus(online) {
  localStorage.setItem(STORAGE_KEYS.serverStatus, online ? 'true' : 'false');
}

function getServers() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.servers);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.servers, JSON.stringify(DEFAULT_SERVERS));
      return DEFAULT_SERVERS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_SERVERS;
  }
}

function saveServers(servers) {
  localStorage.setItem(STORAGE_KEYS.servers, JSON.stringify(servers));
}

function getSettings() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.settings);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(DEFAULT_SETTINGS));
      return { ...DEFAULT_SETTINGS };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function getWithdrawals(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.withdrawals) || '{}');
    return all[userId] || [];
  } catch {
    return [];
  }
}

function addWithdrawal(userId, record) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.withdrawals) || '{}');
    if (!all[userId]) all[userId] = [];
    all[userId].unshift(record);
    localStorage.setItem(STORAGE_KEYS.withdrawals, JSON.stringify(all));
  } catch (e) {
    console.error(e);
  }
}

function generateId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatUsd(amount) {
  return '$' + Number(amount).toFixed(4);
}

function formatIdr(usd, rate) {
  const idr = Math.round(usd * rate);
  return 'Rp ' + idr.toLocaleString('id-ID');
}

function registerUser(username, password, serverId) {
  const users = getUsers();
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, message: 'Username sudah digunakan' };
  }
  if (username.length < 3) {
    return { success: false, message: 'Username minimal 3 karakter' };
  }
  if (password.length < 4) {
    return { success: false, message: 'Password minimal 4 karakter' };
  }
  const servers = getServers();
  const server = servers.find(s => s.id === serverId);
  if (!server) {
    return { success: false, message: 'Server tidak valid' };
  }
  const user = {
    id: generateId(),
    username,
    password,
    balance: 0,
    serverId,
    unlocked: false,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    isMining: false
  };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user.id);
  return { success: true, user };
}

function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  if (!user) {
    return { success: false, message: 'Username atau password salah' };
  }
  user.lastActive = new Date().toISOString();
  updateUser(user);
  setCurrentUser(user.id);
  return { success: true, user };
}

function logout() {
  setCurrentUser(null);
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function requireAdmin() {
  // Admin uses separate session
  const isAdmin = sessionStorage.getItem('rd_admin') === 'true';
  if (!isAdmin) {
    window.location.href = 'admin.html';
    return false;
  }
  return true;
}
