import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf-8');

// Add tags to mapped output
content = content.replace(/tag: p\.tags\?\.\[0\] \|\| '',/g, "tag: p.tags?.[0] || '', tags: p.tags || [],");

fs.writeFileSync('src/data.ts', content);
