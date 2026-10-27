import { useEffect } from 'react'
import { App as AntdApp, ConfigProvider } from 'antd'
import { RouterProvider } from 'react-router-dom'
import router from './router'

// antd 主题配置
const theme = {
  token: {
    colorPrimary: '#ff6900'
  }
}

function AppContent() {
  // 通过 antd App 组件获取 message 实例，挂载到 window 供非组件上下文（如 axios 拦截器）调用
  const { message } = AntdApp.useApp()

  useEffect(() => {
    window.$message = message
    return () => {
      delete window.$message
    }
  }, [message])

  return <RouterProvider router={router} />
}

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntdApp>
        <AppContent />
      </AntdApp>
    </ConfigProvider>
  )
}
