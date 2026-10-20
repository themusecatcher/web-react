/* eslint-disable react-refresh/only-export-components */
// 本文件为路由配置（非组件文件），导出 routes 与 router 供应用启动使用，不适用 React Fast Refresh 规则
import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Flex, Spin } from 'antd'
import GlobalLayout from '@/layouts/GlobalLayout'
import HomeView from '@/views/HomeView'
import RouteError from '@/views/exception/RouteError'

// route level code-splitting：懒加载 404 页面，访问时才会加载对应的 chunk
const NotFoundView = lazy(() => import('@/views/exception/NotFound'))

// 懒加载 chunk 期间的加载态，避免 fallback={null} 造成白屏
const RouteFallback = (
  <Flex style={{ height: '100vh' }} align="center" justify="center">
    <Spin />
  </Flex>
)

export const routes = [
  {
    element: <GlobalLayout />,
    // 渲染期错误（如懒加载 chunk 加载失败）的兜底页面
    errorElement: <RouteError />,
    children: [
      {
        path: '/',
        element: <HomeView />,
        handle: { title: '首页' }
      },
      // {
      //   path: '/about',
      //   element: <GlobalLayout />,
      //   handle: { title: '关于我们' },
      //   children: [
      //     {
      //       path: '/about/us',
      //       element: <AboutView />,
      //       handle: { title: '关于我们' }
      //     }
      //   ]
      // },
      {
        path: '*',
        // 捕获所有未匹配路由，渲染 404 页面
        element: (
          <Suspense fallback={RouteFallback}>
            <NotFoundView />
          </Suspense>
        ),
        handle: { title: 'NotFound' }
      }
    ]
  }
]

const router = createBrowserRouter(routes, {
  /**
   * 路由器使用的历史记录模式。大多数应用应该使用 BrowserRouter（对应 vue-router 的 createWebHistory）。
   * 也可以使用 HashRouter 实现基于 hash 的历史记录，无需配置服务器，但不利于 SEO。
   */
  basename: import.meta.env.BASE_URL // 基准路径，被预置到每个 URL 上，允许在域名子文件夹中托管 SPA
})

export default router
