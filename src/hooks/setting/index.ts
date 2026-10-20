import type { GlobConfig } from '#/config'

import { warn } from 'utils/log'
import { getAppEnvConfig } from 'utils/env'

export const getGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_IMG_URL
  } = getAppEnvConfig()

  // 与 utils/env.ts 的校验保持一致：缺少 ^$ 锚点时正则恒匹配，告警永不触发
  if (!/^[a-zA-Z_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    )
  }

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    imgUrl: VITE_GLOB_IMG_URL
  }
  return glob as Readonly<GlobConfig>
}
