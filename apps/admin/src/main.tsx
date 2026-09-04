import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      basename 要去掉結尾斜線。BASE_URL 是 vite.config.ts 的 `/admin/`，直接餵給
      BrowserRouter 的話，React Router 的 stripBasename 會拿 `'/admin'.startsWith('/admin/')`
      去比 —— 結果是 false，Router 直接 render null，畫面**整片空白**（不是 404，
      因為 HTML 與 JS 都正常載入了，只有路由比不中）。
      去掉斜線後 `/admin` 與 `/admin/` 兩種寫法都吃得到。
    */}
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
