import fs from 'fs';
import path from 'path';

const postsDir = 'content/posts';
const files = fs.readdirSync(postsDir);
for (const file of files) {
  if (file.endsWith('.json')) {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('"color-blocks"')) {
      content = content.replace(/"color-blocks"/g, '"highlight-updates"');
      fs.writeFileSync(filePath, content);
    }
  }
}
