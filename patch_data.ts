import fs from 'fs';
let content = fs.readFileSync('src/data.ts', 'utf-8');
content = content.replace("categorySlug === 'color-blocks'", "categorySlug === 'highlight-updates'");
// Also maybe change COLOR_BLOCKS to HIGHLIGHT_UPDATES ? 
// The user said "Change Amin panel Category and slug name color-blocks to Highlight Updates", not the codebase variable, but changing it might be cleaner.
// Let's leave COLOR_BLOCKS as is, or maybe we can change it if it's used directly.
fs.writeFileSync('src/data.ts', content);
