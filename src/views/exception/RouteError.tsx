import { Button, Result } from 'antd'
import { useRouteError } from 'react-router-dom'

/**
 * 路由级错误兜底（等价于 vue-router 的 onError + ErrorBoundary）
 * 覆盖懒加载 chunk 加载失败（网络异常/版本更新后旧 chunk 404）等渲染期错误，
 * 避免白屏；挂在根路由的 errorElement 上，子路由抛错时由最近一级接管
 */
export default function RouteError() {
  const error = useRouteError()
  console.error('[router] 路由渲染错误:', error)
  return (
    <Result
      status="error"
      title="页面加载失败"
      subTitle="页面资源加载或渲染时发生错误，请尝试刷新页面。"
      extra={
        // 使用 BASE_URL 而非 '/'：VITE_PUBLIC_PATH 非根路径部署时不会跳出应用；
        // 保留整页刷新语义，可顺带恢复因旧 chunk 失效导致的加载错误
        <Button type="primary" href={import.meta.env.BASE_URL}>
          返回首页
        </Button>
      }
    />
  )
}
