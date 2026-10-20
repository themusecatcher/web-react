// 默认缓存期限为7天
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

/**
 * cookie 值解码兜底：旧版未编码写入或外部写入的脏值（含孤立 '%'）会使
 * decodeURIComponent 抛 URIError，此时原样返回，避免 getCookie 因单个坏值崩溃
 */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Storage 依赖的最小接口（DOM Storage 结构子集），
 * 便于测试注入内存实现，同时避免与本类同名全局类型冲突
 */
interface WebStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
}

/**
 * 创建本地缓存对象
 * @param {string=} prefixKey -
 * @param {Object} [storage=localStorage] - sessionStorage | localStorage
 */

export class Storage {
  private storage: WebStorage
  private prefixKey?: string

  constructor(prefixKey = '', storage: WebStorage = localStorage) {
    this.storage = storage
    this.prefixKey = prefixKey
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase()
  }

  /**
   * @description 设置缓存
   * @param {string} key 缓存键
   * @param {*} value 缓存值
   * @param expire
   */
  set(key: string, value: unknown, expire: number | null = DEFAULT_CACHE_TIME) {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null
    })
    try {
      this.storage.setItem(this.getKey(key), stringData)
    } catch (e) {
      // 隐私模式/存储配额已满时降级为警告，不阻断业务
      console.warn(`[storage] 写入缓存失败，key: ${key}`, e)
    }
  }

  /**
   * 读取缓存
   * @param {string=} key
   * @param {*=} def 默认值
   */
  get<T = unknown>(key: string, def: T | null = null): T | null {
    try {
      const item = this.storage.getItem(this.getKey(key))
      if (item) {
        const data = JSON.parse(item)
        const { value, expire } = data
        // 在有效期内直接返回
        if (expire === null || expire >= Date.now()) {
          return value
        }
        this.remove(key)
      }
    } catch (e) {
      // 存储不可用或内容损坏时返回默认值
      console.warn(`[storage] 读取缓存失败，key: ${key}`, e)
    }
    return def
  }

  /**
   * 从缓存删除某项
   * @param {string} key
   */
  remove(key: string) {
    try {
      this.storage.removeItem(this.getKey(key))
    } catch (e) {
      console.warn(`[storage] 删除缓存失败，key: ${key}`, e)
    }
  }

  /**
   * 清空所有缓存
   * @memberOf Cache
   */
  clear(): void {
    try {
      this.storage.clear()
    } catch (e) {
      console.warn('[storage] 清空缓存失败', e)
    }
  }

  /**
   * 设置cookie
   * @param {string} name cookie 名称
   * @param {*} value cookie 值
   * @param {number=} expire 过期时间，传 null 表示关闭浏览器后自动删除（不设置 Max-Age）
   * @example
   */
  setCookie(name: string, value: string | number, expire: number | null = DEFAULT_CACHE_TIME) {
    // value 必须编码：未编码的 ';' / 换行 / 非 ASCII 会截断 cookie 甚至注入额外属性
    const kv = `${this.getKey(name)}=${encodeURIComponent(value)}`
    // expire 为 null 时不能拼出 "Max-Age=null"（无效属性），此时应为会话级 cookie
    document.cookie = expire === null ? kv : `${kv}; Max-Age=${expire}`
  }

  /**
   * 根据名字获取cookie值
   * @param name
   */
  getCookie(name: string): string {
    const cookieArr = document.cookie.split('; ')
    for (let i = 0, length = cookieArr.length; i < length; i++) {
      const kv = cookieArr[i]?.split('=')
      if (kv?.[0] === this.getKey(name)) {
        // 与 setCookie 的 encodeURIComponent 对应；缺 '=' 时返回空串
        return kv[1] === undefined ? '' : safeDecode(kv[1])
      }
    }
    return ''
  }

  /**
   * 根据名字删除指定的cookie
   * @param {string} key
   */
  removeCookie(key: string) {
    this.setCookie(key, 1, -1)
  }

  /**
   * 清空cookie，使所有cookie失效
   */
  clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
      for (let i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
      }
    }
  }
}
const storage = new Storage('')

export default storage
