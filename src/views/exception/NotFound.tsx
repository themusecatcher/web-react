import { Button, Result } from 'antd'

export default function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        // 与 RouteError 保持一致：使用 BASE_URL，兼容 VITE_PUBLIC_PATH 非根路径部署
        <Button type="primary" href={import.meta.env.BASE_URL}>
          Back Home
        </Button>
      }
    />
  )
}
