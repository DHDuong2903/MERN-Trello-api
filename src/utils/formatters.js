// Ham chuyen doi tu String sang dang Slug
export const slugify = (val) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // Tách các ký tự có dấu thành 2 phần riêng biệt: ký tự gốc và dấu
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu bằng cách xóa các ký tự thuộc khoảng Unicode \u0300-\u036f (các dấu phụ như ́, ̀, ̃...).
    .trim() // Xóa khoảng trắng đầu và cuối chuỗi.
    .toLowerCase() // Chuyển tất cả chữ cái thành chữ thường.
    .replace(/[^a-z0-9 -]/g, '') // Loại bỏ tất cả ký tự không phải chữ cái (a-z), số (0-9), dấu cách ( ) hoặc dấu gạch ngang (-).
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu -
    .replace(/-+/g, '-') // Loại bỏ các dấu - liên tiếp, chỉ giữ lại một dấu - duy nhất
}