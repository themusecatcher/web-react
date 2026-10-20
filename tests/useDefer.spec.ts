import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDefer } from '../src/utils/useDefer'

/**
 * useDefer 契约测试
 *
 * 该 hook 内部同时存在「帧计数」与「requestAnimationFrame 句柄」两个量，
 * 历史上曾因混用同一 ref 导致帧数被句柄值污染（表现为任务提前/错乱解锁），
 * 且卸载后仍会 setCur。此处逐项锁定契约。
 */

// React 18+ 在无 testing-library 的环境下需手动声明 act 环境
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

describe('useDefer', () => {
  // 挂起的帧：句柄从 100 开始，若实现把句柄写进计数器，帧数会变成 100+ 从而直接暴露
  let pending: { id: number; cb: FrameRequestCallback }[]
  let nextRafId: number
  const cancelledIds: number[] = []

  beforeEach(() => {
    pending = []
    cancelledIds.length = 0
    nextRafId = 100
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      const id = nextRafId++
      pending.push({ id, cb })
      return id
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      cancelledIds.push(id)
      pending = pending.filter((frame) => frame.id !== id)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function mountHook(total: number) {
    const holder: { defer: (n: number) => boolean } = { defer: () => false }
    function Comp() {
      holder.defer = useDefer(total)
      return null
    }
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    // 异步 act：确保被动 effect（rAF 调度）已 flush
    await act(async () => {
      root.render(createElement(Comp))
    })
    return {
      // 注意：必须经 getter 读取，不能解构快照——重渲染后 holder.defer 会指向新闭包
      get defer() {
        return holder.defer
      },
      async unmount() {
        await act(async () => {
          root.unmount()
        })
        container.remove()
      }
    }
  }

  // 同步触发当前挂起的全部帧回调（快照后执行，允许回调内调度下一帧）
  async function flushFrame() {
    const frames = pending
    pending = []
    await act(async () => {
      frames.forEach((frame) => frame.cb(0))
    })
  }

  it('初始时所有任务都未达帧', async () => {
    const hook = await mountHook(3)
    expect(hook.defer(1)).toBe(false)
    expect(hook.defer(3)).toBe(false)
  })

  it('每触发一帧解锁一个任务，帧数不被 rAF 句柄污染', async () => {
    const hook = await mountHook(3)
    await flushFrame()
    expect(hook.defer(1)).toBe(true)
    expect(hook.defer(2)).toBe(false)
    await flushFrame()
    expect(hook.defer(2)).toBe(true)
    expect(hook.defer(3)).toBe(false)
    await flushFrame()
    expect(hook.defer(3)).toBe(true)
    // 达到 total 后不再调度新帧，也不会解锁超出 total 的任务
    await flushFrame()
    expect(hook.defer(4)).toBe(false)
  })

  it('卸载时取消未执行的帧，卸载后不再有状态更新', async () => {
    const hook = await mountHook(2)
    await flushFrame()
    expect(hook.defer(1)).toBe(true)
    await hook.unmount()
    // 未执行的帧已被取消（pending 清空且记录到取消列表）
    expect(cancelledIds.length).toBeGreaterThan(0)
    expect(pending).toHaveLength(0)
    // 卸载后 flush 不再产生任何帧回调，状态冻结在卸载前
    await flushFrame()
    expect(hook.defer(2)).toBe(false)
  })

  it('total 变化时重新从第 0 帧开始计数', async () => {
    const holder: { defer: (n: number) => boolean } = { defer: () => false }
    function Comp(props: { total: number }) {
      holder.defer = useDefer(props.total)
      return null
    }
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = createRoot(container)
    await act(async () => {
      root.render(createElement(Comp, { total: 2 }))
    })
    await flushFrame()
    await flushFrame()
    expect(holder.defer(2)).toBe(true)
    // total 增大后重新计数，解锁状态随之重置
    await act(async () => {
      root.render(createElement(Comp, { total: 4 }))
    })
    expect(holder.defer(3)).toBe(false)
    await flushFrame()
    await flushFrame()
    expect(holder.defer(2)).toBe(true)
    await flushFrame()
    expect(holder.defer(3)).toBe(true)
    await act(async () => {
      root.unmount()
    })
    container.remove()
  })
})
