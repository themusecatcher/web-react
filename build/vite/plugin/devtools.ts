/**
 * Vite DevTools（跨框架，React 侧对应 web-vue 的 vite-plugin-vue-devtools）
 * https://devtools.vite.dev/guide/
 *
 * @vitejs/devtools 提供两种入口：
 * 1. 页面内悬浮 dock（默认 visible，⇧⌥D 切换），Inspect 面板作为其内置面板
 * 2. 独立窗口页面 http://localhost:端口/__devtools/
 */
import { DevTools } from '@vitejs/devtools'
import type { Plugin, PluginOption } from 'vite'
import chalk from 'chalk'

export function configDevToolsPlugin(): PluginOption {
  return [DevTools(), devtoolsUrlHintPlugin()]
}

/**
 * vite-plugin-html 的 SPA history fallback 中间件（connect-history-api-fallback）
 * 只对带 Accept: text/html 的 GET 请求生效，会把 /__devtools/、/_devframes_plugin_terminals/
 * 等 SPA 路径重写为 /index.html。而 @vitejs/devtools 自身中间件（enforce: "post"）
 * 以及 devframe 的 devframe:<id> 中间件（默认 normal）注册都晚于 history fallback（pre），
 * 无法靠插件顺序解决。这里注册一个更早的 pre 中间件，对 devtools/devframes 路径
 * 临时剥离 Accept 头，使 history fallback 跳过重写，请求直达对应中间件。
 *
 * 同时仿照 web-vue 的 vite-plugin-vue-devtools 做法包裹 server.printUrls，
 * 在 dev 启动时打印 devtools 访问地址与快捷键提示。
 */
function devtoolsUrlHintPlugin(): Plugin {
  return {
    name: 'devtools-url-hint',
    enforce: 'pre',
    apply: 'serve',
    configureServer(server) {
      // 放行 devtools / devframes（terminals、messages、inspect 等子面板）请求，
      // 避免被 history fallback 重写到 index.html
      server.middlewares.use((req, _res, next) => {
        // 注意：devframe base 是 `/__devframes_plugin_xxx/`（双下划线），
        // vite devtools 是 `/__devtools/`（双下划线）。单下划线变体兜底匹配。
        if (
          req.url?.startsWith('/__devtools') ||
          req.url?.startsWith('/__devframes') ||
          req.url?.startsWith('/_devtools') ||
          req.url?.startsWith('/_devframes')
        ) {
          delete req.headers.accept
        }
        next()
      })

      // 终端打印 devtools 访问地址
      const _printUrls = server.printUrls
      const colorUrl = (url: string) =>
        chalk.cyan(url.replace(/:(\d+)\//, (_, port: string) => `:${chalk.bold(port)}/`))
      server.printUrls = () => {
        _printUrls()
        for (const url of server.resolvedUrls?.local ?? []) {
          const devtoolsUrl = url.endsWith('/') ? `${url}__devtools/` : `${url}/__devtools/`
          console.log(
            `  ${chalk.green('➜')}  ${chalk.bold('Vite DevTools')}: ${chalk.green(`Open ${colorUrl(devtoolsUrl)} as a separate window`)}`
          )
        }
        console.log(
          `  ${chalk.green('➜')}  ${chalk.bold('Vite DevTools')}: ${chalk.green('Press Option(⌥)+Shift(⇧)+D in App to toggle the Vite DevTools')}`
        )
      }
    }
  }
}
