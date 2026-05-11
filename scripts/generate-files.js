const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html') && file !== 'index.html') {
      // ⭐ 关键：转成相对路径
      results.push(path.relative(process.cwd(), fullPath).replace(/\\/g, '/'));
    }
  });

  return results;
}

const files = walk(process.cwd());

console.log("FOUND FILES:", files);

fs.writeFileSync('files.json', JSON.stringify(files, null, 2));
