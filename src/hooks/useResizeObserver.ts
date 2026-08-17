import { useEffect, useRef, useState } from 'react'

/**
 * 组合式函数
 * 使用 ResizeObserver 观察 DOM 元素尺寸变化
 *
 * @param target 要观察的目标，可以是 HTMLElement 或 HTMLElement 数组
 * @param callback 当元素尺寸变化时调用的回调函数
 * @param options ResizeObserver 选项，用于定制观察行为
 * @returns 返回一个对象，包含停止和开始观察的方法
 */
export function useResizeObserver(
  target: Element | Element[] | null,
  callback: ResizeObserverCallback,
  options: ResizeObserverOptions = {}
): { start: () => void; stop: () => void } {
  const callbackRef = useRef(callback)
  const [stopped, setStopped] = useState(false)

  // 始终持有最新 callback，避免因 callback 变化重复创建 observer
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (stopped || !target) {
      return
    }
    const targets = Array.isArray(target) ? target : [target]
    if (targets.length === 0) {
      return
    }
    const observer = new ResizeObserver((entries, obs) => {
      callbackRef.current(entries, obs)
    })
    targets.forEach((el) => observer.observe(el, options))
    // 卸载时断开观察，避免内存泄漏
    return () => observer.disconnect()
  }, [target, options, stopped])

  const start = () => setStopped(false)
  const stop = () => setStopped(true)

  return {
    start,
    stop
  }
}
