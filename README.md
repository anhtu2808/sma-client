# Hướng dẫn Setup Project SMA-CLIENT

## 1. Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

- **Node.js**: phiên bản 14.x hoặc cao hơn (khuyến nghị 16.x trở lên)
- **npm**: phiên bản 6.x hoặc cao hơn (đi kèm với Node.js)
- **Git**: để clone repository (nếu cần)

Kiểm tra phiên bản đã cài đặt:
```bash
node --version
npm --version
git --version
```

## 2. Clone hoặc download project

Nếu project chưa có trên máy, clone từ repository:
```bash
git clone <repository-url>
cd sma-client
```

Hoặc nếu đã có source code, di chuyển vào thư mục project:
```bash
cd /Users/anhtu/Documents/Uni/SEMESTER9/Project/sma-client
```

## 3. Cài đặt dependencies

Cài đặt tất cả các package dependencies:
```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các packages được liệt kê trong `package.json`, bao gồm:

**Dependencies chính:**
- `react` (v19.2.3) - React framework
- `react-dom` (v19.2.3) - React DOM rendering
- `react-scripts` (v5.0.1) - Create React App scripts

**Dev Dependencies:**
- `tailwindcss` (v3.4.17) - CSS framework
- `react-app-rewired` - Override CRA config không cần eject
- `babel-plugin-module-resolver` - Module alias resolution
- `customize-cra` - Customize webpack config
- `autoprefixer` & `postcss` - CSS processing

## 4. Cấu trúc project

Project được tổ chức theo cấu trúc sau:

```
sma-client/
├── public/              # Static files
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   ├── App.js          # Main App component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles với Tailwind
├── babel.config.js     # Babel configuration
├── config-overrides.js # React App Rewired config
├── tailwind.config.js  # Tailwind CSS config
└── package.json        # Project dependencies
```

## 5. Hiểu về cấu hình đặc biệt

### Module Aliases
Project sử dụng module resolver để import dễ dàng hơn:

- `@/` → `./src/`
- `@components/` → `./src/components/`
- `@pages/` → `./src/pages/`
- `@utils/` → `./src/utils/`
- `@hooks/` → `./src/hooks/`
- `@services/` → `./src/services/`
- `@store/` → `./src/store/`
- `@assets/` → `./src/assets/`

Ví dụ thay vì:
```javascript
import Button from '../../../components/Button';
```

Bạn có thể viết:
```javascript
import Button from '@components/Button';
```

### React App Rewired
Project sử dụng `react-app-rewired` thay vì `react-scripts` trực tiếp để có thể customize cấu hình webpack mà không cần eject.

### Tailwind CSS
Project đã được cấu hình sẵn Tailwind CSS cho styling.

## 6. Chạy project ở môi trường development

Khởi chạy development server:
```bash
npm start
```

- Development server sẽ chạy tại: `http://localhost:3000`
- Browser sẽ tự động mở
- Hot reload được bật - thay đổi code sẽ tự động refresh
- Lỗi lint và compile sẽ hiển thị trong console

## 7. Build project cho production

Tạo production build:
```bash
npm run build
```

- Build output sẽ được tạo trong folder `build/`
- Files được minified và optimized
- Filenames có hash để cache busting
- Sẵn sàng để deploy

## 8. Chạy tests

Chạy test suite:
```bash
npm test
```

Test runner sẽ chạy ở interactive watch mode.

## 9. Các lệnh thường dùng

| Lệnh | Mô tả |
|------|-------|
| `npm start` | Chạy development server |
| `npm run build` | Build production |
| `npm test` | Chạy tests |
| `npm run eject` | Eject từ CRA (không khuyến nghị) |

## 10. Troubleshooting

### Lỗi khi cài đặt dependencies
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install
```

### Port 3000 đã được sử dụng
Nếu port 3000 bị chiếm:
- Dừng process đang chạy trên port 3000
- Hoặc React sẽ tự động hỏi để chạy trên port khác (3001, 3002,...)

### Module not found errors
Đảm bảo rằng:
- Đã chạy `npm install` đầy đủ
- Path aliases được cấu hình đúng trong `babel.config.js` và `config-overrides.js`
- IDE của bạn đã restart sau khi thay đổi config

### Tailwind classes không hoạt động
- Kiểm tra `tailwind.config.js` có đúng content paths
- Đảm bảo `index.css` có import Tailwind directives
- Restart development server

## 11. Môi trường phát triển khuyến nghị

### Code Editor
- **VS Code** (khuyến nghị)
- Extensions hữu ích:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

### Browser
- Chrome hoặc Firefox với React Developer Tools extension

## 12. Git workflow (nếu làm team)

```bash
# Tạo branch mới cho feature
git checkout -b feature/ten-feature

# Commit changes
git add .
git commit -m "Mô tả thay đổi"

# Push lên remote
git push origin feature/ten-feature

# Tạo Pull Request để review
```

## 13. Environment Variables (nếu cần)

Tạo file `.env.local` trong root directory cho các biến môi trường:
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=development
```

Sử dụng trong code:
```javascript
const apiUrl = process.env.REACT_APP_API_URL;
```

**Lưu ý:** File `.env.local` đã được gitignore, không commit lên repository.

## 14. Next Steps

Sau khi setup xong, bạn có thể:

1. Xem qua cấu trúc code trong `src/`
2. Đọc docs của các thư viện chính:
   - [React Documentation](https://react.dev/)
   - [Tailwind CSS](https://tailwindcss.com/docs)
3. Bắt đầu phát triển features mới
4. Tham khảo conversation history để hiểu các components đã được implement

---
