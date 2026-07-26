import fs from 'fs';
let content = fs.readFileSync('src/pages/SearchPage.tsx', 'utf-8');

content = content.replace(
  "<span>{item.date || 'March 2026'}</span>",
  "<span>{item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'March 2026'}</span>"
);

fs.writeFileSync('src/pages/SearchPage.tsx', content);
console.log('Replaced SearchPage.tsx date successfully.');
