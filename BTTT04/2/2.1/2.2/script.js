// ── Dữ liệu sản phẩm ──
const prices = {
  'ao-thun':      150000,
  'quan-jean':    350000,
  'giay-sneaker': 850000,
  'tui-xach':     420000,
  'mu-luoi-trai':  95000,
  'ao-khoac':     480000,
};

const productNames = {
  'ao-thun':      'Áo thun',
  'quan-jean':    'Quần jean',
  'giay-sneaker': 'Giày sneaker',
  'tui-xach':     'Túi xách',
  'mu-luoi-trai': 'Mũ lưỡi trai',
  'ao-khoac':     'Áo khoác',
};


const today   = new Date().toISOString().split('T')[0];
const maxD    = new Date();
maxD.setDate(maxD.getDate() + 30);
const maxDate = maxD.toISOString().split('T')[0];

document.getElementById('date').min = today;
document.getElementById('date').max = maxDate;

function $(id) { return document.getElementById(id); }

function fmt(n) {
  return Number(n).toLocaleString('vi-VN') + ' ₫';
}

function setErr(fieldId, msg) {
  const field = $(fieldId);
  field.classList.add('err');
  if (msg) field.querySelector('.err-msg').textContent = msg;
}

function clrErr(fieldId) {
  $(fieldId).classList.remove('err');
}

// ── Tính tổng tiền ──
function updatePrice() {
  const pv  = $('product').value;
  const qty = parseInt($('qty').value);

  if (pv && prices[pv] && qty >= 1 && qty <= 99) {
    $('price-val').textContent = fmt(prices[pv] * qty);
    $('price-box').style.display = 'flex';
  } else {
    $('price-box').style.display = 'none';
  }
}

$('product').addEventListener('change', () => { clrErr('f-product'); updatePrice(); });
$('qty').addEventListener('input',      () => { clrErr('f-qty');     updatePrice(); });

// ── Đếm ký tự ghi chú ──
$('note').addEventListener('input', function () {
  const len = this.value.length;
  const counter = $('char-count');

  counter.textContent = `${len}/200`;
  counter.classList.toggle('over', len > 200);

  if (len > 200) {
    setErr('f-note', 'Ghi chú không quá 200 ký tự');
  } else {
    clrErr('f-note');
  }
});

// ── Xóa lỗi khi người dùng sửa ──
$('date').addEventListener('change', () => clrErr('f-date'));
$('address').addEventListener('input', () => {
  if ($('address').value.trim().length >= 10) clrErr('f-address');
});
document.querySelectorAll('input[name="pay"]').forEach(r => {
  r.addEventListener('change', () => clrErr('f-pay'));
});

// ── Validate toàn bộ form ──
function validateForm() {
  let ok = true;

  // Sản phẩm
  if (!$('product').value) {
    setErr('f-product', 'Vui lòng chọn sản phẩm');
    ok = false;
  }

  // Số lượng
  const qty = parseInt($('qty').value);
  if (!qty || qty < 1 || qty > 99) {
    setErr('f-qty', 'Số lượng phải từ 1 đến 99');
    ok = false;
  }

  // Ngày giao hàng
  const dv = $('date').value;
  if (!dv) {
    setErr('f-date', 'Vui lòng chọn ngày giao hàng');
    ok = false;
  } else if (dv < today) {
    setErr('f-date', 'Không được chọn ngày trong quá khứ');
    ok = false;
  } else if (dv > maxDate) {
    setErr('f-date', 'Ngày giao không quá 30 ngày từ hôm nay');
    ok = false;
  }

  // Địa chỉ
  if ($('address').value.trim().length < 10) {
    setErr('f-address', 'Địa chỉ phải có ít nhất 10 ký tự');
    ok = false;
  }

  // Ghi chú
  if ($('note').value.length > 200) {
    setErr('f-note', 'Ghi chú không quá 200 ký tự');
    ok = false;
  }

  // Thanh toán
  if (!document.querySelector('input[name="pay"]:checked')) {
    setErr('f-pay', 'Vui lòng chọn phương thức thanh toán');
    ok = false;
  }

  return ok;
}

// ── Submit — hiện modal xác nhận ──
$('form').addEventListener('submit', function (e) {
  e.preventDefault();
  $('success').classList.remove('show');

  if (!validateForm()) return;

  const pv      = $('product').value;
  const qty     = parseInt($('qty').value);
  const total   = prices[pv] * qty;
  const pay     = document.querySelector('input[name="pay"]:checked').value;
  const date    = new Date($('date').value).toLocaleDateString('vi-VN');
  const address = $('address').value.trim();
  const note    = $('note').value.trim();

  $('summary').innerHTML = `
    <tr><td>Sản phẩm</td><td>${productNames[pv]}</td></tr>
    <tr><td>Số lượng</td><td>${qty}</td></tr>
    <tr><td>Ngày giao</td><td>${date}</td></tr>
    <tr><td>Địa chỉ</td><td>${address}</td></tr>
    <tr><td>Thanh toán</td><td>${pay}</td></tr>
    ${note ? `<tr><td>Ghi chú</td><td>${note}</td></tr>` : ''}
    <tr class="total"><td>Tổng tiền</td><td>${fmt(total)}</td></tr>
  `;

  $('overlay').classList.add('show');
});

// ── Modal: Hủy ──
$('btn-cancel').addEventListener('click', () => {
  $('overlay').classList.remove('show');
});

// ── Modal: Xác nhận ──
$('btn-confirm').addEventListener('click', () => {
  $('overlay').classList.remove('show');
  $('success').classList.add('show');

  // Reset form
  $('form').reset();
  ['f-product', 'f-qty', 'f-date', 'f-address', 'f-note', 'f-pay'].forEach(clrErr);
  $('price-box').style.display = 'none';
  $('char-count').textContent  = '0/200';
  $('char-count').classList.remove('over');
});

// ── Đóng modal khi click ngoài ──
$('overlay').addEventListener('click', function (e) {
  if (e.target === this) this.classList.remove('show');
});