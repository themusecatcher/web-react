import type { MessageInstance } from 'antd/es/message/interface'
import type { HookAPI as ModalHookAPI } from 'antd/es/modal/useModal'

export {}

declare global {
  // antd 命令式 api，由 App.tsx 中 <App> 的 useApp 挂载到 window，
  // 供 axios 拦截器等组件外场景调用；应用卸载后移除，故为可选
  interface Window {
    $message?: MessageInstance
    $modal?: ModalHookAPI
  }

  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
      dependencies: Recordable<string>
      devDependencies: Recordable<string>
    }
    lastBuildTime: string
  }

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P]
  }

  declare type Nullable<T> = T | null
  declare type NonNullable<T> = T extends null | undefined ? never : T
  declare type Recordable<T = any> = Record<string, T>
  declare type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }
  declare type Indexable<T = any> = {
    [key: string]: T
  }
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>
  }
  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  // 收敛 import.meta.env 的具体键类型（与 vite/client 的索引签名合并，保留自动补全）；
  // 空扩展接口为有意的接口合并模式，仅为挂载 ViteEnv 键类型
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ImportMetaEnv extends ViteEnv {}

  declare interface ViteEnv {
    // 仅开发模式定义（vite.config.ts server 配置消费）
    VITE_PORT?: number
    VITE_PROXY?: [string, string][]
    VITE_ENABLE_INSPECT?: boolean
    // 是否开启 mock（development 为 true，production/analyze 为 false/未定义）
    VITE_USE_MOCK?: boolean
    VITE_PUBLIC_PATH: string
    VITE_GLOB_APP_TITLE: string
    VITE_GLOB_APP_SHORT_NAME: string
    // 仅生产/分析模式定义（createVitePlugins 消费）
    VITE_USE_CDN?: boolean
    // 注：运行时支持逗号组合（如 'gzip,brotli' 同时输出两种压缩产物），此处类型仅约束常规单值写法
    VITE_BUILD_COMPRESS?: 'gzip' | 'brotli' | 'none'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE?: boolean
    VITE_ENABLE_ANALYZE?: boolean
    // 运行时全局配置（app.config.js 注入，见 utils/env.ts getAppEnvConfig）
    VITE_GLOB_API_URL: string
    VITE_GLOB_API_URL_PREFIX?: string
    VITE_GLOB_UPLOAD_URL?: string
    VITE_GLOB_IMG_URL?: string
  }
}
