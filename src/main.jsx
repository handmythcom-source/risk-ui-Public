import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import App from './App'
import 'antd/dist/reset.css'
import './index.css'

const oceanBlue = '#0EA5E9' // 海蓝主色调

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: oceanBlue,
          colorInfo: oceanBlue,
          borderRadius: 6,
          colorTextHeading: '#0b1e2f',
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
)
