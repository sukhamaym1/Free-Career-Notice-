import fs from 'fs';

let content = fs.readFileSync('src/data.ts', 'utf-8');

// Remove NEW_UPDATES export
content = content.replace(/export const NEW_UPDATES = publishedPosts\s*\.filter\(p => p\.categorySlug === 'new-updates'\)\s*\.map\(p => \(\{ title: p\.title, id: p\.id \}\)\);/g, '');

fs.writeFileSync('src/data.ts', content);
