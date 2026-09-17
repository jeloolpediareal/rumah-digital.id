// auth.js - Login & Register

document.addEventListener('DOMContentLoaded', function() {
  if (window.RD && RD.getCurrentUser()) {
    window.location.href = 'dashboard.html';
    return;
  }

  var tabLogin = document.getElementById('tab-login');
  var tabRegister = document.getElementById('tab-register');
  var formLogin = document.getElementById('form-login');
  var formRegister = document.getElementById('form-register');
  var alertBox = document.getElementById('alert');
  var serverSelect = document.getElementById('reg-server');

  // Populate servers
  if (serverSelect) {
    var servers = RD.getServers().filter(function(s) { return s.active; });
    serverSelect.innerHTML = servers.map(function(s) {
      return '<option value="' + s.id + '">' + s.name + ' ($' + s.rate.toFixed(4) + '/tick)</option>';
    }).join('');
  }

  function showAlert(msg, type) {
    alertBox.textContent = msg;
    alertBox.className = 'alert alert-' + (type || 'error') + ' show';
    setTimeout(function() { alertBox.classList.remove('show'); }, 4000);
  }

  tabLogin.addEventListener('click', function() {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    alertBox.classList.remove('show');
  });

  tabRegister.addEventListener('click', function() {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    alertBox.classList.remove('show');
  });

  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('login-user').value.trim();
    var password = document.getElementById('login-pass').value;
    if (!username || !password) {
      showAlert('Isi username dan password');
      return;
    }
    var res = RD.loginUser(username, password);
    if (res.success) {
      showAlert('Login berhasil', 'success');
      setTimeout(function() { window.location.href = 'dashboard.html'; }, 500);
    } else {
      showAlert(res.message);
    }
  });

  formRegister.addEventListener('submit', function(e) {
    e.preventDefault();
    var username = document.getElementById('reg-user').value.trim();
    var password = document.getElementById('reg-pass').value;
    var confirm = document.getElementById('reg-confirm').value;
    var serverId = document.getElementById('reg-server').value;
    if (!username || !password) {
      showAlert('Isi semua field');
      return;
    }
    if (password !== confirm) {
      showAlert('Password tidak cocok');
      return;
    }
    var res = RD.createUser(username, password, serverId);
    if (res.success) {
      RD.setSession(username);
      showAlert('Registrasi berhasil', 'success');
      setTimeout(function() { window.location.href = 'dashboard.html'; }, 500);
    } else {
      showAlert(res.message);
    }
  });
});
