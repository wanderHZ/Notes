const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// 递归扫描
function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const relPath = path.relative(ROOT_DIR, fullPath);

        if (file.startsWith('.')) return; // 忽略隐藏文件
        if (relPath.includes('node_modules')) return;

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walk(fullPath, fileList);
        } else if (file.endsWith('.html') && file !== 'index.html') {
            fileList.push(relPath.replace(/\\/g, '/'));
        }
    });

    return fileList;
}

// 生成 JSON
const files = walk(ROOT_DIR);

fs.writeFileSync(
    path.join(ROOT_DIR, 'files.json'),
    JSON.stringify(files, null, 2)
);

console.log('✅ files.json generated!');