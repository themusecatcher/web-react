// 占位文件：仅用于 vite build 阶段让 index.html 中 <script type="module" src="/app.config.js"> 可被解析（消除 "can't be bundled" 警告）。
// 构建完成后由 postBuild 脚本（esno ./build/script/postBuild.ts）生成真实配置覆盖此文件，勿在此维护真实配置。
// 变量名与 build/getConfigFileName.ts 生成规则保持一致（VITE_GLOB_APP_SHORT_NAME 大写去空格），仅作 postBuild 失败时的兜底。
// 注意：修改 .env 中 VITE_GLOB_APP_SHORT_NAME 后需同步更新此处的变量名，否则 postBuild 失败时兜底失效。
window.__PRODUCTION__REACT_TEMPLATE__CONF__ = {}
