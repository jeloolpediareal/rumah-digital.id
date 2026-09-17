// admin.js - frontend demo admin console
const ADMIN_USER='admin';
const ADMIN_PASS='Admin@2026';
const ADMIN_SESSION='rd_admin_session_v1';

document.addEventListener('DOMContentLoaded',()=>{
 const overlay=document.getElementById('login-overlay'),panel=document.getElementById('panel');
 const showPanel=()=>{overlay.classList.add('hidden');panel.classList.remove('hidden');render();};
 if(sessionStorage.getItem(ADMIN_SESSION)==='1')showPanel();
 document.getElementById('admin-login').onsubmit=e=>{
   e.preventDefault();
   const u=document.getElementById('admin-user').value.trim(),p=document.getElementById('admin-pass').value;
   if(u===ADMIN_USER&&p===ADMIN_PASS){sessionStorage.setItem(ADMIN_SESSION,'1');showPanel()}
   else {const a=document.getElementById('admin-alert');a.textContent='Username atau password admin salah';a.className='alert alert-error show'}
 };
 document.getElementById('admin-logout').onclick=()=>{sessionStorage.removeItem(ADMIN_SESSION);location.reload()};
 document.getElementById('global-toggle').onclick=()=>{
   const c=RD.getConfig();c.serverOnline=!c.serverOnline;c.servers.forEach(s=>{if(s.status!=='maintenance')s.status=c.serverOnline?'online':'offline'});RD.saveConfig(c);render();
 };
 document.getElementById('add-server').onsubmit=e=>{
   e.preventDefault();const c=RD.getConfig();
   c.servers.push({id:'server-'+Date.now(),name:document.getElementById('server-name').value.trim(),rate:Number(document.getElementById('server-rate').value),interval:Number(document.getElementById('server-interval').value),status:c.serverOnline?'online':'offline'});
   RD.saveConfig(c);e.target.reset();document.getElementById('server-interval').value=5;render();
 };
 function render(){
   const c=RD.getConfig(),users=RD.getUsers(),active=users.filter(u=>u.mining&&u.lastSeen&&Date.now()-new Date(u.lastSeen).getTime()<15000);
   document.getElementById('total-users').textContent=users.length;
   document.getElementById('online-users').textContent=active.length;
   document.getElementById('mining-users').textContent=users.filter(u=>u.mining).length;
   document.getElementById('server-count').textContent=c.servers.filter(s=>s.status==='online'&&c.serverOnline).length;
   document.getElementById('global-status').innerHTML=c.serverOnline?' Semua sistem dapat menerima mining':' Server mining ditutup';
   const gt=document.getElementById('global-toggle');gt.textContent=c.serverOnline?' Close Server':' Online Server';gt.className='mini '+(c.serverOnline?'danger':'good');
   document.getElementById('server-list').innerHTML=c.servers.map(s=>`<div class="server-row"><div class="server-meta"><strong>️ ${esc(s.name)}</strong><span>$${Number(s.rate).toFixed(4)} / ${s.interval}s • ${s.status}</span></div><div class="actions"><button class="mini" data-edit="${s.id}">️ Edit</button><button class="mini danger" data-del="${s.id}">Hapus</button></div></div>`).join('');
   document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const cfg=RD.getConfig();if(cfg.servers.length<=1)return alert('Minimal 1 server tersisa.');cfg.servers=cfg.servers.filter(s=>s.id!==b.dataset.del);RD.saveConfig(cfg);render()});
   document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editServer(b.dataset.edit));
   document.getElementById('users-body').innerHTML=users.length?users.map(u=>{const live=u.mining&&u.lastSeen&&Date.now()-new Date(u.lastSeen).getTime()<15000;return `<tr><td> ${esc(u.username)}</td><td>${esc(u.serverName||'-')}</td><td>${live?' Online':' Offline'}</td><td>${App.formatUSD(u.balanceUSD)}</td></tr>`}).join(''):'<tr><td colspan="4">Belum ada pengguna.</td></tr>';
 }
 function editServer(id){
   const c=RD.getConfig(),s=c.servers.find(x=>x.id===id);if(!s)return;
   const name=prompt('Nama server:',s.name);if(name===null)return;
   const rate=prompt('Dollar per tick/detik:',s.rate);if(rate===null)return;
   const interval=prompt('Interval detik:',s.interval);if(interval===null)return;
   s.name=name.trim()||s.name;s.rate=Math.max(0,Number(rate)||0);s.interval=Math.max(1,Number(interval)||5);RD.saveConfig(c);render();
 }
 function esc(v){return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
 setInterval(()=>{if(!panel.classList.contains('hidden'))render()},3000);
});
