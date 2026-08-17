/**
 * 延迟执行的钩子函数（分步加载优化工具函数）
 * 该函数通过延迟加载优化白屏时间
 *
 * @param total - 表示一共有多少个需要延迟执行或加载的任务数量
 * @returns {function} - 返回一个函数，用于检查是否达到指定的帧数
 *                       当帧数达到或超过指定值时，返回 true，表示可以执行或进行渲染
 */

import { useEffect, useState } from 'react'

let totalFrame = 0
let frame = 0

export function useDefer(total: number) {
  const [cur, setCur] = useState(0)

  useEffect(() => {
    totalFrame = total
    frame = 0
    const updateFrame = () => {
      if (frame < totalFrame) {
        frame++
        setCur(frame)
        requestAnimationFrame(updateFrame)
      }
    }
    requestAnimationFrame(updateFrame)
  }, [total])

  return (n: number) => cur >= n
}
