# Menu Viewing Website

Website tĩnh dùng để hiển thị menu nhà hàng với tối ưu hóa cho mobile và server có ít RAM.

## 🚀 Tính năng

- **Tối ưu mobile-first**: Giao diện được thiết kế ưu tiên trải nghiệm trên điện thoại
- **Lazy loading thông minh**: Tải ảnh khi cần thiết, preload các trang tiếp theo để tránh trạng thái loading
- **Static website**: Không cần backend, database, hay server-side processing
- **Tối ưu tài nguyên server**: Chỉ phục vụ static files, phù hợp server 2GB RAM
- **Responsive**: Hoạt động mượt mà trên mobile, tablet, và desktop
- **Hỗ trợ WebP**: Sử dụng định dạng ảnh WebP để tối ưu dung lượng
- **URL thân thiện**: Dùng query parameter `?id=menu-id` để điều hướng

## 📁 Cấu trúc dự án

```
/
├── index.html              # Trang danh sách menu
├── menu.html               # Trang xem menu chi tiết
├── menus.json              # Dữ liệu menu
├── README.md               # Tài liệu hướng dẫn
│
├── css/
│   └── style.css           # Stylesheet
│
├── js/
│   ├── app.js              # Script trang chính
│   └── menu-viewer.js      # Script xem menu với lazy loading
│
├── images/                 # Ảnh logo, icons (nếu có)
│
├── menus/                  # Thư mục chứa menu images
│   ├── menu-001/
│   │   ├── cover.webp
│   │   ├── 01.webp
│   │   ├── 02.webp
│   │   └── ...
│   ├── menu-002/
│   └── menu-003/
│
└── tools/
    ├── convert_pdf.py      # Script convert PDF sang WebP
    └── create_placeholders.py  # Script tạo ảnh placeholder demo
```

## 🛠️ Cài đặt

### Yêu cầu

- Web server bất kỳ (Nginx, Apache, IIS, hoặc static hosting)
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Không cần backend runtime

### Deploy

1. Copy toàn bộ thư mục dự án lên server
2. Trỏ web server đến thư mục dự án
3. Truy cập `index.html`

**Ví dụ với Nginx:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/menu;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 📖 Cách sử dụng

### Thêm menu mới

#### Cách 1: Sử dụng script convert PDF (Khuyên dùng)

1. **Cài đặt dependencies:**

```bash
pip install pdf2image Pillow
```

*Lưu ý: Trên Linux, có thể cần cài đặt thêm `poppler-utils`:*
```bash
sudo apt-get install poppler-utils
```

2. **Đặt file PDF vào thư mục `pdf/`:**

```bash
mkdir pdf
# Copy PDF files vào thư mục pdf/
```

3. **Chạy script convert:**

```bash
python tools/convert_pdf.py
```

Script sẽ tự động:
- Convert từng trang PDF thành WebP
- Tạo folder menu tương ứng
- Tạo cover.webp từ trang đầu tiên
- Đếm số trang
- Cập nhật menus.json
- Xử lý tên file tiếng Việt

#### Cách 2: Thêm thủ công

1. **Tạo thư mục menu mới:**

```bash
mkdir menus/menu-004
```

2. **Convert PDF sang WebP thủ công:**

Sử dụng công cụ convert PDF sang WebP (Adobe Acrobat, online converter, hoặc script khác) để convert từng trang PDF thành file WebP.

3. **Đặt tên file theo format:**

```
menus/menu-004/
├── cover.webp    # Ảnh bìa (từ trang 1 hoặc ảnh riêng)
├── 01.webp       # Trang 1
├── 02.webp       # Trang 2
├── 03.webp       # Trang 3
└── ...
```

*Lưu ý: Tên file phải có 2 chữ số (01, 02, 03, không phải 1, 2, 3)*

4. **Cập nhật menus.json:**

```json
[
    {
        "id": "menu-001",
        "name": "Menu Hải Sản",
        "cover": "menus/menu-001/cover.webp",
        "pages": 4
    },
    {
        "id": "menu-002",
        "name": "Menu Nhà Hàng",
        "cover": "menus/menu-002/cover.webp",
        "pages": 2
    },
    {
        "id": "menu-003",
        "name": "Menu Đặc Biệt",
        "cover": "menus/menu-003/cover.webp",
        "pages": 2
    },
    {
        "id": "menu-004",
        "name": "Menu Mới",
        "cover": "menus/menu-004/cover.webp",
        "pages": 3
    }
]
```

5. **Refresh website** để thấy menu mới.

### Tạo ảnh placeholder cho demo

Nếu muốn tạo ảnh placeholder để test:

```bash
pip install Pillow
python tools/create_placeholders.py
```

## ⚙️ Cấu hình

### Cấu hình convert PDF

Edit file `tools/convert_pdf.py` để thay đổi:

```python
OUTPUT_WIDTH = 1400  # Chiều rộng ảnh output (pixels)
WEBP_QUALITY = 85    # Chất lượng WebP (0-100)
PDF_DIR = 'pdf'      # Thư mục chứa PDF
MENUS_DIR = 'menus'  # Thư mục output
```

### Cấu hình lazy loading

Edit file `js/menu-viewer.js` để thay đổi:

```javascript
const PRELOAD_COUNT = 3;        // Số trang preload trước
const PRELOAD_THRESHOLD = 0.5;  // Ngưỡng Intersection Observer
```

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu sắc

Edit file `css/style.css`:

```css
/* Header gradient */
.menu-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Card shadow */
.menu-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Thay đổi kích thước container

Edit file `css/style.css`:

```css
.container {
    max-width: 600px; /* Thay đổi kích thước tối đa */
}
```

## 🚀 Tối ưu hiệu suất

### Lazy Loading & Preloading

Website sử dụng cơ chế lazy loading thông minh:

1. **Lazy loading**: Chỉ tải ảnh khi cần thiết
2. **Preload**: Tải trước 2-3 trang tiếp theo khi user scroll
3. **Intersection Observer**: Phát hiện khi trang sắp xuất hiện
4. **Memory cleanup**: Xóa cache ảnh quá xa để tiết kiệm RAM

### Tối ưu ảnh

- Sử dụng WebP thay vì PNG/JPEG
- Chiều rộng ảnh khuyến nghị: 1200-1600px
- Chất lượng WebP: 85 (cân bằng giữa chất lượng và dung lượng)
- Tỷ lệ khung hình A4: 210/297

### Cache

Browser sẽ tự động cache:
- CSS, JS, JSON
- WebP images

Nếu cần invalidate cache, thêm version query:
```
menus/menu-001/01.webp?v=2
```

## 🔒 Security

- Không sử dụng `eval()`
- Xử lý HTML escaping để tránh XSS
- Tên menu từ JSON được xử lý an toàn với `textContent`

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px (1 menu/row)
- **Tablet**: 768px - 1023px (1 menu/row, container rộng hơn)
- **Desktop**: 1024px+ (1 menu/row, container tối đa 600-900px)

## 🐛 Xử lý lỗi

Website có xử lý lỗi cho các trường hợp:

- **Không load được menus.json**: Hiển thị thông báo lỗi
- **Menu không tồn tại**: Hiển thị "Không tìm thấy menu"
- **Ảnh load lỗi**: Hiển thị placeholder lỗi
- **Network error**: Hiển thị thông báo và nút retry

## 📝 License

Dự án này được tạo ra để sử dụng cho mục đích thương mại hoặc cá nhân.

## 🤝 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:

1. Console browser để xem error messages
2. Đảm bảo tất cả file paths đúng
3. Kiểm tra permissions file
4. Verify server config phục vụ static files

## 🎯 Tóm tắt quy trình thêm menu

1. Copy PDF vào thư mục `pdf/`
2. Chạy `python tools/convert_pdf.py`
3. Done! Menu tự động được thêm vào website

Hoặc thủ công:

1. Convert PDF sang WebP
2. Tạo folder trong `menus/`
3. Đặt file theo format (cover.webp, 01.webp, 02.webp...)
4. Cập nhật `menus.json`
5. Refresh website

---

Website được thiết kế để chạy tốt trên server chỉ có 2GB RAM, không cần backend, và tối ưu tuyệt đối cho trải nghiệm mobile.