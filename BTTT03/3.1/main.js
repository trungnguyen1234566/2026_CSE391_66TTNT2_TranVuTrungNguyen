console.log("Hello from JavaScript!");

let name = "Trần Vũ Trung Nguyên";
let yearOfBirth = 2006;
let currentYear = 2026;
let age = currentYear - yearOfBirth;

console.log("Xin chào, mình là " + name + ", năm nay mình " + age + " tuổi.");

// TODO: Đổi giá trị score và quan sát kết quả
let score = 6;

// TODO: Dự đoán điều kiện if/else đang làm gì, rồi chạy thử
if (score >= 8) {
  console.log("Giỏi");
} else if (score >= 6.5) {
  console.log("Khá");
} else if (score >= 5) {
  console.log("Trung bình");
} else {
  console.log("Yếu");
}

// TODO: Viết hàm tính điểm trung bình 3 môn
function tinhDiemTrungBinh(m1, m2, m3) {
  let avg = (m1 + m2 + m3) / 3;
  return avg;
}   
console.log("Điểm trung bình là: " + tinhDiemTrungBinh(8, 7, 9));

function xepLoai(avg) {
    if (score >= 8) {
      console.log("Giỏi");
    } else if (score >= 6.5) {
      console.log("Khá");
    } else if (score >= 5) {
      console.log("Trung bình");
    } else {
      console.log("Yếu");
    }
}