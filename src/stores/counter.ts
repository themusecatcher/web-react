import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
}

// `create()` 的返回值命名是自由的，但建议以 `use` 开头、以 `Store` 结尾（如 useUserStore、useCartStore）
// doubleCount 为派生值（对应 pinia 的 computed getter），通过 selector 计算：useCounterStore((s) => s.count * 2)
export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))
