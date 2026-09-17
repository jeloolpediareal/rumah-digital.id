// auth.js - login/register
document.addEventListener('DOMContentLoaded',()=>{
  if(RD.getCurrentUser()){location.href='dashboard.html';return;}
  const tabLogin=document.getElementById('tab-login'),tabRegister=document.getElementById('tab-register');
  const login=document.getElementById('form-login'),register=document.getElementById('form-register'),alertBox=document.getElementById('alert');
  const serverSelect=document.getElementById('reg-server');
  function alert(msg,type='error'){alertBox.textContent=msg;alertBox.className=`alert alert-${type} show`;setTimeout(()=>alertBox.classList.remove('show'),4000)}
  function renderServers(){const c=RD.getConfig();serverSelect.innerHTML=c.servers.filter(s=>s.status!=='offline').map(s=>`<option value="${s.id}"> ${s.name} — $${Number(s.rate).toFixed(4)} / ${s.interval}s</option>`).join('');if(!serverSelect.innerHTML)serverSelect.innerHTML='<option value=""> Tidak ada server online</option>'}
  renderServers();
  tabLogin.onclick=()=>{tabLogin.classList.add('active');tabRegister.classList.remove('active');login.classList.remove('hidden');register.classList.add('hidden');alertBox.classList.remove('show')};
  tabRegister.onclick=()=>{tabRegister.classList.add('active');tabLogin.classList.remove('active');register.classList.remove('hidden');login.classList.add('hidden');alertBox.classList.remove('show');renderServers()};
  login.onsubmit=e=>{e.preventDefault();const res=RD.loginUser(document.getElementById('login-user').value.trim(),document.getElementById('login-pass').value);if(res.success){alert('Login berhasil! ','success');setTimeout(()=>location.href='dashboard.html',500)}else alert(res.message)};
  register.onsubmit=e=>{e.preventDefault();const u=document.getElementById('reg-user').value.trim(),p=document.getElementById('reg-pass').value,c=document.getElementById('reg-confirm').value,s=serverSelect.value;if(p!==c)return alert('Password tidak cocok');const res=RD.createUser(u,p,s);if(res.success){RD.setSession(u);alert('Akun berhasil dibuat! ️','success');setTimeout(()=>location.href='dashboard.html',500)}else alert(res.message)};
});
