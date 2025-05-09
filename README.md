# 💖 Lovia Frontend

Vue 3 前端專案，配合 Vite 開發環境，用於 Lovia 募資平台。包含會員中心、提案者專區、贊助者功能、後台管理等模組。

---

## 📦 環境建置

請先安裝 Node.js 16+  
接著在專案根目錄執行：

```bash
npm install
```

---

## 🚀 開發與建置指令

### 本地開發伺服器（含熱更新）

```bash
npm run dev
```

### 建構正式版本

```bash
npm run build
```

### 靜態程式碼檢查（ESLint）

```bash
npm run lint
```

---

## 🧩 推薦開發工具

- [Visual Studio Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（⚠️ 請停用 Vetur）

---

## 📁 專案結構簡介

```bash
src/
├── views/              # 各功能頁面（會員中心、提問、後台）
│   ├── users/          # 會員相關畫面
│   ├── admin/          # 管理後台畫面
│   ├── questions/      # 我的提問、提問管理
│   └── orders/         # 我的贊助、我的專案
├── layouts/            # 頁面框架：Header、UserLayout、AdminLayout
├── stores/             # Pinia 狀態管理（auth 登入狀態）
├── router/             # Vue Router 設定
└── assets/             # 圖片與樣式資源
```

---

## 📮 API 串接

後端伺服器（請依照實際後端環境修改 baseUrl）：

```js
const baseUrl = 'https://lovia-backend-xl4e.onrender.com'
```

使用 axios 串接並附上 JWT token：

```js
headers: {
  Authorization: `Bearer ${userStore.token}`
}
```

---

## ✅ 功能模組進度（部分示意）

- [x] 會員註冊／登入／登出
- [x] 編輯個人資料／修改密碼
- [x] 會員中心導覽列（依角色顯示）
- [x] 我的贊助 / 我的專案
- [x] 我的提問 / 提問管理（提案者）
- [ ] 圖片上傳／儲存至雲端（進行中）
- [ ] UI／設計稿一致化（進行中）

---

## 🛠️ 設計工具

本專案配合 [Figma 設計稿](https://www.figma.com/) 實作前端介面，風格溫暖、親切，適用於公益與醫療類型募資平台。
