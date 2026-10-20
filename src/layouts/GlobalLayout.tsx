import { useEffect } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router-dom'
import styles from './GlobalLayout.module.less'

export default function GlobalLayout() {
  const matches = useMatches()
  const location = useLocation()
  const currentMatch = matches[matches.length - 1]
  const title = (currentMatch?.handle as { title?: string } | undefined)?.title

  // 注册全局前置逻辑（等价于 vue-router 的 beforeEach 守卫 + scrollBehavior）
  useEffect(() => {
    const domTitle = title
    const appTitle = import.meta.env.VITE_GLOB_APP_TITLE
    // 末级路由未配置 handle.title 时不能拼出 "undefined - xxx"
    document.title = domTitle ? `${domTitle} - ${appTitle}` : appTitle
    // 滚动行为
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  }, [title, location.pathname])

  return (
    <div className={styles['global-layout']}>
      <Outlet />
    </div>
  )
}
