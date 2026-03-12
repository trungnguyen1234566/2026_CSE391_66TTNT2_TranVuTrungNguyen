/* ===== Dữ liệu ===== */
const students = [];
 
/* ===== Xếp loại theo điểm ===== */
function getRank(score) {
  if (score >= 8.5) return { label: 'Giỏi',       cls: 'badge-gioi' };
  if (score >= 7.0) return { label: 'Khá',         cls: 'badge-kha'  };
  if (score >= 5.0) return { label: 'Trung bình',  cls: 'badge-tb'   };
  return               { label: 'Yếu',         cls: 'badge-yeu'  };
}
 
/* ===== Vẽ lại toàn bộ bảng ===== */
function renderTable() {
  const tbody = document.getElementById('tbody');
 
  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Chưa có sinh viên nào</td></tr>';
  } else {
    tbody.innerHTML = students.map((s, i) => {
      const rank = getRank(s.score);
      const weakClass = s.score < 5 ? 'row-weak' : '';
      return `
        <tr class="${weakClass}">
          <td>${i + 1}</td>
          <td>${s.name}</td>
          <td class="col-center">${s.score.toFixed(1)}</td>
          <td class="col-center">
            <span class="badge ${rank.cls}">${rank.label}</span>
          </td>
          <td class="col-action">
            <button class="btn-del" data-index="${i}">Xóa</button>
          </td>
        </tr>`;
    }).join('');
  }
 
  updateStats();
}
 
/* ===== Cập nhật thống kê ===== */
function updateStats() {
  const count = students.length;
  const avg = count
    ? (students.reduce((sum, s) => sum + s.score, 0) / count)
    : null;
 
  document.getElementById('st-count').textContent = count;
  document.getElementById('st-avg').textContent =
    avg !== null ? avg.toFixed(2) : '—';
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
  renderTable();
 
  nameEl.value  = '';
  scoreEl.value = '';
  nameEl.focus();
}
 
/* ===== Xóa sinh viên (Event Delegation) ===== */
document.getElementById('tbody').addEventListener('click', function (e) {
  const btn = e.target.closest('.btn-del');
  if (!btn) return;
 
  const index = parseInt(btn.dataset.index, 10);
  students.splice(index, 1);
  renderTable();
});
 
/* ===== Nút Thêm ===== */
document.getElementById('btn-add').addEventListener('click', addStudent);
 
/* ===== Nhấn Enter ở ô Điểm để thêm ===== */
document.getElementById('inp-score').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addStudent();
});
 
/* ===== Khởi tạo ===== */
renderTable();