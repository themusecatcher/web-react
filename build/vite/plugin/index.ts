import type { Plugin, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import { configCompressPlugin } from './compress.ts'
import { configCDNImportPlugin } from './cdn.ts'
import { configDevToolsPlugin } from './devtools.ts'
import { configHtmlPlugin } from './html.ts'
import { configInspectPlugin } from './inspect.ts'
import { configMockPlugin } from './mock.ts'
import { configVisualizerPlugin } from './visualizer.ts'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const {
    VITE_USE_MOCK,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_USE_CDN,
    VITE_ENABLE_INSPECT,
    VITE_ENABLE_ANALYZE
  } = viteEnv

  const vitePlugins: (Plugin | Plugin[] | PluginOption | PluginOption[])[] = [
    react(),
    svgr({
      // 用于支持在项目中以 React 组件的形式引入使用 SVG 文件
      // 用法：import Logo from '@/assets/logo.svg?react'
      svgrOptions: {
        icon: true
      }
    })
  ]

  // vite-plugin-compression
  if (isBuild) {
    vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE))
  }

  // vite-plugin-cdn-import
  if (VITE_USE_CDN) {
    vitePlugins.push(configCDNImportPlugin())
  }

  // vite-plugin-inspect（仅 dev 模式启用，防止误配置将调试插件带入生产构建）
  // 必须注册在 vite-plugin-html 之前：vite-plugin-html 的 SPA history fallback 中间件
  // （htmlAcceptHeaders: text/html）会拦截浏览器请求把 /__inspect/ 重写到 /index.html，
  // 导致 React Router 渲染 404。inspect 中间件先注册才能优先命中 302/sirv。
  if (VITE_ENABLE_INSPECT && !isBuild) {
    // @vitejs/devtools：跨框架 Vite DevTools 悬浮面板（⇧⌥D 切换）+ /__devtools/ 独立窗口，
    // vite-plugin-inspect 12.x 的 Inspect 面板依赖其作为宿主（页面注入 dock）
    vitePlugins.push(configDevToolsPlugin())
    vitePlugins.push(configInspectPlugin())
  }

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-mock
  if (VITE_USE_MOCK) {
    vitePlugins.push(configMockPlugin())
  }

  // rollup-plugin-visualizer
  if (VITE_ENABLE_ANALYZE) {
    vitePlugins.push(configVisualizerPlugin())
  }

  return vitePlugins
}
