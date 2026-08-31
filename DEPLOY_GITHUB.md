# Deploy lên GitHub Pages

## Bước 1: Tạo GitHub Repository

1. Đăng nhập vào [GitHub](https://github.com)
2. Click vào **+** → **New repository**
3. Đặt tên repository (ví dụ: `menu-website`)
4. Chọn **Public** hoặc **Private** (Public miễn phí GitHub Pages)
5. **KHÔNG** chọn "Initialize this repository with a README"
6. Click **Create repository**

## Bước 2: Push Code lên GitHub

Sau khi tạo repository, GitHub sẽ hiện hướng dẫn. Chạy các lệnh sau:

```bash
# Thêm remote repository (thay URL bằng URL của repository bạn)
git remote add origin https://github.com/USERNAME/menu-website.git

# Đổi tên branch thành main
git branch -M main

# Push code lên GitHub
git push -u origin main
```

**Thay `USERNAME` bằng username GitHub của bạn và `menu-website` bằng tên repository bạn đã tạo.**

## Bước 3: Kích hoạt GitHub Pages

1. Vào repository trên GitHub
2. Click **Settings** tab
3. Tìm **Pages** ở menu bên trái
4. Trong **Source**, chọn:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **Save**

## Bước 4: Chờ Deploy

- GitHub sẽ tự động deploy website
- Sau 1-2 phút, sẽ thấy link ở phần **Pages**: 
  ```
  https://USERNAME.github.io/menu-website/
  ```

## Bước 5: Test Website

Mở link GitHub Pages để test website. Website sẽ hoạt động giống như local.

---

## Cập nhật Website sau này

Khi bạn thay đổi code hoặc thêm menu mới:

```bash
# Add file thay đổi
git add .

# Commit thay đổi
git commit -m "Mô tả thay đổi"

# Push lên GitHub
git push
```

GitHub Pages sẽ tự động deploy lại trong 1-2 phút.

---

## Lưu ý quan trọng

- **Thư mục pdf/** sẽ không được upload (đã thêm vào .gitignore)
- Để thêm menu mới: 
  1. Copy PDF vào thư mục `pdf/`
  2. Chạy `python tools/convert_pdf.py`
  3. Commit và push code mới
- GitHub Pages miễn phí cho public repositories
- Không cần backend hay database
- Hoạt động tốt trên server chỉ có 2GB RAM

---

## Custom Domain (Tùy chọn)

Nếu muốn dùng domain riêng:

1. Mua domain (ví dụ từ Namecheap, GoDaddy)
2. Trong GitHub Pages Settings → Pages → Custom domain
3. Add domain của bạn
4. Cập nhật DNS records theo hướng dẫn GitHub

---

## Troubleshooting

**Website không hiển thị:**
- Kiểm tra GitHub Pages settings có đang deploy đúng branch
- Chờ 2-3 phút cho deployment hoàn tất
- Kiểm tra file `index.html` có ở root directory không

**Ảnh không load:**
- Kiểm tra đường dẫn trong `menus.json` có đúng không
- Đảm bảo file ảnh có trong repository
- Kiểm tra tên file có đúng (case-sensitive)

**CORS error khi mở trực tiếp file:**
- Luôn mở qua GitHub Pages URL, không mở file `index.html` trực tiếp
- GitHub Pages cung cấp HTTP server cần thiết
