// auth.js - Login & Register logic

document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (window.RD && RD.getCurrentUser()) {
    window.location.href = 'dashboard.html';
    return;
  }

  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const alertBox = document.getElementById('alert');

  function showAlert(msg, type = 'error') {
    alertBox.textContent = msg;
    alertBox.className = `alert alert-${type} show`;
    setTimeout(() => alertBox.classList.remove('show'), 4000);
  }

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
    alertBox.classList.remove('show');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
    alertBox.classList.remove('show');
  });

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;
    if (!username || !password) {
      showAlert('Isi username dan password');
      return;
    }
    const res = RD.loginUser(username, password);
    if (res.success) {
      showAlert('Login berhasil! Mengalihkan...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 600);
    } else {
      showAlert(res.message);
    }
  });

  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-user').value.trim();
    const password = document.getElementById('reg-pass').value;
    const confirm = document.getElementById('reg-confirm').value;
    if (!username || !password) {
      showAlert('Isi semua field');
      return;
    }
    if (password !== confirm) {
      showAlert('Password tidak cocok');
      return;
    }
    const res = RD.createUser(username, password);
    if (res.success) {
      RD.setSession(username);
      showAlert('Registrasi berhasil! Mengalihkan...', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 600);
    } else {
      showAlert(res.message);
    }
  });
});
