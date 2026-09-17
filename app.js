// app.js - Shared app logic (auth guard, toast, nav highlight, logout)

function requireAuth() {
  if (!window.RD) return;
  const user = RD.getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function logout() {
  RD.clearSession();
  window.location.href = 'index.html';
}

function showToast(msg, type = '') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatUSD(n) {
  return '$' + Number(n).toFixed(4);
}

function formatIDR(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

function updateHeaderUser(user) {
  const el = document.getElementById('header-user');
  if (el) {
    const initial = user.username.charAt(0).toUpperCase();
    el.innerHTML = `
      <div class="avatar">${initial}</div>
      <span>${user.username}</span>
    `;
  }
}

// Mining engine (shared)
const Mining = {
  interval: null,
  rate: 0.07, // base per tick
  start(user, onEarn) {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      const current = RD.getCurrentUser();
      if (!current) return;
      // slight random variation
      const amount = +(this.rate * (0.85 + Math.random() * 0.3)).toFixed(4);
      const newUSD = +(current.balanceUSD + amount).toFixed(4);
      // update IDR based on cached rate
      RD.getUsdIdrRate().then(rate => {
        const newIDR = +(newUSD * rate).toFixed(0);
        RD.updateUser(current.username, {
          balanceUSD: newUSD,
          balanceIDR: newIDR,
          lastMine: new Date().toISOString()
        });
        if (onEarn) onEarn(amount, newUSD, newIDR);
      });
    }, 5000);
  },
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};

window.App = {
  requireAuth,
  logout,
  showToast,
  formatUSD,
  formatIDR,
  setActiveNav,
  updateHeaderUser,
  Mining
};
