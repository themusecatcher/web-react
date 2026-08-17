import js from '@eslint/js' // ESLint 官方推荐的 JavaScript 基础规则
import globals from 'globals' // 提供浏览器等环境的全局变量定义
import reactHooks from 'eslint-plugin-react-hooks' // React Hooks 规则（rules-of-hooks / exhaustive-deps 等）
import reactRefresh from 'eslint-plugin-react-refresh' // React Fast Refresh 相关约束
import tseslint from 'typescript-eslint' // 为 TypeScript 提供开箱即用的 ESLint 规则
import eslintConfigPrettier from 'eslint-config-prettier' // 解决 ESLint 和 Prettier 的规则冲突

export default tseslint.config(
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  {
    name: 'app/files-to-lint',
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // 添加自定义规则
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off'
    }
  },

  eslintConfigPrettier // 关闭所有与 Prettier 冲突的 ESLint 规则 (必须放在后面，确保正确覆盖冲突规则，否则无效)
)
