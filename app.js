// app.js - shared UI, auth and mining engine
function requireAuth(){ if(!window.RD)return; const user=RD.getCurrentUser(); if(!user){location.href='index.html';return null;} return user; }
function logout(){RD.clearSession();location.href='index.html';}
function showToast(msg,type=''){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}t.textContent=msg;t.className=`toast show ${type}`;setTimeout(()=>t.classList.remove('show'),3000);}
function formatUSD(n){return '$'+Number(n||0).toFixed(4)}
function formatIDR(n){return 'Rp '+Math.round(n||0).toLocaleString('id-ID')}
function setActiveNav(page){document.querySelectorAll('.nav-item').forEach(e=>e.classList.toggle('active',e.dataset.page===page))}
function updateHeaderUser(user){const e=document.getElementById('header-user');if(e)e.innerHTML=`<div class="avatar">${user.username.charAt(0).toUpperCase()}</div><span>${user.username}</span>`}
const Mining={
 interval:null,
 start(user,onEarn){
   this.stop();
   const tick=()=>{
     const current=RD.getCurrentUser(), cfg=RD.getConfig();
     if(!current || !cfg.serverOnline)return;
     const server=cfg.servers.find(s=>s.id===current.serverId);
     if(!server || server.status==='offline')return;
     const amount=+(Number(server.rate||0)*0.85+Number(server.rate||0)*Math.random()*0.3).toFixed(4);
     const newUSD=+(Number(current.balanceUSD||0)+amount).toFixed(4);
     RD.getUsdIdrRate().then(rate=>{
       const updated=RD.updateUser(current.username,{balanceUSD:newUSD,balanceIDR:+(newUSD*rate).toFixed(0),lastMine:new Date().toISOString(),lastSeen:new Date().toISOString(),mining:true});
       if(updated&&onEarn)onEarn(amount,updated.balanceUSD,updated.balanceIDR,server);
     });
   };
   tick(); this.interval=setInterval(tick,Math.max(1,Number(RD.getConfig().servers.find(s=>s.id===user.serverId)?.interval||5))*1000);
 },
 stop(){if(this.interval){clearInterval(this.interval);this.interval=null;}}
};
window.App={requireAuth,logout,showToast,formatUSD,formatIDR,setActiveNav,updateHeaderUser,Mining};
