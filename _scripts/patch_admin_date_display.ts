import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

content = content.replace(
  /{job\.date}/g,
  "{new Date(job.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}"
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
console.log('Replaced date display successfully.');
