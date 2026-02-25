#!/usr/bin/env node
/**
 * 推送脚本：一键 add + commit + push
 * 用法: npm run push
 *       npm run push "提交说明"
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const message = process.argv[2] || '更新博客';

const run = (cmd, options = {}) => {
  try {
    return execSync(cmd, {
      cwd: projectRoot,
      encoding: 'utf-8',
      ...options,
    });
  } catch (err) {
    if (err.stderr) process.stderr.write(err.stderr);
    process.exit(err.status || 1);
  }
};

const runArgs = (cmd, args, options = {}) => {
  const result = spawnSync(cmd, args, {
    cwd: projectRoot,
    encoding: 'utf-8',
    stdio: 'inherit',
    ...options,
  });
  if (result.status !== 0) process.exit(result.status || 1);
};

console.log('📦 检查变更...\n');
const status = run('git status --short');
if (!status.trim()) {
  console.log('没有需要提交的变更。');
  process.exit(0);
}

console.log('变更文件:');
console.log(status);
console.log('');

run('git add .');
console.log('✅ 已暂存所有变更');
runArgs('git', ['commit', '-m', message]);
console.log(`✅ 已提交: ${message}`);
run('git push origin main');
console.log('✅ 已推送到 origin/main');
console.log('\n🚀 GitHub Actions 将自动构建并部署到 GitHub Pages');
