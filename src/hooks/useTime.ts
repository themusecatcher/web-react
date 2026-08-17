import { useEffect, useState } from 'react'

/**
 * @description 获取本地时间
 */
export function useTime() {
  const [year, setYear] = useState(0) // 年份
  const [month, setMonth] = useState(0) // 月份
  const [week, setWeek] = useState('') // 星期几
  const [day, setDay] = useState(0) // 天数
  const [hour, setHour] = useState<number | string>(0) // 小时
  const [minute, setMinute] = useState<number | string>(0) // 分钟
  const [second, setSecond] = useState(0) // 秒

  useEffect(() => {
    // 更新时间
    const updateTime = () => {
      const date = new Date()
      setYear(date.getFullYear())
      setMonth(date.getMonth() + 1)
      setWeek('日一二三四五六'.charAt(date.getDay()))
      setDay(date.getDate())
      setHour((date.getHours() + '').padStart(2, '0'))
      setMinute((date.getMinutes() + '').padStart(2, '0'))
      setSecond(date.getSeconds())
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return { year, month, week, day, hour, minute, second }
}
