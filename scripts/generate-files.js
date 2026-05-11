const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walk(dir, list = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);
    const rel = path.relative(ROOT, full);

    // 忽略
    if (rel.startsWith('.')) continue;
    if (rel.includes('node_modules')) continue;
    if (rel.includes('.git')) continue;

    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full, list);
    } else if (file.endsWith('.html') && file !== 'index.html') {
      list.push(rel.replace(/\\/g, '/'));
    }
  }

  return list;
}

const result = walk(ROOT);

fs.writeFileSync(
  path.join(ROOT, 'files.json'),
  JSON.stringify(result, null, 2)
);

console.log('✅ files.json updated');
