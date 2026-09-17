// data.js - Rumah Digital local demo data layer
const RD_INITIAL_USERS = [];
const RD_STORAGE_KEY = 'rd_users_v2';
const RD_SESSION_KEY = 'rd_session_v2';
const RD_RATE_KEY = 'rd_usd_idr_rate';
const RD_CONFIG_KEY = 'rd_mining_config_v1';

const RD_DEFAULT_CONFIG = {
  serverOnline: true,
  servers: [
    { id: 'server-01', name: 'Neon Hash #01', rate: 0.0700, interval: 5, status: 'online' },
    { id: 'server-02', name: 'Quantum Mine #02', rate: 0.0950, interval: 5, status: 'online' }
  ]
};

function getUsers() {
  try { const raw = localStorage.getItem(RD_STORAGE_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return [...RD_INITIAL_USERS];
}
function saveUsers(users) { localStorage.setItem(RD_STORAGE_KEY, JSON.stringify(users)); }
function getConfig() {
  try {
    const raw = localStorage.getItem(RD_CONFIG_KEY);
    if (raw) return { ...RD_DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch (e) {}
  return JSON.parse(JSON.stringify(RD_DEFAULT_CONFIG));
}
function saveConfig(config) { localStorage.setItem(RD_CONFIG_KEY, JSON.stringify(config)); }
function getCurrentUser() {
  const session = localStorage.getItem(RD_SESSION_KEY);
  if (!session) return null;
  return getUsers().find(u => u.username === session) || null;
}
function setSession(username) { localStorage.setItem(RD_SESSION_KEY, username); }
function clearSession() { localStorage.removeItem(RD_SESSION_KEY); }
function updateUser(username, updates) {
  const users = getUsers(), idx = users.findIndex(u => u.username === username);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates }; saveUsers(users); return users[idx];
}
function createUser(username, password, serverId) {
  const users = getUsers();
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) return { success:false, message:'Username sudah digunakan' };
  if (username.length < 3) return { success:false, message:'Username minimal 3 karakter' };
  if (password.length < 4) return { success:false, message:'Password minimal 4 karakter' };
  const config = getConfig();
  const server = config.servers.find(s => s.id === serverId && s.status !== 'offline');
  if (!server) return { success:false, message:'Pilih server mining yang tersedia' };
  const newUser = {
    username, password, serverId: server.id, serverName: server.name,
    balanceUSD:0, balanceIDR:0, unlockedWithdraw:false, withdrawHistory:[],
    createdAt:new Date().toISOString(), lastMine:null, mining:false, lastSeen:null
  };
  users.push(newUser); saveUsers(users);
  return { success:true, user:newUser };
}
function loginUser(username,password) {
  const user = getUsers().find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  if (!user) return { success:false,message:'Username atau password salah' };
  setSession(user.username); return { success:true,user };
}
async function getUsdIdrRate() {
  try {
    const cached=localStorage.getItem(RD_RATE_KEY);
    if(cached){const {rate,ts}=JSON.parse(cached);if(Date.now()-ts<3600000)return rate;}
  } catch(e){}
  try {
    const res=await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data=await res.json(), rate=data.rates?.IDR||17688;
    localStorage.setItem(RD_RATE_KEY,JSON.stringify({rate,ts:Date.now()})); return rate;
  } catch(e){return 17688;}
}
window.RD={getUsers,saveUsers,getConfig,saveConfig,getCurrentUser,setSession,clearSession,updateUser,createUser,loginUser,getUsdIdrRate};
