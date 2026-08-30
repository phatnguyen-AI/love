# Love Letter

Một lá thư tỏ tình tương tác, được xây bằng React, TypeScript và Vite. Giao diện ưu tiên điện thoại, có hiệu ứng mở phong bì, các chương lời nhắn và nhạc nền sau thao tác của người đọc.

## Chạy dự án

```bash
npm install
npm run dev
```

Kiểm tra trước khi phát hành:

```bash
npm test
npm run build
```

## Thay nội dung

Chỉnh duy nhất file `src/content.ts` để thay tên, các chương lời nhắn, lời tỏ tình cuối và URL nhạc nền.

### Bật thiệp hồi âm

Trang dùng Formspree để chuyển lời hồi âm về email mà không cần máy chủ riêng:

1. Tạo một form tại [Formspree](https://formspree.io/) và xác minh email nhận.
2. Sao chép form ID (phần cuối của endpoint dạng `https://formspree.io/f/{form-id}`).
3. Điền ID đó vào `loveContent.reply.formId` trong `src/content.ts`.

Khi `formId` còn trống, nút hồi âm sẽ được ẩn để người xem không gặp biểu mẫu chưa hoạt động. Địa chỉ email nhận chỉ được lưu trong Formspree, không đặt trong mã nguồn công khai.

Nhạc được cấu hình là **Từ ngày em đến** từ file `music.mp3`. Vite tự đóng gói file này với đường dẫn phù hợp cho GitHub Pages. Nếu file nhạc lỗi hoặc trình duyệt chặn phát, lá thư vẫn hoạt động mà không cần âm thanh.

## GitHub Pages

Workflow `.github/workflows/deploy.yml` tự build và phát hành khi có commit lên `main`. Trong lần đầu, vào **Settings → Pages → Source** và chọn **GitHub Actions**.

Địa chỉ dự kiến: `https://phatnguyen-ai.github.io/love/`
