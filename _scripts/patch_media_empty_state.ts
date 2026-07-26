import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

content = content.replace(
  "{mediaFiles.length === 0 && (",
  "{mediaFiles.filter(f => f.name.toLowerCase().includes(mediaSearchQuery.toLowerCase())).length === 0 && ("
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
