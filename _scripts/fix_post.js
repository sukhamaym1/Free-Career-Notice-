import fs from 'fs';

let content = fs.readFileSync('src/pages/PostPage.tsx', 'utf-8');

// Replace the incorrect backslash escapes
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\`/g, '`');

fs.writeFileSync('src/pages/PostPage.tsx', content);
