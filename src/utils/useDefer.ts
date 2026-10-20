/**
 * 延迟执行的钩子函数（分步加载优化工具函数）
 * 该函数通过延迟加载优化白屏时间
 *
 * @param total - 表示一共有多少个需要延迟执行或加载的任务数量
 * @returns {function} - 返回一个函数，用于检查是否达到指定的帧数
 *                       当帧数达到或超过指定值时，返回 true，表示可以执行或进行渲染
 */

import { useEffect, useRef, useState } from 'react'

export function useDefer(total: number) {
  const [cur, setCur] = useState(0)
  // 帧计数收敛到实例内部（原模块级变量会被多个实例互相覆盖）；
  // 注意：帧计数与 rAF 句柄必须分开存储，混用同一 ref 会导致计数器被句柄值污染
  const frameRef = useRef(0)
  const totalRef = useRef(total)

  useEffect(() => {
    totalRef.current = total
    frameRef.current = 0
    let rafId = requestAnimationFrame(function updateFrame() {
      if (frameRef.current < totalRef.current) {
        frameRef.current += 1
        setCur(frameRef.current)
        rafId = requestAnimationFrame(updateFrame)
      }
    })
    // 卸载/依赖变化时取消未执行的帧，避免卸载后 setCur
    return () => cancelAnimationFrame(rafId)
  }, [total])

  return (n: number) => cur >= n
}
