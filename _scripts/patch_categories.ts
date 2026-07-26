import fs from 'fs';
let content = JSON.parse(fs.readFileSync('content/categories.json', 'utf-8'));
for (const cat of content) {
  if (cat.slug === 'color-blocks') {
    cat.slug = 'highlight-updates';
  }
}
fs.writeFileSync('content/categories.json', JSON.stringify(content, null, 2));
