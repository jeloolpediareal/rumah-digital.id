// app.js - Shared app logic

function requireAuth() {
  if (!window.RD) return null;
  const user = RD.getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

function logout() {
  const user = RD.getCurrentUser();
  if (user) RD.updateUser(user.username, { isMining: false });
  RD.clearSession();
  window.location.href = 'index.html';
}

function showToast(msg, type) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast show ' + (type || '');
  setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

function formatUSD(n) {
  return '$' + Number(n).toFixed(4);
}

function formatIDR(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

function updateHeaderUser(user) {
  var el = document.getElementById('header-user');
  if (el) {
    var initial = user.username.charAt(0).toUpperCase();
    el.innerHTML = '<div class="avatar">' + initial + '</div><span>' + user.username + '</span>';
  }
}

var Mining = {
  interval: null,
  start: function(user, onEarn) {
    if (this.interval) clearInterval(this.interval);
    var self = this;
    this.interval = setInterval(function() {
      var status = RD.getServerStatus();
      if (status !== 'online') return;

      var current = RD.getCurrentUser();
      if (!current) return;

      var servers = RD.getServers();
      var srv = servers.find(function(s) { return s.id === current.serverId; }) || servers[0];
      if (!srv || !srv.active) return;

      var amount = +(srv.rate * (0.9 + Math.random() * 0.2)).toFixed(4);
      var newUSD = +(current.balanceUSD + amount).toFixed(4);

      RD.getUsdIdrRate().then(function(rate) {
        var newIDR = +(newUSD * rate).toFixed(0);
        RD.updateUser(current.username, {
          balanceUSD: newUSD,
          balanceIDR: newIDR,
          isMining: true,
          lastActive: new Date().toISOString()
        });
        if (onEarn) onEarn(amount, newUSD, newIDR, srv);
      });
    }, 5000);
  },
  stop: function() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};

window.App = {
  requireAuth: requireAuth,
  logout: logout,
  showToast: showToast,
  formatUSD: formatUSD,
  formatIDR: formatIDR,
  setActiveNav: setActiveNav,
  updateHeaderUser: updateHeaderUser,
  Mining: Mining
};
