/* ===== Dữ liệu gốc ===== */
const students = [];

/* ===== Trạng thái bộ lọc & sắp xếp ===== */
let sortDir = null; // null | 'asc' | 'desc'

/* ===== Xếp loại theo điểm ===== */
function getRank(score) {
  if (score >= 8.5) return { label: 'Giỏi',      cls: 'badge-gioi' };
  if (score >= 7.0) return { label: 'Khá',        cls: 'badge-kha'  };
  if (score >= 5.0) return { label: 'Trung bình', cls: 'badge-tb'   };
  return               { label: 'Yếu',        cls: 'badge-yeu'  };
}

/* ===== Áp dụng bộ lọc + tìm kiếm + sắp xếp ===== */
function applyFilters() {
  const keyword  = document.getElementById('inp-search').value.trim().toLowerCase();
  const rankFilter = document.getElementById('sel-rank').value;

  let result = students.slice(); // bản sao mảng gốc

  // 1. Tìm kiếm theo tên
  if (keyword) {
    result = result.filter(s => s.name.toLowerCase().includes(keyword));
  }

  // 2. Lọc theo xếp loại
  if (rankFilter) {
    result = result.filter(s => getRank(s.score).label === rankFilter);
  }

  // 3. Sắp xếp theo điểm
  if (sortDir === 'asc') {
    result.sort((a, b) => a.score - b.score);
  } else if (sortDir === 'desc') {
    result.sort((a, b) => b.score - a.score);
  }

  renderTable(result);
}

/* ===== Vẽ bảng từ mảng đã lọc ===== */
function renderTable(filtered) {
  const tbody = document.getElementById('tbody');

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Chưa có sinh viên nào</td></tr>';
  } else if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Không có kết quả</td></tr>';
  } else {
    tbody.innerHTML = filtered.map((s, i) => {
      const rank = getRank(s.score);
      const weakClass = s.score < 5 ? 'row-weak' : '';
      // data-name dùng để xóa đúng phần tử trong mảng gốc
      return `
        <tr class="${weakClass}">
          <td>${i + 1}</td>
          <td>${s.name}</td>
          <td class="col-center">${s.score.toFixed(1)}</td>
          <td class="col-center">
            <span class="badge ${rank.cls}">${rank.label}</span>
          </td>
          <td class="col-action">
            <button class="btn-del" data-name="${s.name}" data-score="${s.score}">Xóa</button>
          </td>
        </tr>`;
    }).join('');
  }

  updateStats(filtered);
}

/* ===== Cập nhật thống kê ===== */
function updateStats(filtered) {
  const total = students.length;
  const shown = filtered ? filtered.length : 0;
  const avg = total
    ? (students.reduce((sum, s) => sum + s.score, 0) / total)
    : null;

  document.getElementById('st-count').textContent = total;
  document.getElementById('st-shown').textContent = shown;
  document.getElementById('st-avg').textContent =
    avg !== null ? avg.toFixed(2) : '—';
}

/* ===== Cập nhật mũi tên sắp xếp ===== */
function updateSortArrow() {
  const arrow = document.getElementById('sort-arrow');
  if (sortDir === 'asc')  arrow.textContent = '▲';
  else if (sortDir === 'desc') arrow.textContent = '▼';
  else arrow.textContent = '';
}

/* ===== Thêm sinh viên ===== */
function addStudent() {
  const nameEl  = document.getElementById('inp-name');
  const scoreEl = document.getElementById('inp-score');

  const name     = nameEl.value.trim();
  const scoreRaw = scoreEl.value.trim();
  const score    = parseFloat(scoreRaw);

  if (!name) {
    alert('Vui lòng nhập họ và tên!');
    nameEl.focus();
    return;
  }

  if (scoreRaw === '' || isNaN(score) || score < 0 || score > 10) {
    alert('Điểm phải là số hợp lệ từ 0 đến 10!');
    scoreEl.focus();
    return;
  }

  students.push({ name, score });
  applyFilters();

  nameEl.value  = '';
  scoreEl.value = '';
  nameEl.focus();
}

/* ===== Xóa sinh viên (Event Delegation) ===== */
document.getElementById('tbody').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-del');
  if (!btn) return;

  // Tìm đúng phần tử trong mảng gốc bằng name + score
  const name  = btn.dataset.name;
  const score = parseFloat(btn.dataset.score);
  const idx   = students.findIndex(s => s.name === name && s.score === score);
  if (idx !== -1) students.splice(idx, 1);

  applyFilters();
});

/* ===== Tìm kiếm realtime ===== */
document.getElementById('inp-search').addEventListener('input', applyFilters);

/* ===== Lọc theo xếp loại ===== */
document.getElementById('sel-rank').addEventListener('change', applyFilters);

/* ===== Sắp xếp theo cột Điểm ===== */
document.getElementById('th-score').addEventListener('click', function () {
  if (sortDir === null || sortDir === 'desc') sortDir = 'asc';
  else sortDir = 'desc';

  updateSortArrow();
  applyFilters();
});

/* ===== Nút Thêm ===== */
document.getElementById('btn-add').addEventListener('click', addStudent);

/* ===== Nhấn Enter ở ô Điểm để thêm ===== */
document.getElementById('inp-score').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addStudent();
});

/* ===== Khởi tạo ===== */
applyFilters();