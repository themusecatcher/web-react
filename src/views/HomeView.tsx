import type { CSSProperties } from 'react'
import { Flex } from 'antd'

const gradientTextStyle: CSSProperties = {
  fontSize: 36,
  fontWeight: 500,
  backgroundImage: 'linear-gradient(90deg, #09c8ce, #eb2f96)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent'
}

export default function HomeView() {
  return (
    <Flex style={{ padding: '60px' }} justify="center">
      <div style={gradientTextStyle}>欢迎使用 web-react 模板项目</div>
    </Flex>
  )
}
