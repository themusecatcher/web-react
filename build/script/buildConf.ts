/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant.ts'
import fs from 'fs-extra'
import chalk from 'chalk'

import { getRootPath, getEnvConfig } from '../utils.ts'
import { getConfigFileName } from '../getConfigFileName.ts'

import pkg from '../../package.json' with { type: 'json' }

function createConfig(
  {
    configName,
    config,
    configFileName = GLOB_CONFIG_FILE_NAME
  }: { configName: string; config: any; configFileName?: string } = { configName: '', config: {} }
) {
  try {
    const windowConf = `window.${configName}`
    // Ensure that the variable will not be modified
    // 注意：不能用 .replace(/\s/g, '') 压缩产物——它会把字符串值内的空格一并剥掉
    // （如 title "Web React Template" 被腐蚀为 "WebReactTemplate"），改为直接输出单行
    const configStr = `${windowConf}=${JSON.stringify(config)};Object.freeze(${windowConf});Object.defineProperty(window,"${configName}",{configurable:false,writable:false});`
    fs.mkdirp(getRootPath(OUTPUT_DIR))
    fs.outputFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr)

    console.log(chalk.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`)
    console.log(chalk.gray(OUTPUT_DIR + '/' + chalk.green(configFileName)) + '\n')
  } catch (error) {
    console.log(chalk.red('configuration file configuration file failed to package:\n' + error))
  }
}

export function runBuildConfig() {
  const config = getEnvConfig()
  const configFileName = getConfigFileName(config)
  createConfig({ config, configName: configFileName })
}
