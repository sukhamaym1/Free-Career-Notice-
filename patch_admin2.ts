import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

// Replace parsedData.NEW_UPDATES.length with parsedData.COLOR_BLOCKS.length or simply remove that stat card
content = content.replace(/<div className="bg-white dark:bg-\[#1e293b\] rounded-xl p-6 border border-slate-200 dark:border-slate-700\/50 shadow-sm">\s*<div className="text-4xl font-bold text-blue-600 dark:text-\[#38bdf8\] mb-2">\{parsedData\.NEW_UPDATES\.length\}<\/div>\s*<div className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">New Updates<\/div>\s*<\/div>/g, '');

content = content.replace(/<option value="new-updates">New Updates<\/option>\s*/g, '');

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
