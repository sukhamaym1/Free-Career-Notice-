import fs from 'fs';
let content = fs.readFileSync('src/data.ts', 'utf-8');

const targetStr = "const publishedPosts = rawPosts.filter((p: any) => p.status !== 'draft');";
const replacementStr = "const publishedPosts = rawPosts.filter((p: any) => {\n  if (p.status === 'draft') return false;\n  if (p.date) {\n    const d = new Date(p.date);\n    if (!isNaN(d.getTime()) && d > new Date()) {\n      return false; // Scheduled for future\n    }\n  }\n  return true;\n});";

content = content.replace(targetStr, replacementStr);
fs.writeFileSync('src/data.ts', content);
