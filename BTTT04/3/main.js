

function showError(fieldId, message) {
  const el    = document.getElementById(fieldId + '-error');
  const input = document.getElementById(fieldId);
  if (el)    { el.textContent = message; el.classList.add('visible'); }
  if (input) { input.classList.add('is-error'); }
}

function clearError(fieldId) {
  const el    = document.getElementById(fieldId + '-error');
  const input = document.getElementById(fieldId);
  if (el)    { el.textContent = ''; el.classList.remove('visible'); }
  if (input) { input.classList.remove('is-error'); }
}



function validateFullname() {
  const val = document.getElementById('fullname').value.trim();
  if (!val)          { showError('fullname', 'Họ và tên không được để trống'); return false; }
  if (val.length < 3){ showError('fullname', 'Họ và tên phải có ít nhất 3 ký tự'); return false; }
  if (!/^[\p{L}\s]+$/u.test(val)) {
    showError('fullname', 'Họ và tên chỉ được chứa chữ cái và khoảng trắng');
    return false;
  }
  clearError('fullname');
  return true;
}

function validateEmail() {
  const val = document.getElementById('email').value.trim();
  if (!val) { showError('email', 'Email không được để trống'); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    showError('email', 'Email không đúng định dạng (vd: ten@domain.com)');
    return false;
  }
  clearError('email');
  return true;
}

function validatePhone() {
  const val = document.getElementById('phone').value.trim();
  if (!val) { showError('phone', 'Số điện thoại không được để trống'); return false; }
  if (!/^0\d{9}$/.test(val)) {
    showError('phone', 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0');
    return false;
  }
  clearError('phone');
  return true;
}

function validatePassword() {
  const val = document.getElementById('password').value;
  if (!val)          { showError('password', 'Mật khẩu không được để trống'); return false; }
  if (val.length < 8){ showError('password', 'Mật khẩu phải có ít nhất 8 ký tự'); return false; }
  if (!/[A-Z]/.test(val)) { showError('password', 'Mật khẩu phải có ít nhất 1 chữ hoa'); return false; }
  if (!/[a-z]/.test(val)) { showError('password', 'Mật khẩu phải có ít nhất 1 chữ thường'); return false; }
  if (!/\d/.test(val))    { showError('password', 'Mật khẩu phải có ít nhất 1 chữ số'); return false; }
  clearError('password');
  return true;
}

function validateConfirm() {
  const pw = document.getElementById('password').value;
  const cf = document.getElementById('confirm').value;
  if (!cf)      { showError('confirm', 'Vui lòng xác nhận mật khẩu'); return false; }
  if (cf !== pw){ showError('confirm', 'Mật khẩu xác nhận không khớp'); return false; }
  clearError('confirm');
  return true;
}

function validateGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  if (!checked) { showError('gender', 'Vui lòng chọn giới tính'); return false; }
  clearError('gender');
  return true;
}

function validateTerms() {
  const cb = document.getElementById('terms');
  if (!cb.checked) { showError('terms', 'Bạn phải đồng ý với điều khoản để tiếp tục'); return false; }
  clearError('terms');
  return true;
}



document.getElementById('fullname').addEventListener('blur', validateFullname);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('phone').addEventListener('blur', validatePhone);
document.getElementById('password').addEventListener('blur', validatePassword);
document.getElementById('confirm').addEventListener('blur', validateConfirm);

document.querySelectorAll('input[name="gender"]').forEach(function(radio) {
  radio.addEventListener('change', validateGender);
});

document.getElementById('terms').addEventListener('change', validateTerms);



['fullname', 'email', 'phone', 'password', 'confirm'].forEach(function(id) {
  document.getElementById(id).addEventListener('input', function() {
    clearError(id);
  });
});



document.querySelectorAll('.toggle-pw').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var input   = document.getElementById(btn.dataset.target);
    var isHidden = input.type === 'password';
    input.type  = isHidden ? 'text' : 'password';
    btn.textContent = isHidden ? '🙈' : '👁';
  });
});



document.getElementById('reg-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Dùng & (bitwise AND) — đảm bảo TẤT CẢ hàm đều được gọi, không short-circuit như &&
  var isValid =
    validateFullname() &
    validateEmail()    &
    validatePhone()    &
    validatePassword() &
    validateConfirm()  &
    validateGender()   &
    validateTerms();

  if (!isValid) {
    // Shake button để báo hiệu lỗi
    var btn = document.querySelector('.btn-submit');
    btn.classList.remove('shake');
    void btn.offsetWidth; // trigger reflow để restart animation
    btn.classList.add('shake');
    btn.addEventListener('animationend', function() {
      btn.classList.remove('shake');
    }, { once: true });

    // Scroll đến thông báo lỗi đầu tiên
    var firstError = document.querySelector('.error-msg.visible');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Thành công: ẩn form, hiện màn hình chúc mừng
  var name = document.getElementById('fullname').value.trim();
  document.getElementById('success-name').textContent = name;
  document.getElementById('form-area').style.display = 'none';
  document.getElementById('success-screen').style.display = 'block';
});

/// bài 3333333333333333333333333333333333333333333333333333333
// 1. Toggle hiện/ẩn mật khẩu
document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const shown = input.type === 'text';
        input.type = shown ? 'password' : 'text';
        btn.textContent = shown ? '👁' : '🙈';
    });
});

// 2. Thanh độ mạnh mật khẩu
document.getElementById('password').addEventListener('input', () => {
    const val = document.getElementById('password').value;
    const fill = document.getElementById('strength-fill');
    const label = document.getElementById('strength-label');
    if (!val) { fill.style.width = '0%'; label.textContent = 'Nhập mật khẩu để kiểm tra'; return; }
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    if (score <= 2) { fill.style.width = '33%'; fill.style.backgroundColor = '#E24B4A'; label.textContent = 'Yếu'; }
    else if (score <= 3) { fill.style.width = '66%'; fill.style.backgroundColor = '#EF9F27'; label.textContent = 'Trung bình'; }
    else { fill.style.width = '100%'; fill.style.backgroundColor = '#1D9E75'; label.textContent = 'Mạnh'; }
});

// 3. Đếm ký tự họ tên
document.getElementById('fullname').addEventListener('input', () => {
    const len = document.getElementById('fullname').value.length;
    document.getElementById('char-count').textContent = len + '/50';
});