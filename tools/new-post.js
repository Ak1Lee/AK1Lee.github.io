#!/usr/bin/env node
/**
 * 写作脚本：新建文章并打开编辑器
 * 用法: npm run new "文章标题"
 */

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const title = process.argv[2];
if (!title) {
  console.log('用法: npm run new "文章标题"');
  console.log('示例: npm run new "我的第一篇博客"');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const postsDir = path.join(projectRoot, 'source', '_posts');

try {
  // 1. 创建新文章
  console.log(`正在创建文章: ${title}`);
  execSync(`npx hexo new "${title}"`, {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  // 2. 获取创建的文件路径
  const filename = `${title}.md`;
  const filePath = path.join(postsDir, filename);

  if (!fs.existsSync(filePath)) {
    const files = fs.readdirSync(postsDir);
    const newFile = files.find((f) => f.endsWith('.md') && f.includes(title));
    if (newFile) {
      console.log(`文章已创建: source/_posts/${newFile}`);
    }
    process.exit(0);
    return;
  }

  console.log(`文章已创建: source/_posts/${filename}`);

  // 3. 打开编辑器（spawnSync 避免未捕获的 ENOENT 错误）
  const fullPath = path.resolve(filePath);
  const isWin = process.platform === 'win32';

  const openWith = (cmd, args) => {
    const r = spawnSync(cmd, args, { detached: true, stdio: 'ignore', windowsHide: true });
    return !r.error;
  };

  if (openWith('cursor', [fullPath])) {
    console.log('已在 Cursor 中打开');
  } else if (openWith('code', [fullPath])) {
    console.log('已在 VS Code 中打开');
  } else if (isWin) {
    execSync(`cmd /c start "" "${fullPath}"`);
    console.log('已用默认程序打开');
  } else {
    openWith('open', [fullPath]) || openWith('xdg-open', [fullPath]);
    console.log('已打开');
  }
} catch (err) {
  console.error('创建失败:', err.message);
  process.exit(1);
}
