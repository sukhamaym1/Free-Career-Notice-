import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');
content = content.replace(/value="color-blocks"/g, 'value="highlight-updates"');
content = content.replace("categorySlug === 'color-blocks'", "categorySlug === 'highlight-updates'");
fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
